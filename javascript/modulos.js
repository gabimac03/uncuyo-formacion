// Archivo: javascript/modulo.js
(function () {
  const $ = (sel) => document.querySelector(sel);

  // 1) Obtener ID del módulo desde la URL
  const params = new URLSearchParams(location.search);
  const idParam = params.get('id');

  // 2) Datos base desde main.js
  const mods = window.MODULOS || [];
  const modulo = mods.find(m => String(m.id) === String(idParam));

  // 3) Botón "Rendir test del módulo"
  const cta = document.getElementById('cta-test-modulo');
  if (cta) {
    const unlocked = window.isModuleUnlocked ? window.isModuleUnlocked(Number(idParam)) : (Number(idParam) === 1);
    cta.innerHTML = unlocked
      ? `<a class="btn primary" href="test-modulo.html?id=${idParam}">Rendir test del módulo</a>`
      : `<button class="btn" disabled>Disponible en ${window.getModuleReleaseLabel ? window.getModuleReleaseLabel(Number(idParam)) : 'próximos meses'}</button>`;
  }

  // 4) Datos del detalle desde module-data.js
  const detalle = (window.MODULO_DETALLE && window.MODULO_DETALLE[idParam]) || {};

  // ✅ NUEVO: exponemos el módulo actual globalmente
  window.moduloSeleccionado = detalle;

  // 5) Cabecera
  const h1 = $('#titulo');
  const pResumen = $('#resumen');

  // --- BLOQUEO por calendario ---
  const desbloqueado = window.isModuleUnlocked ? window.isModuleUnlocked(Number(idParam)) : (Number(idParam) === 1);
  if (!desbloqueado) {
    h1.textContent = 'Módulo bloqueado';
    pResumen.innerHTML = `Este módulo estará disponible en <strong>${window.getModuleReleaseLabel ? window.getModuleReleaseLabel(Number(idParam)) : 'próximos meses'}</strong>.`;

    // Limpio contenido y ejemplos
    const zonas = ['contenido-principal','ejemplos-ui','ejemplo-contenido'];
    zonas.forEach(id => { const n = document.getElementById(id); if (n) n.innerHTML = ''; });

    // "Otros módulos": link solo a los abiertos
    const otros = document.getElementById('otros-modulos');
    if (otros) {
      otros.innerHTML = mods
        .filter(m => String(m.id) !== String(idParam))
        .map(m => {
          const ok = window.isModuleUnlocked && window.isModuleUnlocked(m.id);
          return ok
            ? `<li><a href="modulo.html?id=${m.id}">${m.id}. ${m.titulo}</a></li>`
            : `<li class="locked">${m.id}. ${m.titulo} <span class="tiny">(desde ${window.getModuleReleaseLabel ? window.getModuleReleaseLabel(m.id) : 'próximos meses'})</span></li>`;
        })
        .join('');
    }
    return; // No renderiza contenido si está bloqueado
  }

  if (!modulo) {
    h1.textContent = 'Módulo no encontrado';
    pResumen.textContent = 'El ID indicado no corresponde a un módulo existente.';
    return;
  }

  h1.textContent = `${modulo.id}. ${modulo.titulo}`;
  pResumen.textContent = detalle.resumen || modulo.desc || 'Agregá un resumen en module-data.js';

  // 6) Contenido narrativo
  const cont = document.getElementById('contenido-principal');
  if (cont && detalle.contenidoNarrativo) {
    cont.innerHTML = detalle.contenidoNarrativo;
  }

  // 7) Ejemplos prácticos
  const ejemplos = (detalle.ejemplos && Object.entries(detalle.ejemplos)) || [];
  const ui = $('#ejemplos-ui');
  const panel = document.querySelector('#ejemplo-contenido');

  if (!ejemplos.length) {
    if (ui) ui.innerHTML = '<span class="tiny">Cargá ejemplos en module-data.js → ejemplos{}</span>';
  } else {
    if (ui) {
      ui.innerHTML = ejemplos.map(([key], i) =>
        `<button class="btn" data-key="${key}">Ejemplo ${i + 1}</button>`
      ).join('');

      ui.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-key]');
        if (!btn) return;
        const key = btn.dataset.key;
        const html = detalle.ejemplos[key] || '<em>Sin contenido.</em>';
        if (panel) {
          panel.innerHTML = html;
          inicializarQuiz(panel);
        }
      });
    }
  }

  // 8) Otros módulos
  const otros = $('#otros-modulos');
  if (otros) {
    otros.innerHTML = mods
      .filter(m => String(m.id) !== String(idParam))
      .map(m => `<li><a href="modulo.html?id=${m.id}">${m.id}. ${m.titulo}</a></li>`)
      .join('');
  }
})();

// === QUIZ INTERACTIVO ===
function inicializarQuiz(root) {
  const quizzes = root.querySelectorAll('.quiz');
  quizzes.forEach((q) => {
    const opciones = q.querySelectorAll('.quiz-option');

    // Botón Reintentar
    let btnReset = q.querySelector('.quiz-reset');
    if (!btnReset) {
      btnReset = document.createElement('button');
      btnReset.className = 'btn small quiz-reset';
      btnReset.textContent = 'Reintentar';
      q.appendChild(btnReset);
    }

    // Cartel verde/rojo
    function showCartel(tipo, titulo, texto) {
      q.querySelectorAll('.cartel').forEach(n => n.remove());
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


// === DESCARGAR PDF ===
document.addEventListener("DOMContentLoaded", () => {
  const btnPdf = document.getElementById("btn-pdf");
  const moduloActual = window.moduloSeleccionado || {};

  if (!btnPdf) return;

  // 🔹 Función para mostrar cartel visual
  function mostrarCartel(tipo, titulo, texto) {
    // Elimina carteles previos
    document.querySelectorAll('.cartel-global').forEach(c => c.remove());

    const div = document.createElement('div');
    div.className = `cartel cartel--${tipo} cartel-global`;
    div.setAttribute('role', 'alert');
    div.innerHTML = `
      <div class="cartel__icon">${tipo === 'ok' ? '✅' : '⚠️'}</div>
      <div class="cartel__body">
        <div class="cartel__title">${titulo}</div>
        <div class="cartel__text">${texto || ''}</div>
      </div>
      <button class="cartel__close" aria-label="Cerrar">✕</button>
    `;
    document.body.appendChild(div);

    // Centrar en pantalla
    Object.assign(div.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: '9999',
      maxWidth: '340px',
      animation: 'fadeIn 0.3s ease'
    });

    div.querySelector('.cartel__close').addEventListener('click', () => div.remove());
    setTimeout(() => div.remove(), 6000);
  }

  // 🔹 Animación simple (opcional)
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  // 🔹 Evento de descarga
  btnPdf.addEventListener("click", async () => {
    const pdfPath = moduloActual?.pdf;

    if (!pdfPath) {
      mostrarCartel('danger', 'PDF no disponible', '📚 Este módulo aún no tiene un PDF disponible.');
      return;
    }

    try {
      const res = await fetch(pdfPath, { method: "HEAD" });
      if (!res.ok) throw new Error("No encontrado");

      const link = document.createElement("a");
      link.href = pdfPath;
      link.download = pdfPath.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      mostrarCartel('ok', 'Descarga iniciada', 'Tu archivo PDF se está descargando correctamente.');
    } catch (err) {
      mostrarCartel('danger', 'Error de descarga', '⚠️ El archivo aún no está disponible o hay un problema de conexión.');
    }
  });
});

