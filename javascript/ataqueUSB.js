document.addEventListener('DOMContentLoaded', () => {
  // Utilidad: toma el primer elemento existente de una lista de IDs
  const get = (...ids) => ids.map(id => document.getElementById(id)).find(Boolean);

  // Soporta IDs nuevos y antiguos
  const overlay  = get('uncuyoUsbSim2025_overlay',  'alerta_overlay');
  const modal    = get('uncuyoUsbSim2025_modal',    'alerta_modal');
  const btnTips  = get('uncuyoUsbSim2025_btnTips',  'alerta_btnTips');
  const btnClose = get('uncuyoUsbSim2025_btnClose', 'alerta_btnClose');

  // Tips (deduplicado)
  const tipIds = [
    'uncuyoUsbSim2025_tip1','uncuyoUsbSim2025_tip2','uncuyoUsbSim2025_tip3',
    'alerta_tip1','alerta_tip2','alerta_tip3'
  ];
  const tips = [...new Set(tipIds.map(id => document.getElementById(id)).filter(Boolean))];

  let tipsVisible = false;
  let currentTipIndex = 0;
  let tipTimeout = null;

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

  // Posiciona tips a la derecha del modal (o a la izquierda si no entra)
  function placeTips() {
    if (!modal || tips.length === 0) return;

    const r = modal.getBoundingClientRect();
    const gap = 24;
    const margin = 16;

    const sizes = tips.map(measureTip);
    const maxW = Math.max(...sizes.map(s => s.w), 0);

    const rightX = r.right + gap;
    const rightFits = (rightX + maxW + margin) <= window.innerWidth;
    const colX = rightFits ? rightX : Math.max(margin, r.left - maxW - gap);

    const tops = [ r.top + r.height * 0.10, r.top + r.height * 0.35, r.top + r.height * 0.60 ];

    tips.forEach((tip, i) => {
      const { w, h } = sizes[i] || { w: 0, h: 0 };
      const clampedX = Math.min(Math.max(colX, margin), window.innerWidth - w - margin);
      const clampedY = Math.min(Math.max(tops[i] || r.top, margin), window.innerHeight - h - margin);
      tip.style.left = `${clampedX}px`;
      tip.style.top  = `${clampedY}px`;
    });
  }

  function resetTips() {
    tips.forEach(tip => {
      tip.style.display = 'none';
      tip.classList.remove('tip-loading');
    });
    tipsVisible = false;
    currentTipIndex = 0;
    if (btnTips) btnTips.textContent = '🎯 ¿Cuál fue mi error?';
    if (tipTimeout) clearTimeout(tipTimeout);
  }

  function showTipsSequentially() {
    if (tipsVisible) { resetTips(); return; }
    placeTips();
    tipsVisible = true;
    if (btnTips) btnTips.textContent = '❌ Ocultar consejos';
    currentTipIndex = 0;

    const showNextTip = () => {
      if (currentTipIndex < tips.length) {
        const tip = tips[currentTipIndex];
        if (tip) {
          tip.style.display = 'block';
          tip.classList.add('tip-loading');
        }
        currentTipIndex++;
        tipTimeout = setTimeout(showNextTip, 800);
      }
    };
    showNextTip();
  }

  function closeModal() {
    if (!overlay) return;
    // Intenta animaciones nuevas y viejas; la que exista se aplicará
    overlay.style.animation = 'uncuyoUsbSim2025-fadeIn 0.3s ease-out reverse, uncuyo-simulation-fadeIn 0.3s ease-out reverse';
    setTimeout(() => {
      overlay.style.display = 'none';
      resetTips();
      // si tenés un fondo informativo, mostralo:
      const backInfo = get('uncuyoUsbSim2025_backInfo', 'alerta_backInfo');
      if (backInfo) backInfo.style.display = 'flex';
    }, 300);
  }

  // === Eventos ===
  btnTips  && btnTips.addEventListener('click', showTipsSequentially);
  btnClose && btnClose.addEventListener('click', closeModal);
  overlay  && overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  modal && modal.addEventListener('click', e => e.stopPropagation());
  window.addEventListener('resize', () => { if (tipsVisible) placeTips(); });

  console.log('✅ USB Sim inicializado', {
    overlay: !!overlay, modal: !!modal, btnTips: !!btnTips, btnClose: !!btnClose, tips: tips.length
  });
});
