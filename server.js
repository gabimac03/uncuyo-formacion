// server.js — versión integrada con reset por Email (Resend)
// ESM

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
import { Resend } from 'resend';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);


// ------------ ENV ------------
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'portal_alerta';

const APP_URL      = process.env.APP_URL      || 'http://localhost:3000';
const RESET_FROM   = process.env.RESET_FROM   || 'ALERTA <macocco.gabriel@uncuyo.edu.ar>';
const BCRYPT_ROUNDS= Number(process.env.BCRYPT_ROUNDS || 12);


// Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// ------------ DB POOL ------------
const pool = await mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portal_alerta',
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
});

// ------------ Middlewares base ------------
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(cookieParser());

// ------------ Helpers ------------
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

// Auth cookie → /login.html si no hay sesión
function needsAuthRedirect(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) return res.redirect('/login.html');
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch {
    return res.redirect('/login.html');
  }
}


// RESEND EMAIL

// Reemplazar sendResetEmail actual por esta (temporal para debugging)
async function sendResetEmail({ to, link }) {
  console.log('[sendResetEmail] START', { to, link, RESET_FROM: String(RESET_FROM).slice(0,60) });
  try {
    const payload = {
      from: RESET_FROM,
      to,
      subject: 'Restablecer contraseña',
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5">
          <h2>Restablecer contraseña</h2>
          <p>Recibimos tu solicitud de restablecimiento.</p>
          <p><a href="${link}" target="_blank">Hacé clic aquí para crear una nueva contraseña</a></p>
          <p style="color:#6b7280;font-size:12px">El enlace vence en 30 minutos. Si no pediste el cambio, ignorá este mensaje.</p>
        </div>
      `,
    };

    console.log('[sendResetEmail] payload', { from: payload.from, to: payload.to, subject: payload.subject });

    const resp = await resend.emails.send(payload);

    // Resend devuelve objeto con id, status u otros datos: loguealo completo
    console.log('[sendResetEmail] Resend response:', JSON.stringify(resp, null, 2));
    return resp;
  } catch (err) {
    // intentá extraer info útil de err (axios-like)
    console.error('[sendResetEmail] Error: message=', err?.message);
    if (err?.response) {
      try {
        console.error('[sendResetEmail] Error response status:', err.response.status);
        console.error('[sendResetEmail] Error response body:', JSON.stringify(err.response.data || err.response.body || err.response, null, 2));
      } catch (e) {
        console.error('[sendResetEmail] Error parsing err.response', e);
      }
    } else {
      console.error('[sendResetEmail] err object:', err);
    }
    throw err;
  }
}
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

// ------------ Rutas HTML protegidas ------------
app.get('/', needsAuthRedirect, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
const protectedHtml = ['/index.html', '/modulo.html', '/test.html', '/test-modulo.html'];
app.get(protectedHtml, needsAuthRedirect, (req, res, next) => next());

// Redirecciones si ya está logueado
app.get('/login.html', (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return next();
  try { jwt.verify(token, JWT_SECRET); return res.redirect('/'); } catch { return next(); }
});
app.get('/register.html', (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return next();
  try { jwt.verify(token, JWT_SECRET); return res.redirect('/'); } catch { return next(); }
});

// ------------ Rate Limits ------------
app.use('/api/login', rateLimit({ windowMs: 10*60*1000, max: 20, standardHeaders: true, legacyHeaders: false }));
app.use('/api/register', rateLimit({ windowMs: 60*60*1000, max: 30, standardHeaders: true, legacyHeaders: false }));
app.use('/api/password/forgot', rateLimit({ windowMs: 15*60*1000, max: 10, standardHeaders: true, legacyHeaders: false }));
app.use('/api/password/reset',  rateLimit({ windowMs: 15*60*1000, max: 30, standardHeaders: true, legacyHeaders: false }));

// ------------ CAPTCHA simple ------------
const CAPTCHAS = new Map();
const CAPTCHA_TTL_MS = 5 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of CAPTCHAS.entries()) if (v.expires < now) CAPTCHAS.delete(k);
}, 60 * 1000);

app.get('/api/captcha', (req, res) => {
  const a = Math.floor(Math.random() * 40) + 10;
  const b = Math.floor(Math.random() * 40) + 10;
  const answer = String(a + b);
  const id = uuidv4();
  CAPTCHAS.set(id, { answer, expires: Date.now() + CAPTCHA_TTL_MS });
  res.json({ captchaId: id, question: `¿Cuánto es ${a} + ${b}?` });
});

// ------------ LOGIN ------------
app.post('/api/login', async (req, res) => {
  try {
    const { username, password, captchaId, captchaAnswer } = req.body || {};
    const ip  = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.socket.remoteAddress;
    const ua  = req.headers['user-agent'] || '';

    if (!username || !password) {
      return res.status(400).json({ ok:false, error:'Faltan credenciales.' });
    }

    const cap = CAPTCHAS.get(captchaId);
    CAPTCHAS.delete(captchaId);
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
    res.cookie('token', token, { httpOnly: true, sameSite: 'strict', secure: false, maxAge: 2*60*60*1000 });
    await insertAudit({ username: user.username, success: true, ip, userAgent: ua });
    res.json({ ok:true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, error:'Error interno' });
  }
});

// ------------ REGISTER ------------
app.post('/api/register', async (req, res) => {
  try {
    const { dni, password, email, captchaId, captchaAnswer } = req.body || {};
    const ip  = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.socket.remoteAddress;
    const ua  = req.headers['user-agent'] || '';

    if (!dni || !password || !email) {
      return res.status(400).json({ ok:false, error:'Faltan DNI, contraseña o correo.' });
    }
    if (!/^\d{7,9}$/.test(String(dni))) {
      return res.status(400).json({ ok:false, error:'DNI inválido (7 a 9 dígitos).' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ ok:false, error:'La contraseña debe tener al menos 6 caracteres.' });
    }
    const emailNorm = String(email).trim().toLowerCase();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(emailNorm)) {
      return res.status(400).json({ ok:false, error:'Correo inválido.' });
    }

    const cap = CAPTCHAS.get(captchaId);
    CAPTCHAS.delete(captchaId);
    if (!cap || cap.expires < Date.now() || String(captchaAnswer).trim() !== cap.answer) {
      return res.status(400).json({ ok:false, error:'CAPTCHA inválido o vencido.' });
    }

    const [existsUser] = await pool.execute('SELECT id FROM users WHERE username = :u LIMIT 1', { u: String(dni) });
    if (existsUser.length) return res.status(409).json({ ok:false, error:'Ese DNI ya está registrado.' });

    const [existsEmail] = await pool.execute('SELECT id FROM users WHERE email = :e LIMIT 1', { e: emailNorm });
    if (existsEmail.length) return res.status(409).json({ ok:false, error:'Ese correo ya está registrado.' });

    const hash = bcrypt.hashSync(String(password), 12);
    await pool.execute('INSERT INTO users (username, email, password_hash) VALUES (:u, :e, :h)',
      { u: String(dni), e: emailNorm, h: hash });

    await insertAudit({ username: String(dni), success: true, ip, userAgent: ua });
    return res.json({ ok:true, message:'Registro creado. Iniciá sesión.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok:false, error:'Error registrando usuario' });
  }
});

// ------------ LOGOUT ------------
app.post('/api/logout', (req, res) => {
  res.clearCookie('token', { httpOnly:true, sameSite:'strict', secure:false });
  res.json({ ok:true });
});

// ------------ FORGOT PASSWORD ------

// Endpoint de "olvidé mi contraseña"
async function forgotPassword(req, res) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ ok: false, error: 'Email requerido' });

    const [rows] = await pool.execute('SELECT id FROM users WHERE email = :email', { email });
    if (!rows.length) return res.json({ ok: true, msg: 'Si existe una cuenta con ese correo, se enviaron instrucciones.' });

    const token = jwt.sign({ id: rows[0].id, email }, JWT_SECRET, { expiresIn: '30m' });
    const link = `${APP_URL}/password-reset.html?token=${token}`;

    await sendResetEmail({ to: email, link });

    res.json({ ok: true, msg: 'Si existe una cuenta con ese correo, se enviaron instrucciones.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'No se pudo enviar el email' });
  }
}


// ENDOPINT Reset Password

async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ ok: false, error: 'Token y contraseña requeridos' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);

    await pool.execute('UPDATE users SET password_hash = :h WHERE id = :id', {
      h: hashed,
      id: decoded.id,
    });

    res.json({ ok: true, message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ ok: false, error: 'Token inválido o vencido' });
  }
}

app.post('/api/password/forgot', forgotPassword);
app.post('/api/password/reset', resetPassword);
export { forgotPassword, resetPassword };

// ------------ Módulos / progreso / certificados (tu lógica existente) ------------
app.post('/api/results', auth, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { moduloId, puntaje, total, aprobado, puntaje_pct, ids } = req.body || {};
    if (!moduloId || total == null || puntaje == null || puntaje_pct == null) {
      return res.status(400).json({ ok:false, error:'Payload incompleto' });
    }
    const [modRows] = await pool.execute('SELECT id FROM modules WHERE id = :id LIMIT 1', { id: Number(moduloId) });
    if (!modRows.length) return res.status(400).json({ ok:false, error:'Módulo inexistente.' });

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
    console.error('POST /api/results error:', err);
    res.status(500).json({ ok:false, error: err?.sqlMessage || err?.message || 'Error guardando resultado' });
  }
});

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

// --- Certificados (igual que tu versión; abreviado por espacio) ---



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
    let { fullName, email } = req.body || {};

    // 1) Validación de nombre
    if (!fullName || fullName.trim().length < 3) {
      return res.status(400).json({ ok:false, error:'Ingresá tu nombre completo.' });
    }
    fullName = fullName.trim();

    // 2) Resolver email (si no vino en body, tomarlo de la cuenta)
    if (!email) {
      const [usrRows] = await pool.execute(
        'SELECT email FROM users WHERE id = :id LIMIT 1',
        { id: uid }
      );
      email = usrRows?.[0]?.email ?? '';
      console.log('[cert-request] from DB emailRaw =', usrRows?.[0]?.email);
    }
    email = String(email).trim().toLowerCase();

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRe.test(email)) {
      return res.status(400).json({ ok:false, error:'Correo inválido o no disponible en la cuenta.' });
    }

    // 3) Evitar duplicados por año
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

    // 4) Verificar elegibilidad real (seguridad)
    const LIM = Number.isInteger(REQUIRED_MODULES) ? REQUIRED_MODULES : 7;
    const [rows] = await pool.execute(
      `SELECT COALESCE(SUM(s.last_passed = 1),0) AS approved
         FROM modules m
    LEFT JOIN user_module_status s
           ON s.module_id = m.id AND s.user_id = :uid
        WHERE m.id <= ${LIM}`,
      { uid }
    );
    const approved = Number(rows?.[0]?.approved || 0);
    if (approved < LIM) {
      return res.status(400).json({ ok:false, error:'Aún no cumplís los requisitos.' });
    }

    // 5) Insertar solicitud
    await pool.execute(
      `INSERT INTO certificate_requests (user_id, request_year, status, full_name, email)
       VALUES (:uid, :year, 'pending', :fn, :em)`,
      { uid, year, fn: fullName, em: email }
    );

    console.log('[cert-request] OK uid=', uid, 'fullName=', fullName, 'email=', email);
    return res.json({ ok:true, message:'Solicitud registrada. Será revisada por el equipo.' });
  } catch (err) {
    console.error('POST /api/certificate-request error:', err?.sqlMessage || err?.message || err);
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


// TOUR 

// Middleware de auth: req.user.id disponible (JWT o cookie de sesión)
// TOUR 
app.get('/api/tour', auth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT tour_visto FROM users WHERE id = :id LIMIT 1',
      { id: req.user.uid }
    );
    return res.json({ seen: !!rows[0]?.tour_visto });
  } catch (e) {
    console.error('GET /api/tour error:', e);
    return res.status(500).json({ seen: true });
  }
});

app.post('/api/tour/done', auth, async (req, res) => {
  try {
    await pool.execute(
      'UPDATE users SET tour_visto = 1 WHERE id = :id',
      { id: req.user.uid }
    );
    return res.json({ ok: true });
  } catch (e) {
    console.error('POST /api/tour/done error:', e);
    return res.status(500).json({ ok: false });
  }
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

// Static
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/javascript', express.static(path.join(__dirname, 'javascript')));
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));




