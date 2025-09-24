const tourSteps = [
  // HEADER
  {
    element: 'header.site',
    title: 'Barra superior',
    description: 'Esta es la barra superior del sitio, donde podés navegar entre Módulos, Preguntas Frecuentes, Contacto y Cerrar Sesión.',
    position: 'bottom'
  },

  // HERO - badge
  {
    element: '.hero .badge',
    title: 'Programa institucional',
    description: 'Este badge indica el programa y el año correspondiente.',
    position: 'bottom'
  },
  // HERO - actions
  {
    element: '.hero .actions',
    title: 'Acciones principales',
    description: 'Podés acceder directamente a los módulos o a la sección de preguntas frecuentes.',
    position: 'bottom'
  },
  // HERO - search
  {
    element: '.hero .search',
    title: 'Buscar contenido',
    description: 'Aquí podés buscar por tema, por ejemplo contraseñas, phishing o backups.',
    position: 'top'
  },

  // HERO - card test-card
  {
    element: '.card.test-card',
    title: 'Certificado de finalización',
    description: 'Completá y aprobá todos los módulos requeridos para poder solicitar tu certificado.',
    position: 'top'
  },

  // Módulos - título
  {
    element: '.modulos h2',
    title: 'Módulos formativos',
    description: 'Acá vas a encontrar la sección de módulos.',
    position: 'top'
  },

  // FAQ
  {
    element: '.faq',
    title: 'Preguntas frecuentes',
    description: 'Si tenés dudas sobre cómo usar la plataforma, esta sección te ayudará.',
    position: 'top'
  },

  // Contacto
  {
    element: '#contacto',
    title: 'Contacto',
    description: 'Consultas y soporte del programa A.L.E.R.T.A. UNCuyo.',
    position: 'top'
  },

  // Footer
  {
    element: '#footer',
    title: 'Footer',
    description: 'Aquí se encuentra información de contacto y links adicionales.',
    position: 'top'
  }
];

class TourGuide {
  constructor(steps) {
    this.steps = steps;
    this.currentStep = 0;
    this.isActive = false;
    this.elements = {
      overlay: null,
      spotlight: null,
      tooltip: null
    };
    this.init();
  }

  init() {
    this.createElements();
    this.bindEvents();
  }

  createElements() {
    // Crear overlay
    this.elements.overlay = document.createElement('div');
    this.elements.overlay.className = 'tour-overlay';
    document.body.appendChild(this.elements.overlay);

    // Crear spotlight
    this.elements.spotlight = document.createElement('div');
    this.elements.spotlight.className = 'tour-spotlight';
    document.body.appendChild(this.elements.spotlight);

    // Crear tooltip
        this.elements.tooltip = document.createElement('div');
        this.elements.tooltip.id = 'tour-tooltip';
        this.elements.tooltip.innerHTML = 
        `<br>
          <h3 id="tour-title"></h3>
          <p id="tour-desc"></p>
          <div class="tour-controls">
            <div class="tour-step-info">
              <span id="tour-step-current">1</span> de <span id="tour-step-total">${this.steps.length}</span>
            </div>
            <div class="tour-buttons">
              <button id="tour-prev" class="secondary">Anterior</button>
              <button id="tour-next">Siguiente</button>
              <button id="tour-close" class="danger">Cerrar</button>
            </div>
          </div>
        `;
        document.body.appendChild(this.elements.tooltip);
      }

