// Archivo: javascript/test-modulo.js
(function () {
  // --- Parámetros / datos del módulo ---
  const params = new URLSearchParams(location.search);
  const moduloId = Number(params.get('id') || 0);
  const mods = window.MODULOS || [];
  const modulo = mods.find(m => Number(m.id) === moduloId);
  const moduloTitulo = modulo ? modulo.titulo : `Módulo ${moduloId}`;

  // Bloqueo por calendario (si usás el candado)
  if (window.isModuleUnlocked && !window.isModuleUnlocked(moduloId)) {
    alert('Este módulo aún no está habilitado.');
    location.href = 'index.html#modulos';
    return;
  }

  // --- Configuración ---
  const TOTAL_PREG_DEFAULT = 10; // Cambiá si querés más por módulo
  const BTN_MIN_APROBAR = Math.ceil(TOTAL_PREG_DEFAULT * 0.6); // 60%
  const APP_API_URL = '/api/results';


  // --- Storage por MÓDULO ---
  const LS_PROGRESS_KEY = `alerta_test_mod_${moduloId}_progress`;
  const LS_RESULT_KEY   = `alerta_test_mod_${moduloId}_result`;

  // --- UI ---
  const $ = (s) => document.querySelector(s);
  const title = $('#title');
  const subtitle = $('#subtitle');
  const backLink = $('#backLink');
  if (title) title.textContent = `Test del módulo ${moduloId}: ${moduloTitulo}`;
  if (backLink) backLink.href = `modulo.html?id=${moduloId}`;

  const form = $('#form'), res  = $('#res');
  const btnStart  = $('#btnStart'), navWrap = $('#nav');
  const btnPrev   = $('#btnPrev'), btnNext  = $('#btnNext'), btnFinish = $('#btnFinish');
  const pBar  = $('#progressBar'), pText = $('#progressText');

  // --- Estado ---
  let banco = (window.BANCO_PREGUNTAS || []).filter(q => Number(q.modulo) === moduloId);
  let TOTAL_PREG = Math.min(TOTAL_PREG_DEFAULT, banco.length);
  if (TOTAL_PREG === 0) {
    alert(`No hay preguntas cargadas para el módulo ${moduloId}.`);
    location.href = `modulo.html?id=${moduloId}`;
    return;
  }
  let seleccion = [], seleccionIds = [], answers = {}, idx = 0, puntaje = 0;

  // --- Utils ---
  function sample(arr, n) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a.slice(0, n);
  }
  function saveProgress() {
    const answered = Object.keys(answers).length;
    localStorage.setItem(LS_PROGRESS_KEY, JSON.stringify({
      ids: seleccionIds, answers, index: idx, total: TOTAL_PREG, ts: Date.now(), answered
    }));
  }
  function clearProgress() { localStorage.removeItem(LS_PROGRESS_KEY); }
  function saveFinalResult(score) {
    localStorage.setItem(LS_RESULT_KEY, JSON.stringify({ score, total: TOTAL_PREG, ts: Date.now() }));
  }

  function updateProgressUI() {
    const answered = Object.keys(answers).length;
    const pct = Math.round((answered / TOTAL_PREG) * 100);
    pBar.style.width = pct + '%';
    pText.textContent = `${answered} / ${TOTAL_PREG}`;
  }

  function renderQuestion() {
    form.innerHTML = '';
    const q = seleccion[idx]; if (!q) return;
    const fs = document.createElement('fieldset');
    fs.className = 'q';
    fs.innerHTML = `
      <h3>${idx + 1}. ${q.pregunta}</h3>
      ${q.opciones.map((opt, i) => `
        <label class="opt" data-i="${i}">
          <input type="radio" name="q_${q.id}" value="${i}">
          ${opt}
        </label>`).join('')}
    `;
    form.appendChild(fs);
    const prev = answers[q.id];
    const labels = [...fs.querySelectorAll('.opt')];
    labels.forEach((l) => {
      const input = l.querySelector('input');
      if (Number(prev) === Number(input.value)) { input.checked = true; l.classList.add('selected'); }
      l.addEventListener('click', () => {
        labels.forEach(x => x.classList.remove('selected'));
        input.checked = true; l.classList.add('selected');
        answers[q.id] = Number(input.value);
        enableNavButtons(); updateProgressUI(); saveProgress();
      });
    });
    enableNavButtons(); updateProgressUI();
  }

  function enableNavButtons() {
    const hasPrev = idx > 0;
    const hasNext = idx < TOTAL_PREG - 1;
    const thisAnswered = answers[seleccion[idx].id] != null;
    btnPrev.disabled = !hasPrev;
    btnNext.disabled = !(hasNext && thisAnswered);
    btnFinish.disabled = false; // o solo al final si querés
  }

  function startNew() {
    localStorage.removeItem(LS_RESULT_KEY);
    if (banco.length < TOTAL_PREG) {
      alert(`Hay ${banco.length} preguntas y pediste ${TOTAL_PREG}. Bajamos a ${banco.length}.`);
      TOTAL_PREG = banco.length;
    }
    seleccion = sample(banco, TOTAL_PREG);
    seleccionIds = seleccion.map(q => q.id);
    answers = {}; idx = 0;
    btnStart.style.display = 'none';
    navWrap.style.display = 'flex';
    saveProgress(); renderQuestion(); res.textContent = '';
  }

  // --- Eventos navegación ---
  btnStart?.addEventListener('click', startNew);
  btnPrev?.addEventListener('click', (e) => { e.preventDefault(); idx = Math.max(0, idx - 1); saveProgress(); renderQuestion(); });
  btnNext?.addEventListener('click', (e) => { e.preventDefault(); idx = Math.min(TOTAL_PREG - 1, idx + 1); saveProgress(); renderQuestion(); });

  // --- Modales compat (tomados del test general) ---
  const modalIncomplete = $('#modalIncomplete');
  const incompleteText = $('#incompleteText');
  const incompleteClose = $('#incompleteClose');
  const incompleteGoto = $('#incompleteGoto');
  const modal = $('#modal'), mNombre = $('#mNombre'), mDni = $('#mDni'), mEmail = $('#mEmail'), mMsg = $('#mMsg'), mSend = $('#mSend'), mCancel = $('#mCancel');
  const modalFail = $('#modalFail'), failText = $('#failText'), fClose = $('#fClose'), fRetry = $('#fRetry');

  function closeModal(el) { el.classList.remove('show'); el.setAttribute('aria-hidden', 'true'); }

  mCancel?.addEventListener('click', (e) => { e.preventDefault(); closeModal(modal); });
  fClose?.addEventListener('click', (e) => { e.preventDefault(); closeModal(modalFail); });
  fRetry?.addEventListener('click', (e) => { e.preventDefault(); closeModal(modalFail); startNew(); });
  incompleteClose?.addEventListener('click', (e) => { e.preventDefault(); closeModal(modalIncomplete); });
  incompleteGoto?.addEventListener('click', (e) => {
    e.preventDefault();
    const firstUnanswered = seleccion.findIndex((q) => answers[q.id] == null);
    if (firstUnanswered !== -1) { idx = firstUnanswered; renderQuestion(); }
    closeModal(modalIncomplete);
  });

  // --- Enviar test ---
  btnFinish?.addEventListener('click', (e) => {
    e.preventDefault();
    if (Object.keys(answers).length < TOTAL_PREG) {
      incompleteText.textContent = 'Debes responder todas las preguntas.';
      modalIncomplete.classList.add('show'); modalIncomplete.setAttribute('aria-hidden', 'false');
      return;
    }
    // Puntaje
    let ok = 0; seleccion.forEach(q => { if (Number(answers[q.id]) === Number(q.correcta)) ok++; });
    puntaje = ok;

    saveFinalResult(puntaje); clearProgress();

    const aprobado = puntaje >= BTN_MIN_APROBAR;
    res.innerHTML = `Tu puntaje: <span class="${aprobado ? 'ok' : 'bad'}">${puntaje} / ${TOTAL_PREG}</span>`;

    if (aprobado) {
      mMsg.textContent = '';
      modal.classList.add('show'); modal.setAttribute('aria-hidden', 'false'); mNombre.focus();
    } else {
      failText.textContent = 'No aprobaste, reintenta el cuestionario.';
      modalFail.classList.add('show'); modalFail.setAttribute('aria-hidden', 'false');
    }
  });

  // --- Envío al backend (identificando MÓDULO) ---
mSend?.addEventListener('click', async (e) => {
  e.preventDefault();
  const nombre = (mNombre.value || '').trim();
  const dni    = (mDni.value || '').trim();
  const email  = (mEmail.value || '').trim();

  // Si querés seguir pidiendo estos datos, validalos; si no, podés omitirlos.
  if (!nombre || !dni || !email) { mMsg.textContent = 'Completá todos los campos.'; return; }

  try {
    mMsg.textContent = 'Enviando…';

    const r = await fetch(APP_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        moduloId,
        moduloTitulo,
        timestamp: new Date().toISOString(),
        // Estos tres campos hoy no los guarda el backend; si querés guardarlos,
        // podemos agregar una tabla user_profile o fields adicionales.
        nombre, dni, email,
        puntaje,
        total: TOTAL_PREG,
        aprobado: true,
        puntaje_pct: Math.round((puntaje / TOTAL_PREG) * 100),
        ids: seleccion.map(q => q.id).join(',')
      })
    });

    const resp = await r.json().catch(() => ({}));
    if (!r.ok || !resp.ok) throw new Error(resp.error || ('HTTP ' + r.status));

    mMsg.textContent = 'Registrado ✔️';
    setTimeout(() => closeModal(modal), 800);
  } catch (err) {
    console.error(err);
    mMsg.textContent = 'No se pudo enviar: ' + String(err);
  }
});


  // Estado inicial
  navWrap.style.display = 'none';
  updateProgressUI();
})();
