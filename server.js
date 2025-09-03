import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import crypto from 'crypto';
import nodemailer from 'nodemailer';


dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

// ENV
const PORT       = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '1908';
const DB_NAME = process.env.DB_NAME || 'portal_alerta';

// RESET PASSWORD
const {
  APP_BASE_URL,
  SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM
} = process.env;

const mailer = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT || 587),
  secure: String(SMTP_SECURE) === 'true', // true solo si 465
  auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined
});


// DB POOL
const pool = await mysql.createPool({
  host: DB_HOST, port: DB_PORT, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
  waitForConnections: true, connectionLimit: 10, namedPlaceholders: true
});

// Middlewares
app.use(helmet({ contentSecurityPolicy: false })); // CSP completo: activalo en prod y ajusta fuentes
app.use(express.json());
app.use(cookieParser());

// --- Middleware que redirige a /login.html si no hay sesión ---
function needsAuthRedirect(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) return res.redirect('/login.html');
    // usa el mismo secreto que ya definiste
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch {
    return res.redirect('/login.html');
  }
}

// Home "/" protegido: si hay sesión, sirve tu index.html
app.get('/', needsAuthRedirect, (req, res) => {
  return res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Páginas HTML del portal que también querés proteger
const protectedHtml = ['/index.html', '/modulo.html', '/test.html', '/test-modulo.html'];

// Estas rutas sólo validan y dejan pasar; el archivo lo sirve luego express.static
app.get(protectedHtml, needsAuthRedirect, (req, res, next) => next());

// Home: si no está logueado, al login
app.get('/login.html', (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return next();
  try {
    jwt.verify(token, JWT_SECRET);
    return res.redirect('/'); // ya está logueado
  } catch { return next(); }
});

app.get('/register.html', (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return next();
  try {
    jwt.verify(token, JWT_SECRET);
    return res.redirect('/'); // ya logueado
  } catch { return next(); }
});


app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/javascript', express.static(path.join(__dirname, 'javascript')));
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));

// Rate limit login
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/login', loginLimiter);

// Rate limit register
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 30,                  // hasta 30 registros/hora (ajustable)
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/register', registerLimiter);

// Rate Limit password 

const forgotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/password/forgot', forgotLimiter);



// Captchas en memoria
const CAPTCHAS = new Map();
const CAPTCHA_TTL_MS = 5 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [k, v] of CAPTCHAS.entries()) if (v.expires < now) CAPTCHAS.delete(k);
}, 60 * 1000);

// Helpers DB
async function getUserByUsername(username) {
  const [rows] = await pool.execute(
    'SELECT id, username, password_hash FROM users WHERE username = :u LIMIT 1', { u: username }
  );
  return rows[0] || null;
}

async function insertAudit({ username, success, ip, userAgent }) {
  await pool.execute(
    `INSERT INTO login_audit (username, success, ip, user_agent)
     VALUES (:u, :s, :ip, :ua)`,
    { u: username, s: success ? 1 : 0, ip, ua: userAgent?.slice(0,255) || null }
  );
}

// --- CAPTCHA ---
app.get('/api/captcha', (req, res) => {
  const a = Math.floor(Math.random() * 40) + 10;
  const b = Math.floor(Math.random() * 40) + 10;
  const answer = String(a + b);
  const id = uuidv4();
  CAPTCHAS.set(id, { answer, expires: Date.now() + CAPTCHA_TTL_MS });
  res.json({ captchaId: id, question: `¿Cuánto es ${a} + ${b}?` });
});

// --- LOGIN ---
app.post('/api/login', async (req, res) => {
  try {
    const { username, password, captchaId, captchaAnswer } = req.body || {};
    const ip  = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.socket.remoteAddress;
    const ua  = req.headers['user-agent'] || '';

    if (!username || !password) {
      return res.status(400).json({ ok:false, error:'Faltan credenciales.' });
    }

    const cap = CAPTCHAS.get(captchaId);
    CAPTCHAS.delete(captchaId); // un solo uso
    if (!cap || cap.expires < Date.now() || String(captchaAnswer).trim() !== cap.answer) {
      await insertAudit({ username: String(username), success: false, ip, userAgent: ua });
      return res.status(400).json({ ok:false, error:'CAPTCHA inválido o vencido.' });
    }

    const user = await getUserByUsername(String(username));
    if (!user) {
      await insertAudit({ username: String(username), success: false, ip, userAgent: ua });
      return res.status(401).json({ ok:false, error:'Credenciales inválidas.' });
    }

    const ok = await bcrypt.compare(String(password), user.password_hash);
    if (!ok) {
      await insertAudit({ username: user.username, success: false, ip, userAgent: ua });
      return res.status(401).json({ ok:false, error:'Credenciales inválidas.' });
    }

    const token = jwt.sign({ sub: user.username, uid: user.id }, JWT_SECRET, { expiresIn: '2h' });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false, // en prod con HTTPS => true
      maxAge: 2 * 60 * 60 * 1000
    });

    await insertAudit({ username: user.username, success: true, ip, userAgent: ua });
    res.json({ ok:true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, error:'Error interno' });
  }
}); 

