const MODULOS = [
// --- Datos de los 9 módulos (podés reemplazar las URLs cuando suban los materiales al servidor institucional) ---
{
id:1,
titulo:"La información. El activo imprescindible de tu institución",
},
{
id:2,
titulo:"El correo electrónico. Principales fraudes y riesgos",
},
{
id:3,
titulo:"Contraseñas. Y medidas complementarias",
},
{
id:4,
titulo:"El puesto de trabajo. Medidas de protección",
},
{
id:5,
titulo:"Dispositivos móviles. Riesgos y protección (BYOD)",
},
{
id:6,
titulo:"Redes sociales. Seguridad para perfiles institucionales y personales",
},
{
id:7,
titulo:"La Inteligencia Artificial. El impacto laboral"
}
];

window.MODULOS = MODULOS;

// --- Plan de liberación (1 módulo por mes) ---
// CONFIGURACIÓN: cambiá la fecha BASE al 1º del mes desde el que querés arrancar.
// Ejemplo: 2025-09-01 habilita el módulo 2 en septiembre, el 3 en octubre, etc.
(function () {
  const BASE = new Date(2025, 10, 9); // 1/2/2025  (enero=0, febrero=1)


  const releases = {};
  // Módulo 1 siempre habilitado
  releases[1] = new Date(0);

  // Del 2 en adelante: uno por mes desde BASE
  MODULOS.forEach(m => {
    if (m.id <= 1) return;
    const d = new Date(BASE);
    d.setMonth(BASE.getMonth() + (m.id - 2)); // 2=>0, 3=>+1, etc.
    releases[m.id] = d;
  });

  // Exponer las fechas para el gateo del test de práctica
  window.MODULE_OPEN_DATES = releases;

  // Función que el test de práctica consulta para saber si YA están todos abiertos
  window.areAllModulesOpen = function (now = new Date()) {
    return MODULOS.every(m => window.isModuleUnlocked(m.id, now));
  };


  function monthLabel(date) {
    return date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
  }

  // Helpers globales para usarlos también en modulo.html
  window.isModuleUnlocked = function (id, now = new Date()) {
    const d = releases[id];
    return !!d && now >= d;
  };
  window.getModuleReleaseLabel = function (id) {
    const d = releases[id];
    return d ? monthLabel(d) : '';
  };
})();


