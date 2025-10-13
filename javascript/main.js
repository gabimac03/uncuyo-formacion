const MODULOS = [
  { id: 1, titulo: "La información. El activo imprescindible de tu institución" },
  { id: 2, titulo: "El correo electrónico. Principales fraudes y riesgos" },
  { id: 3, titulo: "Contraseñas. Y medidas complementarias" },
  { id: 4, titulo: "El puesto de trabajo. Medidas de protección" },
  { id: 5, titulo: "Dispositivos móviles. Riesgos y protección (BYOD)" },
  { id: 6, titulo: "Redes sociales. Seguridad para perfiles institucionales y personales" },
  { id: 7, titulo: "La Inteligencia Artificial. El impacto laboral" }
];

window.MODULOS = MODULOS;

// --- Plan de liberación (1 módulo por mes) ---
(function () {
  const BASE = new Date(2025, 10, 14);
  const releases = {};
  releases[1] = new Date(0);
  MODULOS.forEach(m => {
    if (m.id <= 1) return;
    const d = new Date(BASE);
    d.setMonth(BASE.getMonth() + (m.id - 2));
    releases[m.id] = d;
  });
  window.MODULE_OPEN_DATES = releases;

  window.isModuleUnlocked = function (id, now = new Date()) {
    const d = releases[id];
    return !!d && now >= d;
  };
  window.getModuleReleaseLabel = function (id) {
    const d = releases[id];
    return d ? d.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }) : '';
  };
  window.areAllModulesOpen = function (now = new Date()) {
    return MODULOS.every(m => window.isModuleUnlocked(m.id, now));
  };
})();

// --- Render de cards ---
function render(mods) {
  const grid = document.getElementById('grid');
  if (!grid) return;
  grid.innerHTML = '';
  mods.forEach(m => {
    const unlocked = window.isModuleUnlocked ? window.isModuleUnlocked(m.id) : (m.id === 1);
    const el = document.createElement('article');
    el.className = 'module' + (unlocked ? '' : ' is-locked');
    el.innerHTML = `
      <h3>${m.id}. ${m.titulo}</h3>
      ${unlocked ? '' : `<div class="module__lock">🔒 Disponible en ${window.getModuleReleaseLabel(m.id)}</div>`}
    `;
    el.style.cursor = unlocked ? 'pointer' : 'not-allowed';
    el.addEventListener('click', () => {
      if (!unlocked) {
        alert('Este módulo se habilitará en ' + window.getModuleReleaseLabel(m.id));
        return;
      }
      window.location.href = `modulo.html?id=${m.id}`;
    });
    grid.appendChild(el);
  });
}