// REGISTRER (con email)
app.post('/api/register', async (req, res) => {
  try {
    const { dni, password, email, captchaId, captchaAnswer } = req.body || {};
    const ip  = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.socket.remoteAddress;
    const ua  = req.headers['user-agent'] || '';

    // ---- Validaciones básicas ----
    if (!dni || !password || !email) {
      return res.status(400).json({ ok:false, error:'Faltan DNI, contraseña o correo.' });
    }

    // DNI argentino típico: 7 a 9 dígitos
    if (!/^\d{7,9}$/.test(String(dni))) {
      return res.status(400).json({ ok:false, error:'DNI inválido. Debe tener entre 7 y 9 dígitos.' });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ ok:false, error:'La contraseña debe tener al menos 6 caracteres.' });
    }

    // Email formato básico
    const emailNorm = String(email).trim().toLowerCase();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(emailNorm)) {
      return res.status(400).json({ ok:false, error:'Correo inválido.' });
    }

    // (Opcional) Forzar dominio institucional:
    // const allowedDomain = '@uncuyo.edu.ar';
    // if (!emailNorm.endsWith(allowedDomain)) {
    //   return res.status(400).json({ ok:false, error:`Usá tu correo institucional (${allowedDomain}).` });
    // }

    // ---- CAPTCHA ----
    const cap = CAPTCHAS.get(captchaId);
    CAPTCHAS.delete(captchaId); // un solo uso
    if (!cap || cap.expires < Date.now() || String(captchaAnswer).trim() !== cap.answer) {
      return res.status(400).json({ ok:false, error:'CAPTCHA inválido o vencido.' });
    }

    // ---- Chequear duplicados ----
    // por DNI (username)
    const [existsUser] = await pool.execute(
      'SELECT id FROM users WHERE username = :u LIMIT 1',
      { u: String(dni) }
    );
    if (existsUser.length) {
      return res.status(409).json({ ok:false, error:'Ese DNI ya está registrado.' });
    }

    // por email
    const [existsEmail] = await pool.execute(
      'SELECT id FROM users WHERE email = :e LIMIT 1',
      { e: emailNorm }
    );
    if (existsEmail.length) {
      return res.status(409).json({ ok:false, error:'Ese correo ya está registrado.' });
    }

    // ---- Crear usuario ----
    const hash = bcrypt.hashSync(String(password), 12);
    await pool.execute(
      'INSERT INTO users (username, email, password_hash) VALUES (:u, :e, :h)',
      { u: String(dni), e: emailNorm, h: hash }
    );

    // Auditoría (opcional): dejar trazado el alta como “success”
    await insertAudit({ username: String(dni), success: true, ip, userAgent: ua });

    // No auto-logueamos: redirigirlo al login
    return res.json({ ok:true, message:'Registro creado. Iniciá sesión.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok:false, error:'Error registrando usuario' });
  }
});

// RESET PASSWORD 

