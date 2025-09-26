const $ = s => document.querySelector(s);

async function cargarCaptcha() {
  $('#msg').textContent = '';
  try {
    const r = await fetch('/api/captcha');
    const data = await r.json();
    $('#captchaQuestion').textContent = data.question;
    $('#captchaId').value = data.captchaId;
  } catch {
    $('#captchaQuestion').textContent = 'No se pudo cargar el CAPTCHA';
  }
}

$('#refreshCaptcha')?.addEventListener('click', cargarCaptcha);

$('#loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  $('#msg').textContent = 'Verificando...';

  const payload = {
    username: $('#username').value.trim(),
    password: $('#password').value,
    captchaId: $('#captchaId').value,
    captchaAnswer: $('#captchaAnswer').value.trim()
  };

  try {
    const r = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok || !data.ok) {
      $('#msg').textContent = data.error || 'Error de autenticación';
      await cargarCaptcha();            // nuevo captcha al fallar
      $('#captchaAnswer').value = '';
      return;
    }
    // OK → ir al home (tu index.html protegido)
    location.href = '/';
  } catch {
    $('#msg').textContent = 'Error de red';
  }
});

window.addEventListener('DOMContentLoaded', cargarCaptcha);

// MODAL DE INAGURACIÓN 

// ===== Bloqueo por fecha de inauguración (sin modificar el HTML) =====
(function initGate() {
  // Configurá la fecha/hora de apertura (zona Mendoza UTC-03)
  const OPEN_AT_ISO = '2025-02-14T00:00:00'; // <-- CAMBIAR

  const openAt = new Date(OPEN_AT_ISO);
  if (isNaN(openAt.valueOf())) {
    console.error('Fecha de apertura inválida:', OPEN_AT_ISO);
    return; // Si está mal, no bloquear
  }

  // Crear modal dinámicamente (sin tocar el HTML original)
  const overlay = document.createElement('div');
  overlay.id = 'gate-overlay';
  overlay.className = 'gate--hidden';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.innerHTML = `
    <div id="gate-dialog">
      <h2 id="gate-title">Curso A.L.E.R.T.A UNCUYO — Próximamente</h2>
      <p id="gate-desc">
	Llegaste hasta aquí porque hiciste clic en un correo de simulación de ciberataque organizado por la Secretaría de Transformación Digital.
	No te preocupes: no se trató de un ataque real, sino de un ejercicio de concientización.
	Este ejercicio busca: <br> <br>
	<b> Mostrar cómo operan los correos maliciosos. <br>
	Generar conciencia sobre la importancia de estar atentos. <br>
	Invitarte a formarte en buenas prácticas de Ciberseguridad</b>. <br> <br>
	Muy pronto vas a poder acceder al <strong>Curso A.L.E.R.T.A UNCuyo</strong>, donde aprenderás conceptos básicos y podrás obtener un certificado que valide tus nuevos conocimientos.
	</p>
      <span class="gate-date" id="gate-when"></span>
      <div class="gate-countdown" id="gate-countdown">Cargando…</div>
      <p style="margin-top:10px; font-size: .9rem; color:#9ca3af">
        Si tenés dudas, contactate con ciberseguridad-txd@uncuyo.edu.ar.
      </p>
    </div>
  `;
  document.body.appendChild(overlay);

  const countdownEl = overlay.querySelector('#gate-countdown');
  const whenEl = overlay.querySelector('#gate-when');

  let locked = false;
  let blockers = [];
  let timer = null;

  function fmt2(n){ return String(n).padStart(2,'0'); }
  function renderCountdown() {
    const now = new Date();
    const diffMs = openAt - now;
    if (diffMs <= 0) {
      countdownEl.textContent = '¡Habilitado!';
      return false;
    }
    const s = Math.floor(diffMs/1000);
    const d = Math.floor(s/86400);
    const h = Math.floor((s%86400)/3600);
    const m = Math.floor((s%3600)/60);
    const ss= s%60;
    countdownEl.textContent = `${fmt2(d)}d ${fmt2(h)}h ${fmt2(m)}m ${fmt2(ss)}s`;
    return true;
  }

  function preventAll(e){
  if (!locked) return;

  const dialog = overlay.querySelector('#gate-dialog');

  // ✅ Permitir clics dentro del dialog principal
  if (dialog && dialog.contains(e.target)) return;

  // ✅ Permitir clics dentro de cualquier overlay marcado como permitido
  const allowed = e.target.closest('[data-gate-allow="true"]');
  if (allowed) return;

  e.stopPropagation();
  e.preventDefault();
}


  function disableFocusables() {
    const root = document.documentElement; // toda la página debajo
    const focusables = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
    focusables.forEach(el => {
      if (overlay.contains(el)) return; // no tocar elementos del modal
      const prev = {el, disabled: el.disabled ?? null, tabindex: el.getAttribute('tabindex')};
      blockers.push(prev);
      if ('disabled' in el) el.disabled = true;
      el.setAttribute('tabindex', '-1');
    });
  }

  function enableFocusables() {
    blockers.forEach(({el, disabled, tabindex}) => {
      if ('disabled' in el && disabled !== null) el.disabled = disabled;
      if (tabindex === null) el.removeAttribute('tabindex');
      else el.setAttribute('tabindex', tabindex);
    });
    blockers = [];
  }

  function lockPage() {
    locked = true;
    overlay.classList.remove('gate--hidden');
    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-scroll');

    document.addEventListener('click', preventAll, true);
    document.addEventListener('submit', preventAll, true);
    document.addEventListener('keydown', preventAll, true);

    disableFocusables();

    // Mostrar fecha legible
    try {
      const opts = { dateStyle:'full', timeStyle:'short' };
      whenEl.textContent = `Apertura: ${new Intl.DateTimeFormat('es-AR', opts).format(openAt)}`;
    } catch {
      whenEl.textContent = `Apertura: ${OPEN_AT_ISO}`;
    }

    const tick = () => {
      const keep = renderCountdown();
      if (!keep) unlockPage();
      else timer = setTimeout(tick, 1000);
    };
    timer = setTimeout(tick, 100);
  }

  function unlockPage() {
    locked = false;
    overlay.classList.add('gate--hidden');
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-scroll');

    document.removeEventListener('click', preventAll, true);
    document.removeEventListener('submit', preventAll, true);
    document.removeEventListener('keydown', preventAll, true);

    enableFocusables();
    if (timer) { clearTimeout(timer); timer = null; }
  }

  // Decidir bloquear o no al cargar
  function decide() {
    if (new Date() < openAt) lockPage();
    else unlockPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', decide);
  } else {
    decide();
  }
})();