// --- Render de cards (con guard para páginas sin grid)
function render(mods){
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


// --- Normalizador (quita acentos y baja a minúsculas)
function normalize(s){
  return (s || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

// --- Bindea buscador SOLO si existe (home)
(function bindSearch(){
  // acepta #q o [data-search] o el input dentro de .search
  const input = document.getElementById('q') || document.querySelector('[data-search], .search input');
  const btn   = document.getElementById('btnBuscar');
  if (!input) return;                      // <- en modulo.html no hay buscador

  function matches(mod, tokens){
    const haystack = normalize(
      `${mod.titulo} ${mod.desc || ''} ${Array.isArray(mod.tags) ? mod.tags.join(' ') : ''}`
    );
    return tokens.every(t => haystack.includes(t));
  }

  function doSearch(){
    const q = normalize(input.value.trim());
    if (!q){ render(MODULOS); return; }
    const tokens = q.split(/\s+/).filter(Boolean);
    const res = MODULOS.filter(m => matches(m, tokens));
    render(res);
  }

  input.addEventListener('input', doSearch);                 // búsqueda en vivo
  input.addEventListener('keydown', e => { if (e.key==='Enter') doSearch(); });
  if (btn) btn.addEventListener('click', doSearch);          // si tenés botón

  // pinta una vez (por si hay valor prellenado)
  doSearch();
})();

// --- Render inicial solo en la home
if (document.getElementById('grid')) {
  render(MODULOS);
}


// --- % en la tarjeta del hero (resultado final > progreso)
(function showTestPercent(){
  const node = document.querySelector('.test-card svg #testPct');
  if (!node) return;

  const rawRes = localStorage.getItem('alerta_test_result');
  if (rawRes){
    try {
      const { score, total } = JSON.parse(rawRes);
      const pct = Math.round((score/total)*100);
      node.textContent = pct + '%';
      node.setAttribute('fill', score >= 7 ? 'var(--ok)' : 'var(--warn)');
      node.style.display = 'block';
      return;
    } catch {}
  }

  // si no hay resultado final, mostrar progreso
  const rawProg = localStorage.getItem('alerta_test_progress');
  if (rawProg){
    try {
      const { answers = {}, total = 15 } = JSON.parse(rawProg);
      const answered = Object.keys(answers).length;
      const pct = Math.round((answered/total)*100);
      node.textContent = pct + '%';
      node.setAttribute('fill', 'var(--brand)');
      node.style.display = 'block';
    } catch {}
  }
})();

(async function() {
  const btn   = document.getElementById('btnCert');
  const info  = document.getElementById('certInfo');
  const desc  = document.getElementById('certDesc');

  async function checkEligibility() {
    try {
      const r = await fetch('/api/certificate-eligibility');
      if (!r.ok) throw new Error('No autenticado');
      const data = await r.json();

      if (data.ok && data.eligible) {
        btn.disabled = false;
        btn.textContent = 'Solicitar certificado';
        info.textContent = `Requisitos cumplidos (${data.approved}/${data.required}).`;
      } else {
        btn.disabled = true;
        btn.textContent = 'Requisitos pendientes';
        const missing = (data.missingIds || []).join(', ');
        info.textContent = `Aprobados: ${data.approved || 0}/${data.required}. Te faltan: ${missing || '—'}.`;
      }
    } catch (_) {
      btn.disabled = true;
      btn.textContent = 'Iniciá sesión';
      info.textContent = 'No se pudo verificar requisitos.';
    }
  }

  btn?.addEventListener('click', async () => {
    btn.disabled = true;
    const prev = btn.textContent;
    btn.textContent = 'Enviando solicitud…';
    try {
      const r = await fetch('/api/certificate-request', { method: 'POST' });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.ok) {
        btn.disabled = false;
        btn.textContent = prev;
        alert(data.error || 'No se pudo registrar la solicitud.');
        return;
      }
      btn.textContent = 'Solicitud enviada ✔️';
      info.textContent = 'Tu solicitud quedó registrada. Recibirás novedades por correo institucional.';
    } catch {
      btn.disabled = false;
      btn.textContent = prev;
      alert('Error de red.');
    }
  });

  await checkEligibility();
})();



(async function() {
  const btn   = document.getElementById('btnCert');
  const info  = document.getElementById('certInfo');
  const wrap  = document.getElementById('certFormWrap');
  const full  = document.getElementById('cfFullName');
  const mail  = document.getElementById('cfEmail');

  function setBtn(text, disabled=true) {
    btn.textContent = text;
    btn.disabled = !!disabled;
  }

  async function loadEligibility() {
    try {
      const r = await fetch('/api/certificate-eligibility');
      if (!r.ok) throw new Error('No autenticado');
      const data = await r.json();

      if (!data.ok) throw new Error('Error');

      // Si ya solicitó, mostrar estado y bloquear
      if (data.alreadyRequested) {
        setBtn('Solicitud ya enviada', true);
        info.textContent = `Estado: ${data.requestStatus}.`;
        wrap.style.display = 'none';
        return;
      }

      // Si no solicitó aún:
      if (data.eligible) {
        setBtn('Solicitar certificado', false);
        info.textContent = `Requisitos cumplidos (${data.approved}/${data.required}).`;
        wrap.style.display = 'block';

        // Si el backend ya tiene nombre/correo de una solicitud previa (otro año), se puede prellenar
        if (data.fullName) full.value = data.fullName;
        if (data.email)    mail.value = data.email;
      } else {
        setBtn('Requisitos pendientes', true);
        const missing = (data.missingIds || []).join(', ');
        info.textContent = `Aprobados: ${data.approved || 0}/${data.required}. Te faltan: ${missing || '—'}.`;
        wrap.style.display = 'none';
      }
    } catch {
      setBtn('Iniciá sesión', true);
      info.textContent = 'No se pudo verificar requisitos.';
      wrap.style.display = 'none';
    }
  }

  btn?.addEventListener('click', async () => {
    const fullName = (full.value || '').trim();
    const email    = (mail.value || '').trim();

    if (!fullName || fullName.length < 3) {
      alert('Ingresá tu nombre completo.');
      return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      alert('Ingresá un correo válido.');
      return;
    }

    setBtn('Enviando solicitud…', true);
    try {
      const r = await fetch('/api/certificate-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email })
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.ok) {
        setBtn('Solicitar certificado', false);
        alert(data.error || 'No se pudo registrar la solicitud.');
        return;
        }
      setBtn('Solicitud enviada ✔️', true);
      info.textContent = 'Tu solicitud quedó registrada. Recibirás novedades por correo institucional.';
      wrap.style.display = 'none';
    } catch {
      setBtn('Solicitar certificado', false);
      alert('Error de red.');
    }
  });

  await loadEligibility();
})();


