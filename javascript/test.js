// Archivo: javascript/test.js (MODO PRÁCTICA, sin Google Sheets)
(function () {
  'use strict';

  // --- Configuración ---
  const TOTAL_PREG = 15;
  const BTN_MIN_APROBAR = 9; // 9/15 = 60%
  const PRACTICA = true;     // este test es solo de práctica (no registra datos)
  const TOTAL_MODULOS = (window.TOTAL_MODULOS || 6); // cantidad de módulos a considerar

  // --- Claves de storage (para progreso/resultado en la home) ---
  const LS_PROGRESS_KEY = 'alerta_test_progress';
  const LS_RESULT_KEY   = 'alerta_test_result';

  // --- Helpers DOM ---
  const $ = (s) => document.querySelector(s);
  const form = $('#form');
  const res  = $('#res');

  const btnStart  = $('#btnStart');
  const navWrap   = $('#nav');
  const btnPrev   = $('#btnPrev');
  const btnNext   = $('#btnNext');
  const btnFinish = $('#btnFinish');

  const pBar  = $('#progressBar');
  const pText = $('#progressText');

  // Modal INCOMPLETO (faltan preguntas)
  const modalIncomplete  = $('#modalIncomplete');
  const incompleteText   = $('#incompleteText');
  const incompleteClose  = $('#incompleteClose');
  const incompleteGoto   = $('#incompleteGoto');

  // --- Estado del intento ---
  let seleccion = [];     // preguntas sorteadas (objetos)
  let seleccionIds = [];  // ids para persistir
  let answers = {};       // { idPregunta: indiceSeleccionado }
  let idx = 0;            // índice visible 0..TOTAL-1
  let puntaje = 0;

  // --- Gateo: sólo cuando TODOS los módulos estén abiertos ---
  function areAllModulesOpen() {
    // 1) Si existe una función global explícita:
    if (typeof window.areAllModulesOpen === 'function') {
      try { return !!window.areAllModulesOpen(); } catch (_) {}
    }
    // 2) Si hay una estructura global MODULOS con flags (array u objeto):
    if (Array.isArray(window.MODULOS)) {
      const arr = window.MODULOS;
      if (arr.length) {
        return arr.every(m => m && (m.abierto === true || m.open === true));
      }
    } else if (window.MODULOS && typeof window.MODULOS === 'object') {
      const vals = Object.values(window.MODULOS);
      if (vals.length) {
        return vals.every(m => m && (m.abierto === true || m.open === true));
      }
    }
    // 3) Si se marca por localStorage (p.ej., 'mod_1_open' = '1', etc.):
    let ok = 0;
    for (let i = 1; i <= TOTAL_MODULOS; i++) {
      if (localStorage.getItem('mod_' + i + '_open') === '1') ok++;
    }
    if (ok === TOTAL_MODULOS) return true;

    // 4) Si hay fechas de apertura:
    if (window.MODULE_OPEN_DATES && typeof window.MODULE_OPEN_DATES === 'object') {
      const now = Date.now();
      const entries = Object.entries(window.MODULE_OPEN_DATES);
      if (entries.length) {
        // si alguna fecha de apertura es futura, aún no está todo abierto
        for (const [, dateStr] of entries) {
          const t = new Date(dateStr).getTime();
          if (!isNaN(t) && t > now) return false;
        }
        return true; // todas las fechas ya pasaron
      }
    }

    // 5) Desconocido → por seguridad, NO habilitar
    return false;
  }

  function showGateMessage() {
    if (res) {
      res.innerHTML = `
        <div class="tiny" style="margin-top:.5rem;opacity:.85">
          El test de práctica se habilitará cuando <b>todos los módulos</b> estén disponibles.
        </div>
      `;
    }
  }

  function clearGateMessage() {
    if (res && res.innerHTML && res.innerHTML.includes('se habilitará')) {
      res.innerHTML = '';
    }
  }

  function gateCheck() {
    const ok = areAllModulesOpen();
    if (!ok) {
      if (btnStart) {
        btnStart.disabled = true;
        btnStart.classList.add('disabled');
      }
      showGateMessage();
    } else {
      if (btnStart) {
        btnStart.disabled = false;
        btnStart.classList.remove('disabled');
      }
      clearGateMessage();
    }
    return ok;
  }

  // --- Utilidades de estado/progreso ---
  function saveProgress() {
    const answered = Object.keys(answers).length;
    const payload = {
      ids: seleccionIds,
      answers,
      index: idx,
      total: TOTAL_PREG,
      ts: Date.now(),
      answered,
    };
    localStorage.setItem(LS_PROGRESS_KEY, JSON.stringify(payload));
  }
  function clearProgress() {
    localStorage.removeItem(LS_PROGRESS_KEY);
  }
  function saveFinalResult(score) {
    localStorage.setItem(
      LS_RESULT_KEY,
      JSON.stringify({
        score,
        total: TOTAL_PREG,
        ts: Date.now(),
        mode: 'practice' // marca explícita de modo práctica
      })
    );
  }

  function sample(arr, n) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice(0, n);
  }

  // --- UI: una pregunta por pantalla ---
  function renderQuestion() {
    form.innerHTML = '';
    const q = seleccion[idx];
    if (!q) return;

    const fs = document.createElement('fieldset');
    fs.className = 'q';
    fs.innerHTML = `
      <h3>${idx + 1}. ${q.pregunta}</h3>
      ${q.opciones.map((opt, i) => `
        <label class="opt" data-i="${i}">
          <input type="radio" name="q_${q.id}" value="${i}">
          ${opt}
        </label>
      `).join('')}
    `;
    form.appendChild(fs);

    // restaurar selección si existía
    const prev = answers[q.id];
    const labels = [...fs.querySelectorAll('.opt')];
    labels.forEach((l) => {
      const input = l.querySelector('input');
      if (Number(prev) === Number(input.value)) {
        input.checked = true;
        l.classList.add('selected');
      }
      // seleccionar = marcar radio + resaltar toda la fila
      l.addEventListener('click', () => {
        labels.forEach((x) => x.classList.remove('selected'));
        input.checked = true;
        l.classList.add('selected');
        answers[q.id] = Number(input.value);
        enableNavButtons();
        updateProgressUI(); // barra en vivo
        saveProgress();
      });
    });

    enableNavButtons();
    updateProgressUI();
  }

  function updateProgressUI() {
    const answered = Object.keys(answers).length;
    const pct = Math.round((answered / TOTAL_PREG) * 100);
    pBar.style.width = pct + '%';
    pText.textContent = `${answered} / ${TOTAL_PREG}`;
  }

  function enableNavButtons() {
    const hasPrev = idx > 0;
    const hasNext = idx < TOTAL_PREG - 1;
    const curr = seleccion[idx];
    const thisAnswered = curr ? (answers[curr.id] != null) : false;

    btnPrev.disabled  = !hasPrev;
    btnNext.disabled  = !(hasNext && thisAnswered);

    // Permitir "Enviar" en cualquier momento (si preferís sólo al final, cambiá esta línea)
    btnFinish.disabled = false;
  }

  // --- Flujo ---
  function startNew(){
    // gating: sólo si todos los módulos están abiertos
    if (!gateCheck()) return;

    // limpia el resultado final previo para que el home no muestre el % viejo
    localStorage.removeItem(LS_RESULT_KEY);

    const banco = Array.isArray(window.BANCO_PREGUNTAS) ? window.BANCO_PREGUNTAS : [];
    if (banco.length < TOTAL_PREG) {
      alert(`Necesitás al menos ${TOTAL_PREG} preguntas en test-data.js (hay ${banco.length}).`);
      return;
    }
    seleccion    = sample(banco, TOTAL_PREG);
    seleccionIds = seleccion.map(q => q.id);
    answers = {};
    idx = 0;

    btnStart.style.display = 'none';
    navWrap.style.display  = 'flex';

    saveProgress();   // guarda answered = 0, así el porcentaje arranca en 0
    renderQuestion();
    res.textContent = '';
  }

  // --- Botones navegación ---
  btnStart?.addEventListener('click', startNew);
  btnPrev?.addEventListener('click', (e) => {
    e.preventDefault();
    idx = Math.max(0, idx - 1);
    saveProgress();
    renderQuestion();
  });
  btnNext?.addEventListener('click', (e) => {
    e.preventDefault();
    idx = Math.min(TOTAL_PREG - 1, idx + 1);
    saveProgress();
    renderQuestion();
  });

  // --- Enviar test (MODO PRÁCTICA: sin datos personales, sin envío) ---
  btnFinish?.addEventListener('click', (e) => {
    e.preventDefault();

    // Si falta alguna: modal de incompletas
    if (Object.keys(answers).length < TOTAL_PREG) {
      incompleteText.textContent = 'Debes responder todas las preguntas.';
      modalIncomplete.classList.add('show');
      modalIncomplete.setAttribute('aria-hidden', 'false');
      return;
    }

    // Puntaje
    let ok = 0;
    seleccion.forEach((q) => {
      if (Number(answers[q.id]) === Number(q.correcta)) ok++;
    });
    puntaje = ok;

    // Guardar resultado final para la home y limpiar progreso
    saveFinalResult(puntaje);
    clearProgress();

    const aprobado = puntaje >= BTN_MIN_APROBAR;
    res.innerHTML = `
      Tu puntaje: <span class="${aprobado ? 'ok' : 'bad'}">${puntaje} / ${TOTAL_PREG}</span>
      <div class="tiny" style="margin-top:.5rem;opacity:.8">
        Modo práctica: no se registran datos ni se envían resultados.
      </div>
    `;

    // Reinicio rápido
    btnStart.textContent = 'Reintentar práctica';
    btnStart.style.display = '';
    navWrap.style.display = 'none';
  });

  // --- Modales: incompleto (cerrar o ir a la primera pendiente) ---
  function closeModal(el) {
    el.classList.remove('show');
    el.setAttribute('aria-hidden', 'true');
  }
  incompleteClose?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(modalIncomplete);
  });
  incompleteGoto?.addEventListener('click', (e) => {
    e.preventDefault();
    const firstUnanswered = seleccion.findIndex((q) => answers[q.id] == null);
    if (firstUnanswered !== -1) {
      idx = firstUnanswered;
      renderQuestion();
    }
    closeModal(modalIncomplete);
  });

  // --- Estado inicial: botón Comenzar y barra 0/15 ---
  navWrap.style.display = 'none';
  updateProgressUI(); // 0 / 15 al entrar

  // Aplicar gateo al cargar y cuando la pestaña recobra foco
  gateCheck();
  window.addEventListener('focus', gateCheck);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) gateCheck();
  });
})();