app.post('/api/password/forgot', async (req, res) => {
  try {
    const { dni, email /* , captchaId, captchaAnswer */ } = req.body || {};

    // (Opcional) Validar CAPTCHA si ves abuso
    // const cap = CAPTCHAS.get(captchaId);
    // CAPTCHAS.delete(captchaId);
    // if (!cap || cap.expires < Date.now() || String(captchaAnswer).trim() !== cap.answer) {
    //   return res.json({ ok:true, message:'Si existe una cuenta, enviaremos instrucciones.' });
    // }

    // Buscar usuario por DNI o email
    let user = null;
    if (dni) {
      const [r] = await pool.execute(
        'SELECT id, username, email FROM users WHERE username = :u LIMIT 1',
        { u: String(dni).trim() }
      );
      user = r[0] || null;
    } else if (email) {
      const [r] = await pool.execute(
        'SELECT id, username, email FROM users WHERE email = :e LIMIT 1',
        { e: String(email).trim().toLowerCase() }
      );
      user = r[0] || null;
    }

    // Respuesta genérica (no enumerar usuarios)
    const GENERIC = { ok:true, message:'Si existe una cuenta, enviaremos instrucciones a su correo.' };

    if (!user || !user.email) {
      return res.json(GENERIC);
    }

    // Generar token y guardar HASH + expiración
    const rawToken  = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min

    await pool.execute(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
       VALUES (:uid, :th, :exp)`,
      { uid: user.id, th: tokenHash, exp: expiresAt }
    );

    const base = (APP_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');
    const resetUrl = `${base}/password-reset.html?token=${rawToken}`;

    try {
      await mailer.sendMail({
        from: SMTP_FROM,
        to: user.email,
        subject: 'Recuperación de contraseña – A.L.E.R.T.A. UNCuyo',
        text:
`Hola,

Recibimos una solicitud para restablecer tu contraseña.
Si fuiste vos, hacé clic en el siguiente enlace (válido por 30 minutos):

${resetUrl}

Si no solicitaste este cambio, ignorá este mensaje.`,
        html:
`<p>Hola,</p>
<p>Recibimos una solicitud para restablecer tu contraseña.</p>
<p>Si fuiste vos, hacé clic en el siguiente enlace (válido por 30 minutos):</p>
<p><a href="${resetUrl}">${resetUrl}</a></p>
<p>Si no solicitaste este cambio, ignorá este mensaje.</p>`
      });
    } catch (e) {
      console.error('Email error:', e);
      // Igual devolvemos mensaje genérico
    }

    return res.json(GENERIC);
  } catch (err) {
    console.error(err);
    return res.json({ ok:true, message:'Si existe una cuenta, enviaremos instrucciones.' });
  }
});


// PASSWORD RESET

app.post('/api/password/reset', async (req, res) => {
  try {
    const { token, newPassword } = req.body || {};
    if (!token || !newPassword) {
      return res.status(400).json({ ok:false, error:'Datos incompletos.' });
    }
    if (String(newPassword).length < 8) {
      return res.status(400).json({ ok:false, error:'La nueva contraseña debe tener al menos 8 caracteres.' });
    }

    const tokenHash = crypto.createHash('sha256').update(String(token)).digest('hex');

    const [rows] = await pool.execute(
      `SELECT id, user_id AS userId, expires_at AS expiresAt, used_at AS usedAt
         FROM password_reset_tokens
        WHERE token_hash = :th
        LIMIT 1`,
      { th: tokenHash }
    );

    const row = rows[0];
    const FAIL = { ok:false, error:'Token inválido o expirado.' };

    if (!row) return res.status(400).json(FAIL);
    if (row.usedAt) return res.status(400).json(FAIL);
    if (new Date(row.expiresAt).getTime() < Date.now()) return res.status(400).json(FAIL);

    // Guardar nueva contraseña
    const hash = bcrypt.hashSync(String(newPassword), 12);
    await pool.execute(
      `UPDATE users SET password_hash = :ph WHERE id = :uid`,
      { ph: hash, uid: row.userId }
    );

    // Marcar token como usado
    await pool.execute(
      `UPDATE password_reset_tokens SET used_at = NOW() WHERE id = :id`,
      { id: row.id }
    );

    return res.json({ ok:true, message:'Contraseña actualizada. Ya podés iniciar sesión.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok:false, error:'Error interno' });
  }
});



// LOGOUT
app.post('/api/logout', (req, res) => {
  res.clearCookie('token', { httpOnly:true, sameSite:'strict', secure:false });
  res.json({ ok:true });
});

// Auth middleware
function auth(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ ok:false, error:'No autenticado' });
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ ok:false, error:'Sesión inválida' });
  }
}

// --- Guardar resultado de módulo ---
app.post('/api/results', auth, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { moduloId, puntaje, total, aprobado, puntaje_pct, ids } = req.body || {};
    if (!moduloId || total == null || puntaje == null || puntaje_pct == null) {
      return res.status(400).json({ ok:false, error:'Payload incompleto' });
    }

    // Inserta historial
    const [r] = await pool.execute(
      `INSERT INTO module_results
         (user_id, module_id, score, total, passed, passed_pct, question_ids)
       VALUES (:uid, :mid, :s, :t, :p, :pct, :q)`,
      {
        uid, mid: Number(moduloId),
        s: Number(puntaje), t: Number(total),
        p: aprobado ? 1 : 0, pct: Number(puntaje_pct),
        q: ids || null
      }
    );
    const resultId = r.insertId;

    // UPSERT estado último
    await pool.execute(
      `INSERT INTO user_module_status
          (user_id, module_id, last_result_id, last_passed, last_score, last_total, last_pct)
       VALUES (:uid, :mid, :rid, :p, :s, :t, :pct)
       ON DUPLICATE KEY UPDATE
          last_result_id = VALUES(last_result_id),
          last_passed    = VALUES(last_passed),
          last_score     = VALUES(last_score),
          last_total     = VALUES(last_total),
          last_pct       = VALUES(last_pct)`,
      { uid, mid: Number(moduloId), rid: resultId,
        p: aprobado ? 1 : 0, s: Number(puntaje),
        t: Number(total), pct: Number(puntaje_pct) }
    );

    res.json({ ok:true, resultId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, error:'Error guardando resultado' });
  }
});

// --- Ver progreso (último estado por módulo) ---
app.get('/api/my-progress', auth, async (req, res) => {
  try {
    const uid = req.user.uid;
    const [rows] = await pool.execute(
      `SELECT m.id AS moduleId, m.title AS moduleTitle,
              s.last_passed AS passed, s.last_score AS score,
              s.last_total AS total, s.last_pct AS pct, s.updated_at
         FROM modules m
    LEFT JOIN user_module_status s
           ON s.module_id = m.id AND s.user_id = :uid
     ORDER BY m.id`,
      { uid }
    );
    res.json({ ok:true, progress: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, error:'Error consultando progreso' });
  }
});
// ---- Config: cantidad de módulos requeridos para el certificado ----
const REQUIRED_MODULES = 7; // cambialo a 9 cuando habilites los 9 módulos

app.get('/api/certificate-eligibility', auth, async (req, res) => {
  try {
    const uid  = req.user.uid;
    const year = new Date().getFullYear();
    const LIM  = Number.isInteger(REQUIRED_MODULES) ? REQUIRED_MODULES : 7;

    // Progreso (primeros N módulos por id)
    const [rows] = await pool.execute(
      `SELECT m.id AS moduleId, COALESCE(s.last_passed, NULL) AS passed
         FROM modules m
    LEFT JOIN user_module_status s
           ON s.module_id = m.id AND s.user_id = :uid
     ORDER BY m.id
         LIMIT ${LIM}`,
      { uid }
    );

    const approved = rows.filter(r => r.passed === 1).length;
    const missingIds = rows.filter(r => r.passed !== 1).map(r => r.moduleId);
    const eligible = approved >= LIM;

    // ¿Ya existe solicitud este año?
    const [reqRows] = await pool.execute(
      `SELECT status, full_name AS fullName, email
         FROM certificate_requests
        WHERE user_id = :uid AND request_year = :year
        LIMIT 1`,
      { uid, year }
    );
    const alreadyRequested = reqRows.length > 0;
    const requestStatus    = alreadyRequested ? reqRows[0].status : null;
    const fullName         = alreadyRequested ? reqRows[0].fullName : null;
    const email            = alreadyRequested ? reqRows[0].email : null;

    return res.json({
      ok: true,
      eligible,
      approved,
      required: LIM,
      missingIds,
      alreadyRequested,
      requestStatus,
      fullName,
      email
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok:false, error:'Error verificando elegibilidad' });
  }
});


// Registrar solicitud de certificado (valida del lado servidor)
app.post('/api/certificate-request', auth, async (req, res) => {
  try {
    const uid  = req.user.uid;
    const year = new Date().getFullYear();
    const { fullName, email } = req.body || {};

    // Validaciones simples
    if (!fullName || fullName.trim().length < 3) {
      return res.status(400).json({ ok:false, error:'Ingresá tu nombre completo.' });
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRe.test(String(email))) {
      return res.status(400).json({ ok:false, error:'Correo inválido.' });
    }

    // ¿Ya hay solicitud este año?
    const [exists] = await pool.execute(
      `SELECT id, status FROM certificate_requests
        WHERE user_id = :uid AND request_year = :year
        LIMIT 1`,
      { uid, year }
    );
    if (exists.length) {
      return res.status(409).json({
        ok:false,
        error:`Ya existe una solicitud este año (estado: ${exists[0].status}).`
      });
    }

    // Recontar aprobados (seguridad)
    const LIM = Number.isInteger(REQUIRED_MODULES) ? REQUIRED_MODULES : 6;
    const [rows] = await pool.execute(
      `SELECT COALESCE(SUM(s.last_passed = 1),0) AS approved
         FROM modules m
    LEFT JOIN user_module_status s
           ON s.module_id = m.id AND s.user_id = :uid
        WHERE m.id <= ${LIM}`,
      { uid }
    );
    if (Number(rows[0]?.approved || 0) < LIM) {
      return res.status(400).json({ ok:false, error:'Aún no cumplís los requisitos.' });
    }

    // Insertar solicitud (pendiente)
    await pool.execute(
      `INSERT INTO certificate_requests (user_id, request_year, status, full_name, email)
       VALUES (:uid, :year, 'pending', :fn, :em)`,
      { uid, year, fn: String(fullName).trim(), em: String(email).trim().toLowerCase() }
    );

    return res.json({ ok:true, message:'Solicitud registrada. Recibirás novedades por correo institucional.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok:false, error:'Error registrando solicitud' });
  }
});



// --- Ver historial de un módulo ---
app.get('/api/my-results/:moduleId', auth, async (req, res) => {
  try {
    const uid = req.user.uid;
    const mid = Number(req.params.moduleId);
    const [rows] = await pool.execute(
      `SELECT id, score, total, passed, passed_pct, question_ids, created_at
         FROM module_results
        WHERE user_id = :uid AND module_id = :mid
     ORDER BY created_at DESC`,
      { uid, mid }
    );
    res.json({ ok:true, results: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, error:'Error consultando historial' });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor http://localhost:${PORT}`);
});


// ADMIN 

async function isUserAdmin(userId) {
  const [rows] = await pool.execute(
    'SELECT is_admin FROM users WHERE id = :id LIMIT 1',
    { id: userId }
  );
  return rows.length && rows[0].is_admin === 1;
}

async function adminOnly(req, res, next) {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ ok:false, error:'No autenticado' });
    const ok = await isUserAdmin(uid);
    if (!ok) return res.status(403).json({ ok:false, error:'Solo administradores' });
    next();
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error:'Error verificando rol' });
  }
}