  bindEvents() {
    document.getElementById('tour-prev').addEventListener('click', () => this.previousStep());
    document.getElementById('tour-next').addEventListener('click', () => this.nextStep());
    document.getElementById('tour-close').addEventListener('click', () => this.closeTour());

    document.addEventListener('keydown', (e) => {
      if (!this.isActive) return;
      switch(e.key) {
        case 'Escape': this.closeTour(); break;
        case 'ArrowLeft': e.preventDefault(); this.previousStep(); break;
        case 'ArrowRight': e.preventDefault(); this.nextStep(); break;
      }
    });

    document.addEventListener('wheel', (e) => {
      if (this.isActive) e.preventDefault();
    }, { passive: false });

    document.addEventListener('click', (e) => {
      if (this.isActive && !this.elements.tooltip.contains(e.target)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }

  startTour(stepIndex = 0) {
    this.currentStep = stepIndex;
    this.isActive = true;
    document.body.classList.add('tour-active');
    this.showStep(this.currentStep);
  }

  showStep(stepIndex) {
    const step = this.steps[stepIndex];
    const target = document.querySelector(step.element);
    
    if (!target) {
      console.error(`Elemento no encontrado: ${step.element}`);
      this.nextStep();
      return;
    }

    // Limpiar resaltado anterior
    document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));

    // Resaltar elemento actual
    target.classList.add('tour-highlight');

    // Scroll suave al elemento
    target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

    // Ajustar z-index del header solo en su paso
    const header = document.querySelector('header.site');
    if (header) {
      if (step.element === 'header.site' || step.element === '.site') {
        header.style.zIndex = '10001';
      } else {
        header.style.zIndex = '';
      }
    }
    const spotlightTarget = (step.element === '#modulos' || step.element === '#faq' || step.element === '#contacto') 
    ? document.querySelector(step.element) 
    : target;

    setTimeout(() => {
      this.positionSpotlight(target);
      this.positionTooltip(target, step);
      this.updateTooltipContent(step, stepIndex);
      this.showElements();
    }, 300);
  }

positionSpotlight(target) {
    const rect = target.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const scrollLeft = window.scrollX || window.pageXOffset;
    
    let padding = 8;
    if (['modulos', 'faq', 'contacto'].includes(target.id)) {
        padding = 16; // más espacio para secciones grandes
    }

    let top = rect.top + scrollTop - padding;
    let left = rect.left + scrollLeft - padding;
    let width = rect.width + padding * 2;
    let height = rect.height + padding * 2;

    // Ajuste para elementos sticky/fixed
    const style = window.getComputedStyle(target);
    if (style.position === 'fixed' || style.position === 'sticky') {
        top = rect.top - padding;
        left = rect.left - padding;
    }

    // Si la altura del elemento + padding es mayor que el viewport, limitar al viewport
    if (height > window.innerHeight - 40) { // 40px margen superior/inferior
        height = window.innerHeight - 40;
        top = scrollTop + 20;
    }

    this.elements.spotlight.style.zIndex = 1001;
    this.elements.spotlight.style.cssText = `
        top: ${top}px;
        left: ${left}px;
        width: ${width}px;
        height: ${height}px;
    `;
}



positionTooltip(target, step) {
    const tooltip = this.elements.tooltip;
    tooltip.style.visibility = 'hidden'; // ocultar para medir
    tooltip.style.display = 'block';

    const rect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const padding = 12;

    let top, left;

    // Espacio disponible alrededor del target
    const space = {
        top: rect.top,
        bottom: window.innerHeight - rect.bottom,
        left: rect.left,
        right: window.innerWidth - rect.right
    };

    // Colocación vertical prioritaria: abajo > arriba
    let positionClass = '';
    if (space.bottom >= tooltipRect.height + padding) {
        top = rect.bottom + window.scrollY + padding;
        positionClass = 'position-bottom';
    } else if (space.top >= tooltipRect.height + padding) {
        top = rect.top + window.scrollY - tooltipRect.height - padding;
        positionClass = 'position-top';
    } else {
        // fallback: centrar vertical dentro del viewport
        top = window.scrollY + Math.max(20, (window.innerHeight - tooltipRect.height) / 2);
        positionClass = 'position-bottom';
    }

    // Centrar horizontal respecto al target
    left = rect.left + window.scrollX + (rect.width - tooltipRect.width) / 2;

    // Evitar desbordes horizontales
    if (left < padding) left = padding;
    if (left + tooltipRect.width > window.innerWidth - padding) {
        left = window.innerWidth - tooltipRect.width - padding;
    }

    // Quitar clases previas y agregar la correcta
    tooltip.classList.remove('position-top', 'position-bottom');
    tooltip.classList.add(positionClass);

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
    tooltip.style.visibility = 'visible';
}




  updateTooltipContent(step, stepIndex) {
    document.getElementById('tour-title').textContent = step.title;
    document.getElementById('tour-desc').textContent = step.description;
    document.getElementById('tour-step-current').textContent = stepIndex + 1;

    const prevBtn = document.getElementById('tour-prev');
    const nextBtn = document.getElementById('tour-next');

    prevBtn.disabled = stepIndex === 0;
    if (stepIndex === this.steps.length - 1) {
      nextBtn.textContent = 'Finalizar';
      nextBtn.className = 'secondary';
    } else {
      nextBtn.textContent = 'Siguiente';
      nextBtn.className = '';
    }
  }

  showElements() {
    requestAnimationFrame(() => {
      this.elements.overlay.classList.add('active');
      setTimeout(() => this.elements.spotlight.classList.add('active'), 100);
      setTimeout(() => this.elements.tooltip.classList.add('active'), 200);
    });
  }

  hideElements() {
    this.elements.tooltip.classList.remove('active');
    this.elements.spotlight.classList.remove('active');
    this.elements.overlay.classList.remove('active');
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.showStep(this.currentStep);
    } else {
      this.closeTour();
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.showStep(this.currentStep);
    }
  }

