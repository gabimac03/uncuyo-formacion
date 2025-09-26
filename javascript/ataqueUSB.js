document.addEventListener('DOMContentLoaded', () => {
  const overlay  = document.getElementById('alerta_overlay');
  const modal    = document.getElementById('alerta_modal');
  const btnTips  = document.getElementById('alerta_btnTips');
  const btnClose = document.getElementById('alerta_btnClose');
  const tips     = [
    document.getElementById('alerta_tip1'),
    document.getElementById('alerta_tip2'),
    document.getElementById('alerta_tip3')
  ].filter(Boolean); // Filtramos por si falta alguno

  let tipsVisible = false;
  let currentTipIndex = 0;
  let tipTimeout = null;

  /**
   * Mide un tip sin hacerlo visible al usuario.
   */
  function measureTip(tip) {
    if (!tip) return { w: 0, h: 0 };
    const prevDisplay = tip.style.display;
    const prevVis = tip.style.visibility;

    tip.style.visibility = 'hidden';
    tip.style.display = 'block';
    const rect = tip.getBoundingClientRect();

    tip.style.display = prevDisplay || 'none';
    tip.style.visibility = prevVis || '';
    return { w: rect.width, h: rect.height };
  }

  /**
   * Posiciona los tips al costado del modal (derecha si hay lugar, si no izquierda).
   */
  function placeTips() {
    if (!modal) return;

    const r = modal.getBoundingClientRect();
    const gap = 24;    // separación del modal
    const margin = 16; // margen con el borde de la ventana

    const sizes = tips.map(measureTip);
    const maxW = Math.max(...sizes.map(s => s.w), 0);

    const rightX = r.right + gap;
    const rightFits = (rightX + maxW + margin) <= window.innerWidth;

    const colX = rightFits ? rightX : Math.max(margin, r.left - maxW - gap);

    // Alturas relativas al modal (10%, 35%, 60%)
    const tops = [
      r.top + r.height * 0.10,
      r.top + r.height * 0.35,
      r.top + r.height * 0.60
    ];

    tips.forEach((tip, i) => {
      if (!tip) return;
      const { w, h } = sizes[i];
      const clampedX = Math.min(Math.max(colX, margin), window.innerWidth - w - margin);
      const clampedY = Math.min(Math.max(tops[i], margin), window.innerHeight - h - margin);
      tip.style.left = `${clampedX}px`;
      tip.style.top  = `${clampedY}px`;
    });
  }

  /**
   * Oculta y reinicia los tips.
   */
  function resetTips() {
    tips.forEach(tip => {
      if (!tip) return;
      tip.style.display = 'none';
      tip.classList.remove('tip-loading');
    });
    tipsVisible = false;
    currentTipIndex = 0;
    if (btnTips) btnTips.textContent = '🎯 ¿Cómo protegerme?';
    if (tipTimeout) clearTimeout(tipTimeout);
  }

  /**
   * Muestra los tips uno a uno de forma secuencial.
   */
  function showTipsSequentially() {
    if (tipsVisible) {
      resetTips();
      return;
    }

    placeTips();
    tipsVisible = true;
    if (btnTips) btnTips.textContent = '❌ Ocultar consejos';
    currentTipIndex = 0;

    function showNextTip() {
      if (currentTipIndex < tips.length) {
        const tip = tips[currentTipIndex];
        if (tip) {
          tip.style.display = 'block';
          tip.classList.add('tip-loading');
        }
        currentTipIndex++;
        tipTimeout = setTimeout(showNextTip, 800);
      }
    }

    showNextTip();
  }

  /**
   * Cierra el modal suavemente.
   */
  function closeModal() {
    if (!overlay) return;
    overlay.style.animation = 'uncuyo-simulation-fadeIn 0.3s ease-out reverse';
    setTimeout(() => {
      overlay.style.display = 'none';
      resetTips();
    }, 300);
  }

  // === Eventos ===
  btnTips?.addEventListener('click', showTipsSequentially);
  btnClose?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  modal?.addEventListener('click', e => e.stopPropagation());
  window.addEventListener('resize', () => { if (tipsVisible) placeTips(); });

  console.log('✅ UNCuyo USB Tips inicializado', {
    overlay: !!overlay,
    modal: !!modal,
    btnTips: !!btnTips,
    btnClose: !!btnClose,
    tips: tips.length
  });
});
