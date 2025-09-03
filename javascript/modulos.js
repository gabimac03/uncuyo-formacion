// Archivo: javascript/module.js
(function () {
  const $ = (sel) => document.querySelector(sel);

  // 1) ID de la URL
  const params = new URLSearchParams(location.search);
  const idParam = params.get('id');

  // 2) Datos base desde main.js
  const mods = window.MODULOS || [];
  const modulo = mods.find(m => String(m.id) === String(idParam));

  // Botón "Rendir test del módulo"
  const cta = document.getElementById('cta-test-modulo');
  if (cta) {
    const unlocked = window.isModuleUnlocked ? window.isModuleUnlocked(Number(idParam)) : (Number(idParam) === 1);
    cta.innerHTML = unlocked
      ? `<a class="btn primary" href="test-modulo.html?id=${idParam}">Rendir test del módulo</a>`
      : `<button class="btn" disabled>Disponible en ${window.getModuleReleaseLabel ? window.getModuleReleaseLabel(Number(idParam)) : 'próximos meses'}</button>`;
  }

  // 3) Detalle desde module-data.js
  const detalle = (window.MODULO_DETALLE && window.MODULO_DETALLE[idParam]) || {};

  // 4) Cabecera
  const h1 = $('#titulo');
  const pResumen = $('#resumen');

  // --- BLOQUEO por calendario: si el módulo no está habilitado, no mostrar contenido
const desbloqueado = window.isModuleUnlocked ? window.isModuleUnlocked(Number(idParam)) : (Number(idParam) === 1);
if (!desbloqueado) {
  h1.textContent = 'Módulo bloqueado';
  pResumen.innerHTML = `Este módulo estará disponible en <strong>${window.getModuleReleaseLabel ? window.getModuleReleaseLabel(Number(idParam)) : 'próximos meses'}</strong>.`;

  // Limpio secciones
  const zonas = ['puntos','contenido-list','ejemplos-ui','ejemplo-contenido'];
  zonas.forEach(id => { const n = document.getElementById(id); if (n) n.innerHTML = ''; });

  // "Otros módulos": link sólo a los abiertos, los demás como texto + fecha
  const otros = document.getElementById('otros-modulos');
  if (otros) {
    const mods = window.MODULOS || [];
    otros.innerHTML = mods
      .filter(m => String(m.id) !== String(idParam))
      .map(m => {
        const ok = window.isModuleUnlocked && window.isModuleUnlocked(m.id);
        return ok
          ? `<li><a href="modulo.html?id=${m.id}">${m.id}. ${m.titulo}</a></li>`
          : `<li class="locked">${m.id}. ${m.titulo} <span class="tiny">(desde ${window.getModuleReleaseLabel(m.id)})</span></li>`;
      })
      .join('');
  }
  return; // corta acá: no renderiza contenido ni ejemplos
}

  if (!modulo) {
    h1.textContent = 'Módulo no encontrado';
    pResumen.textContent = 'El ID indicado no corresponde a un módulo existente.';
    return;
  }
  h1.textContent = `${modulo.id}. ${modulo.titulo}`;
  pResumen.textContent = detalle.resumenCorto || modulo.desc || 'Agregá un resumen en module-data.js';

  // 5) Resumen (tarjetas)
  const items = Array.isArray(detalle.puntos) ? detalle.puntos : [];
  const cont = document.getElementById('puntos');
  if (!items.length) {
    cont.innerHTML = `<div class="tiny">Agregá tarjetas en module-data.js → puntos[]</div>`;
  } else {
    cont.innerHTML = items.map((it, i) => {
      if (typeof it === 'string') {
        return `
          <article class="resumen-card">
            <div class="resumen-card__topbar"></div>
            <div class="resumen-card__body">
              <div class="resumen-card__index">${i + 1}</div>
              <div class="resumen-card__text">${it}</div>
            </div>
          </article>`;
      } else {
        const t = it.titulo || `Punto ${i + 1}`;
        const txt = it.texto || '';
        return `
          <article class="resumen-card">
            <div class="resumen-card__topbar"></div>
            <div class="resumen-card__body">
              <h3 class="resumen-card__title">${t}</h3>
              <div class="resumen-card__text">${txt}</div>
            </div>
          </article>`;
      }
    }).join('');
  }

  // 6) Contenido (icono + título + texto + badges)
  function renderContenido(det) {
    const wrap = document.getElementById('contenido-list');
    if (!wrap) return;
    const items = Array.isArray(det.contenido) ? det.contenido : [];
    if (!items.length) {
      wrap.innerHTML = `<div class="tiny">Agregá ítems en modulo-datos.js → contenido[]</div>`;
      return;
    }
    wrap.innerHTML = items.map((it, i) => {
      if (typeof it === 'string') {
        return `
          <div class="contenido-item">
            <div class="contenido-icon">📝</div>
            <div class="contenido-main">
              <h3 class="contenido-titulo">Bloque ${i + 1}</h3>
              <p class="contenido-texto">${it}</p>
            </div>
          </div>`;
      }
      const icon   = it.icon || '🟦';
      const titulo = it.titulo || `Bloque ${i + 1}`;
      const texto  = it.texto || '';
      const aciertos = (it.aciertos || []).map(t => `<span class="badge badge--ok">${t}</span>`).join('');
      const peligros = (it.peligros || []).map(t => `<span class="badge badge--danger">${t}</span>`).join('');
      const avisos   = (it.avisos   || []).map(t => `<span class="badge badge--warn">${t}</span>`).join('');
      return `
        <div class="contenido-item">
          <div class="contenido-icon">${icon}</div>
          <div class="contenido-main">
            <h3 class="contenido-titulo">${titulo}</h3>
            <p class="contenido-texto">${texto}</p>
            <div class="badges">${aciertos}${peligros}${avisos}</div>
          </div>
        </div>`;
    }).join('');
  }
  renderContenido(detalle);

  // 7) Ejemplos prácticos (botones + panel)
  const ejemplos = (detalle.ejemplos && Object.entries(detalle.ejemplos)) || [];
  const ui = $('#ejemplos-ui');
  const panel = document.querySelector('#ejemplo-contenido') || document.querySelector('#ejemploM-contenido');

  if (!ejemplos.length) {
    ui.innerHTML = '<span class="tiny">Cargá ejemplos en module-data.js → ejemplos{}</span>';
  } else {
    ui.innerHTML = ejemplos.map(([key], i) =>
      `<button class="btn" data-key="${key}">Ejemplo ${i+1}</button>`
    ).join('');

    ui.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-key]');
      if (!btn) return;
      const key = btn.dataset.key;
      const html = detalle.ejemplos[key] || '<em>Sin contenido.</em>';
      panel.innerHTML = html;           // inyecta el ejemplo
      inicializarQuiz(panel);           // activa el quiz en ese contenido
    });
  }

  // 8) Otros módulos
  const otros = $('#otros-modulos');
  otros.innerHTML = mods
    .filter(m => String(m.id) !== String(idParam))
    .map(m => `<li><a href="modulo.html?id=${m.id}">${m.id}. ${m.titulo}</a></li>`)
    .join('');
})();