// GET /api/admin/cert-requests?status=pending|approved|rejected (opcional)
app.get('/api/admin/cert-requests', auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    const allowed = ['pending','approved','rejected'];
    let where = '';
    let params = {};
    if (status && allowed.includes(status)) {
      where = 'WHERE cr.status = :st';
      params.st = status;
    }
    const [rows] = await pool.execute(
      `SELECT
          cr.id, cr.user_id AS userId, u.username, cr.request_year AS year,
          cr.status, cr.full_name AS fullName, cr.email,
          cr.created_at AS createdAt, cr.reviewed_by AS reviewedBy,
          cr.reviewed_at AS reviewedAt, cr.note,
          ru.username AS reviewedByUsername
        FROM certificate_requests cr
        JOIN users u ON u.id = cr.user_id
   LEFT JOIN users ru ON ru.id = cr.reviewed_by
        ${where}
    ORDER BY cr.created_at DESC`,
      params
    );
    res.json({ ok:true, requests: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, error:'Error listando solicitudes' });
  }
});

// POST /api/admin/cert-requests/:id/status  body: { status: 'approved'|'rejected', note?: string }
app.post('/api/admin/cert-requests/:id/status', auth, adminOnly, async (req, res) => {
  try {
    const adminId = req.user.uid;
    const id = Number(req.params.id);
    const { status, note } = req.body || {};
    const allowed = ['approved','rejected'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ ok:false, error:'Estado inválido' });
    }

    // verificar existe solicitud
    const [cur] = await pool.execute(
      `SELECT id, status FROM certificate_requests WHERE id = :id LIMIT 1`,
      { id }
    );
    if (!cur.length) return res.status(404).json({ ok:false, error:'Solicitud no encontrada' });

    await pool.execute(
      `UPDATE certificate_requests
          SET status = :st,
              reviewed_by = :rb,
              reviewed_at = NOW(),
              note = :nt
        WHERE id = :id`,
      {
        st: status,
        rb: adminId,
        nt: note ? String(note).slice(0,500) : null,
        id
      }
    );

    res.json({ ok:true, message:`Solicitud #${id} marcada como ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, error:'Error actualizando estado' });
  }
});

app.get('/admin-certificados.html', needsAuthRedirect, async (req, res, next) => {
  try {
    const uid = req.user?.uid;
    const ok = await isUserAdmin(uid);
    if (!ok) return res.status(403).send('Solo administradores');
    next(); // lo sirve express.static
  } catch {
    return res.status(500).send('Error verificando rol');
  }
});