// MODAL ¿CUAL FUE MI ERROR? - CON SOPORTE MOBILE COMO OVERLAY
// MODAL ¿CUAL FUE MI ERROR? - CON OVERLAY MOBILE + cierre por clic fuera
function initTips() {
  const overlay = document.querySelector('#gate-overlay');
  if (!overlay) return;
  const dialog = overlay.querySelector('#gate-dialog');
  if (!dialog) return;

  if (dialog.querySelector('.gate-btn-tips')) return;

  // Botón
  const btn = document.createElement('button');
  btn.textContent = "🎯 ¿Cuál fue mi error en esta simulación?";
  btn.className = "gate-btn-tips";
  dialog.appendChild(btn);

  const explicacionCompleta = `
    <h3 style="margin-top:0">📌 Explicación del ejercicio</h3>
    <p>
      🎭 Has participado en una simulación de ataque de phishing organizada por la Secretaría de Transformación Digital de la UNCUYO.<br><br>
      ⚠️ El correo y el formulario fueron creados con fines de capacitación. Al completar tus datos, recreaste lo que ocurriría en un ataque real.<br><br>
      👀 Abrir y leer el correo no representa un riesgo. El peligro aparece al hacer clic en enlaces, descargar adjuntos sospechosos o entregar datos personales.<br><br>
      🚩 Señales de alerta: remitente dudoso, urgencia, URL no oficial, solicitud de datos sensibles.<br><br>
      ✅ Actuá: no ingreses datos, verificá remitente/URL, reportá antes de interactuar.<br><br>
      🔒 Tu participación es confidencial. No es una sanción: es un ejercicio para aprender a reconocer ataques reales.
    </p>
  `;

  const isMobile = window.matchMedia("(max-width: 768px)").matches ||
                   /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // ======== MOBILE ========
  if (isMobile) {
    let visible = false;

    const mobileOverlay = document.createElement('div');
    mobileOverlay.id = "explicacion-overlay";
    mobileOverlay.setAttribute('data-gate-allow', 'true');
    Object.assign(mobileOverlay.style, {
      position: "fixed",
      inset: "0",
      background: "rgba(0,0,0,0.8)",
      display: "none",
      alignItems: "center",
      justifyContent: "center",
      zIndex: "10000"
    });

    const box = document.createElement('div');
    Object.assign(box.style, {
      background: "#0b1220",
      color: "#e5e7eb",
      borderRadius: "12px",
      padding: "20px",
      width: "min(560px, 92vw)",
      maxHeight: "80vh",
      overflowY: "auto",
      textAlign: "left",
      boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
    });
    box.innerHTML = explicacionCompleta;
    mobileOverlay.appendChild(box);
    document.body.appendChild(mobileOverlay);

    // Toggle visibilidad
    const toggleOverlay = (open) => {
      visible = open;
      mobileOverlay.style.display = open ? "flex" : "none";
      btn.textContent = open ? "⏹️ Cerrar explicación" : "🎯 ¿Cuál fue mi error en esta simulación?";
    };

    btn.addEventListener('click', () => toggleOverlay(!visible));

    // Cerrar por botón o clic en el fondo
    mobileOverlay.addEventListener('click', (e) => {
      if (e.target.id === "cerrar-explicacion" || e.target === mobileOverlay) {
        toggleOverlay(false);
      }
    });

    return; // no crear carteles en mobile
  }

  // ======== DESKTOP ========
  const mensajes = [
    "🎭 Has participado en una simulación de ataque de phishing organizada por la Secretaría de Transformación Digital de la UNCUYO.",
    "⚠️ En este caso, el correo y el formulario fueron creados con fines de capacitación. Al completar tus datos, recreaste lo que ocurriría en un ataque real.",
    "👀 Abrir y leer el correo no representa un riesgo. El peligro aparece al hacer clic en enlaces, descargar adjuntos sospechosos o entregar datos personales.",
    "🚩 Señales de alerta: remitente extraño, sensación de urgencia, enlace que no coincide con el portal oficial, formulario pidiendo datos sensibles.",
    "✅ Forma correcta de actuar: no ingresar datos, verificar remitente/dirección, reportar el mensaje antes de interactuar.",
    "🔒 Recordá: tu participación es confidencial. No es una sanción, es un ejercicio para aprender a reconocer ataques reales."
  ];

  const tipEls = mensajes.map((texto) => {
    const tip = document.createElement('div');
    tip.className = 'gate-tip gate-tip--hidden';
    tip.textContent = texto;
    dialog.appendChild(tip);
    return tip;
  });

  const posiciones = [
    { top: "30px", left: "40%" },
    { top: "300px", right: "200px" },
    { bottom: "30px", left: "40%" },
    { top: "35%", left: "200px" },
    { top: "50px", right: "70px", transform: "rotate(-2deg)" },
    { bottom: "90px", left: "30px", transform: "rotate(2deg)" }
  ];

  tipEls.forEach((tip, i) => Object.assign(tip.style, posiciones[i % posiciones.length]));

  let interval = null;
  let currentIndex = -1;
  let isActive = false;

  btn.addEventListener('click', () => {
    if (isActive) {
      clearInterval(interval);
      interval = null;
      currentIndex = -1;
      isActive = false;
      tipEls.forEach(t => t.classList.add('gate-tip--hidden'));
      btn.textContent = "🎯 ¿Cuál fue mi error en esta simulación?";
      return;
    }

    isActive = true;
    currentIndex = -1;
    btn.textContent = "⏹️ Detener explicación";

    const mostrarSiguiente = () => {
      currentIndex++;
      if (currentIndex >= tipEls.length) {
        clearInterval(interval);
        interval = null;
        isActive = false;
        btn.textContent = "🎯 ¿Cuál fue mi error en esta simulación?";
        return;
      }
      tipEls.forEach(t => t.classList.add('gate-tip--hidden'));
      tipEls[currentIndex].classList.remove('gate-tip--hidden');
    };

    mostrarSiguiente();
    interval = setInterval(mostrarSiguiente, 6000); // 👈 ahora sí 7 segundos
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initTips, 500);
});