// --- Normalizador ---
function normalize(s) {
  return (s || '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// --- Bindea buscador ---
(function bindSearch() {
  const input = document.getElementById('q') || document.querySelector('[data-search], .search input');
  const btn = document.getElementById('btnBuscar');
  if (!input) return;
  function matches(mod, tokens) {
    const haystack = normalize(`${mod.titulo} ${mod.desc || ''} ${Array.isArray(mod.tags) ? mod.tags.join(' ') : ''}`);
    return tokens.every(t => haystack.includes(t));
  }
  function doSearch() {
    const q = normalize(input.value.trim());
    if (!q) { render(MODULOS); return; }
    const tokens = q.split(/\s+/).filter(Boolean);
    const res = MODULOS.filter(m => matches(m, tokens));
    render(res);
  }
  input.addEventListener('input', doSearch);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
  if (btn) btn.addEventListener('click', doSearch);
  doSearch();
})();

// --- Render inicial solo en home ---
if (document.getElementById('grid')) {
  render(MODULOS);
}

// --- % en la tarjeta del hero ---
(function showTestPercent() {
  const node = document.querySelector('.test-card svg #testPct');
  if (!node) return;
  try {
    const rawRes = localStorage.getItem('alerta_test_result');
    if (rawRes) {
      const { score, total } = JSON.parse(rawRes);
      const pct = Math.round((score/total)*100);
      node.textContent = pct + '%';
      node.setAttribute('fill', score >= 7 ? 'var(--ok)' : 'var(--warn)');
      node.style.display = 'block';
      return;
    }
    const rawProg = localStorage.getItem('alerta_test_progress');
    if (rawProg) {
      const { answers = {}, total = 15 } = JSON.parse(rawProg);
      const answered = Object.keys(answers).length;
      const pct = Math.round((answered/total)*100);
      node.textContent = pct + '%';
      node.setAttribute('fill', 'var(--brand)');
      node.style.display = 'block';
    }
  } catch {}
})();

// --- Certificado: solo se activa si se completaron todos los módulos ---
(async function() {
  const btn  = document.getElementById('btnCert');
  const info = document.getElementById('certInfo');
  if (!btn || !info) return;

  function setBtn(text, disabled = true) {
    btn.textContent = text;
    btn.disabled = !!disabled;
  }

  async function loadEligibility() {
    try {
      // 1) NO usar más "areAllModulesOpen" para decidir elegibilidad.
      //    Eso sólo indica que los módulos ya están publicados, no que el usuario los aprobó.
      const r = await fetch('/api/certificate-eligibility', { credentials: 'include' });
      if (!r.ok) throw new Error('No autenticado');
      const data = await r.json();

      const { eligible, approved, required, missingIds = [], alreadyRequested, requestStatus } = data;

      if (alreadyRequested) {
        setBtn('Solicitud ya enviada', true);
        info.textContent = `Estado: ${requestStatus || 'pendiente'}.`;
        return;
      }

      if (!eligible) {
        const faltan = Math.max(0, (required || 0) - (approved || 0));
        setBtn(`Te faltan ${faltan} módulo(s)`, true);
        info.textContent = missingIds.length
          ? `Completá y aprobá los módulos: ${missingIds.join(', ')}.`
          : `Debes aprobar ${required} módulo(s).`;
        return;
      }

      // Puede solicitar (acá sí)
      setBtn('Solicitar certificado', false);
      info.textContent = `Aprobaste ${approved}/${required}. Podés solicitar tu certificado.`;
    } catch (e) {
      setBtn('Iniciá sesión', true);
      info.textContent = 'No se pudo verificar requisitos.';
    }
  }

  btn.addEventListener('click', async () => {
    // SUGERENCIA: recolectá nombre y email de un form o modal
    const fullName = (document.getElementById('fullName')?.value || '').trim();
    const email    = (document.getElementById('email')?.value || '').trim();

    if (!fullName || !email) {
      alert('Completá nombre y correo institucional.');
      return;
    }

    setBtn('Enviando solicitud…', true);
    try {
      const r = await fetch('/api/certificate-request', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        credentials: 'include',
        body: JSON.stringify({ fullName, email })
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.ok) {
        setBtn('Solicitar certificado', false);
        alert(data.error || 'No se pudo registrar la solicitud.');
        return;
      }
      setBtn('Solicitud enviada ✔️', true);
      const infoNode = document.getElementById('certInfo');
      if (infoNode) infoNode.textContent = 'Tu solicitud quedó registrada. Recibirás novedades por correo institucional.';
    } catch {
      setBtn('Solicitar certificado', false);
      alert('Error de red.');
    }
  });

  await loadEligibility();
})();



// --- Certificado: elegibilidad + modal de "Nombre completo" (flujo único) ---
// --- Certificado: elegibilidad + modal de "Nombre completo" ---
(() => {
  const btn  = document.getElementById('btnCert');
  const info = document.getElementById('certInfo');
  if (!btn || !info) return;

  if (btn.dataset.certBound === '1') return;
  btn.dataset.certBound = '1';

  function setBtn(text, disabled = true) {
    btn.textContent = text;
    btn.disabled = !!disabled;
  }

  async function loadEligibility() {
    try {
      const r = await fetch('/api/certificate-eligibility', { credentials: 'include' });
      if (!r.ok) throw new Error('No autenticado');
      const data = await r.json();

      const { eligible, approved, required, missingIds = [], alreadyRequested, requestStatus } = data;

      if (alreadyRequested) {
        setBtn('Solicitud ya enviada', true);
        info.textContent = `Estado: ${requestStatus || 'pendiente'}.`;
        return;
      }

      if (!eligible) {
        const faltan = Math.max(0, (required || 0) - (approved || 0));
        setBtn(`Te faltan ${faltan} módulo(s)`, true);
        info.textContent = missingIds.length
          ? `Completá y aprobá los módulos: ${missingIds.join(', ')}.`
          : `Debes aprobar ${required} módulo(s).`;
        return;
      }

      setBtn('Solicitar certificado', false);
      info.textContent = `Aprobaste ${approved}/${required}. Podés solicitar tu certificado.`;
    } catch {
      setBtn('Iniciá sesión', true);
      info.textContent = 'No se pudo verificar requisitos.';
    }
  }

  function openCertModal() {
    const wrap = document.createElement('div');
    wrap.id = 'certModal';
    wrap.innerHTML = `
      <div style="position:fixed; inset:0; background:rgba(0,0,0,.5);
                  display:flex; align-items:center; justify-content:center; z-index:9999;">
        <div style="width:min(480px,92vw); background:#fff; color:#111;
                    border-radius:12px; box-shadow:0 20px 60px rgba(0,0,0,.25);
                    padding:20px;">
          <h3>Solicitar certificado</h3>
          <p>Ingresá tu <strong>Nombre completo</strong> tal como querés que figure.</p>
          <label>Nombre completo
            <input id="fullNameInput" type="text" required minlength="3" autocomplete="name"
                   style="width:100%; padding:10px; border:1px solid #ddd; border-radius:8px;"/>
          </label>
          <div id="certErr" style="display:none; color:#b00020; margin-top:8px;"></div>
          <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:16px;">
            <button id="cancelCertBtn">Cancelar</button>
            <button id="sendCertBtn">Enviar solicitud</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(wrap);

    const input   = wrap.querySelector('#fullNameInput');
    const error   = wrap.querySelector('#certErr');
    const btnSend = wrap.querySelector('#sendCertBtn');
    const btnCancel = wrap.querySelector('#cancelCertBtn');

    const close = () => wrap.remove();
    btnCancel.addEventListener('click', close);

    btnSend.addEventListener('click', async () => {
      const fullName = (input.value || '').trim();
      if (fullName.length < 3) {
        error.textContent = 'Ingresá un nombre válido (mínimo 3 caracteres).';
        error.style.display = 'block';
        input.focus();
        return;
      }

      btnSend.disabled = true;
      btnSend.textContent = 'Enviando…';

      try {
        const r = await fetch('/api/certificate-request', {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          credentials: 'include',
          body: JSON.stringify({ fullName })
        });
        const data = await r.json().catch(() => ({}));

        if (!r.ok || !data.ok) {
          error.textContent = data.error || 'No se pudo registrar la solicitud.';
          error.style.display = 'block';
          btnSend.disabled = false;
          btnSend.textContent = 'Enviar solicitud';
          return;
        }

        setBtn('Solicitud enviada ✔️', true);
        if (info) info.textContent = 'Tu solicitud quedó registrada.';
        setTimeout(close, 300);
      } catch {
        error.textContent = 'Error de red.';
        error.style.display = 'block';
        btnSend.disabled = false;
        btnSend.textContent = 'Enviar solicitud';
      }
    });

    setTimeout(() => input.focus(), 50);
  }

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (btn.disabled) return;
    openCertModal();
  });

  loadEligibility();
})();

// HAMBURGUESA
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('active');
});


// DESCARGAR PDF

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn-pdf");

  if (!btn) return;

  btn.addEventListener("click", () => {
    // Ruta al PDF existente
    const pdfPath = "./recursos/modulos/Modulo 1 - Ciberseguridad - TxD.pdf";

    // Crear un enlace invisible para descargarlo
    const link = document.createElement("a");
    link.href = pdfPath;
    link.download = "Modulo 1 - Ciberseguridad - TxD.pdf"; // 🔹 nombre de descarga
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});




// Boton volver

  document.getElementById("btn-volver").addEventListener("click", () => {
    window.location.href = "index.html"; // 🔹 Cambia la ruta si tu index está en otro lugar
  });