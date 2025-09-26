document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('uncuyoUsb_overlay');
    const modal = document.getElementById('uncuyoUsb_modal');
    const btnTips = document.getElementById('uncuyoUsb_btnTips');
    const btnClose = document.getElementById('uncuyoUsb_btnClose');
    const tips = document.querySelectorAll('.uncuyoUsb_tip');
    
    let tipsVisible = false;
    let currentTipIndex = 0;
    let tipTimeout = null; // <- guardamos el temporizador para poder cancelarlo

    function closeModal() {
        overlay.style.animation = 'fadeIn 0.3s ease-out reverse';
        setTimeout(() => {
            overlay.style.display = 'none';
            resetTips();
        }, 300);
    }

    function resetTips(){
        // Oculta y resetea
        tips.forEach(tip => {
            tip.style.display = 'none';
            tip.classList.remove('tip-loading');
        });
        tipsVisible = false;
        currentTipIndex = 0;
        btnTips.innerHTML = '🎯 ¿Cuál fue mi error?';
        if(tipTimeout) clearTimeout(tipTimeout);
    }

    function showTipsSequentially() {
        if (tipsVisible) {
            // 🔹 Estaban visibles → ocultar y cancelar temporizadores
            resetTips();
            return;
        }

        // 🔹 Estaban ocultos → mostrar de a uno
        tipsVisible = true;
        btnTips.innerHTML = '❌ Ocultar consejos';
        currentTipIndex = 0;

        function showNextTip() {
            if (currentTipIndex < tips.length) {
                const tip = tips[currentTipIndex];
                tip.style.display = 'block';
                tip.classList.add('tip-loading');
                currentTipIndex++;
                tipTimeout = setTimeout(showNextTip, 800);
            }
        }

        showNextTip();
    }

    // Eventos
    btnTips.addEventListener('click', showTipsSequentially);
    btnClose.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    modal.addEventListener('click', e => e.stopPropagation());

    // Hover efecto info-card
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach(card => {
        card.addEventListener('mouseenter', () => { card.style.transform = 'translateY(-5px) scale(1.02)'; });
        card.addEventListener('mouseleave', () => { card.style.transform = 'translateY(0) scale(1)'; });
    });
});