// === QUIZ INTERACTIVO (acierto/error + cartel) ===
function inicializarQuiz(root) {
  const quizzes = root.querySelectorAll('.quiz');
  quizzes.forEach((q) => {
    const opciones = q.querySelectorAll('.quiz-option');

    // Botón Reintentar (si no existe)
    let btnReset = q.querySelector('.quiz-reset');
    if (!btnReset) {
      btnReset = document.createElement('button');
      btnReset.className = 'btn small quiz-reset';
      btnReset.textContent = 'Reintentar';
      q.appendChild(btnReset);
    }

    // Cartel verde/rojo con explicación
    function showCartel(tipo, titulo, texto) {
      q.querySelectorAll('.cartel').forEach(n => n.remove()); // limpiar previos
      const div = document.createElement('div');
      div.className = `cartel cartel--${tipo}`;
      div.setAttribute('role', 'alert');
      div.innerHTML = `
        <div class="cartel__icon">${tipo === 'ok' ? '✅' : '⚠️'}</div>
        <div class="cartel__body">
          <div class="cartel__title">${titulo}</div>
          <div class="cartel__text">${texto || ''}</div>
        </div>
        <button class="cartel__close" aria-label="Cerrar">✕</button>
      `;
      q.insertAdjacentElement('afterbegin', div);
      div.querySelector('.cartel__close').addEventListener('click', () => div.remove());
      setTimeout(() => div.remove(), 6000);
    }

    function bloquear() {
      opciones.forEach(b => b.disabled = true);
      q.dataset.done = '1';
    }
    function resetear() {
      opciones.forEach(b => {
        b.disabled = false;
        b.classList.remove('is-correct','is-wrong');
      });
      q.querySelectorAll('.cartel').forEach(n => n.remove());
      q.dataset.done = '';
    }

    opciones.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (q.dataset.done) return;
        const ok = btn.dataset.correct === 'true';
        const explicacion = btn.dataset.explain || '';
        if (ok) {
          btn.classList.add('is-correct');
          showCartel('ok', '¡Correcto!', explicacion);
        } else {
          btn.classList.add('is-wrong');
          const correcta = q.querySelector('.quiz-option[data-correct="true"]');
          if (correcta) correcta.classList.add('is-correct');
          showCartel('danger', 'Respuesta incorrecta', explicacion);
        }
        bloquear();
      });
    });

    btnReset.addEventListener('click', resetear);
  });
}