  closeTour() {
    this.isActive = false;
    document.body.classList.remove('tour-active');
    document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
    this.hideElements();
    const header = document.querySelector('header.site');
    if (header) header.style.zIndex = '';
    if (typeof this.onTourEnd === 'function') this.onTourEnd();
  }

  static start(steps = tourSteps) {
    if (window.activeTour) window.activeTour.closeTour();
    window.activeTour = new TourGuide(steps);
    window.activeTour.startTour();
  }
}

// ---- Gate profesional: sólo primera vez por usuario ----
(function tourGate() {
  const TIMEOUT_MS = 5000;

  function withTimeout(promise, ms = TIMEOUT_MS) {
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('timeout')), ms);
      promise.then(v => { clearTimeout(t); resolve(v); })
             .catch(e => { clearTimeout(t); reject(e); });
    });
  }

  async function shouldShowTour() {
    try {
      const res = await withTimeout(fetch('/api/tour', { credentials: 'include' }));
      if (!res.ok) return false; // si el backend falla, no molestamos al usuario
      const { seen } = await res.json();
      return !seen;
    } catch {
      return false; // sin red/error → mejor no mostrarlo
    }
  }

  async function markTourDone() {
    try {
      await withTimeout(fetch('/api/tour/done', { method: 'POST', credentials: 'include' }));
    } catch {
      // si falla, no rompemos UX; la próxima vez backend volverá a intentarlo
    }
  }

  window.addEventListener('load', async () => {
    const show = await shouldShowTour();
    if (!show) return;

    // Opción 1 (menos intrusiva): marcarlo como visto AL EMPEZAR para no re-aparecer
    await markTourDone();

    // Iniciar el tour con callback por si querés registrar "fin"
    const tg = new TourGuide(tourSteps);
    tg.onTourEnd = () => { /* opcional: analytics, etc. */ };
    tg.startTour();

    // Opción 2 (si querés marcar AL TERMINAR en vez de al empezar):
    // comentá la llamada inicial a markTourDone() y descomentá abajo:
    // tg.onTourEnd = markTourDone;
  });
})();


// Esto se puede utilizar para pruebas

/*window.addEventListener('load', () => {
  // resetear scroll al inicio
  window.scrollTo(0, 0);
  
  // iniciar el tour después de que todo cargue
  setTimeout(() => TourGuide.start(), 500);
});

window.restartTour = () => TourGuide.start();*/
