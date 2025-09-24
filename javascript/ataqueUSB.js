        // Enhanced JavaScript functionality
        document.addEventListener('DOMContentLoaded', function() {
            const overlay = document.getElementById('uncuyoUsb_overlay');
            const modal = document.getElementById('uncuyoUsb_modal');
            const btnTips = document.getElementById('uncuyoUsb_btnTips');
            const btnClose = document.getElementById('uncuyoUsb_btnClose');
            const tips = document.querySelectorAll('.uncuyoUsb_tip');
            
            let tipsVisible = false;
            let currentTipIndex = 0;

            // Close modal function
            function closeModal() {
                overlay.style.animation = 'fadeIn 0.3s ease-out reverse';
                setTimeout(() => {
                    overlay.style.display = 'none';
                    // Reset tips
                    tips.forEach(tip => {
                        tip.style.display = 'none';
                        tip.classList.remove('tip-loading');
                    });
                    tipsVisible = false;
                    currentTipIndex = 0;
                }, 300);
            }

            // Show tips sequentially
            function showTipsSequentially() {
                if (tipsVisible) {
                    // Hide tips
                    tips.forEach(tip => {
                        tip.style.display = 'none';
                        tip.classList.remove('tip-loading');
                    });
                    tipsVisible = false;
                    currentTipIndex = 0;
                    btnTips.innerHTML = '🎯 ¿Cuál fue mi error?';
                    return;
                }

                // Show tips one by one
                tipsVisible = true;
                btnTips.innerHTML = '❌ Ocultar consejos';
                
                function showNextTip() {
                    if (currentTipIndex < tips.length) {
                        const tip = tips[currentTipIndex];
                        tip.style.display = 'block';
                        tip.classList.add('tip-loading');
                        currentTipIndex++;
                        
                        // Show next tip after delay
                        setTimeout(showNextTip, 800);
                    }
                }
                
                showNextTip();
            }

            // Event listeners
            btnTips.addEventListener('click', showTipsSequentially);
            btnClose.addEventListener('click', closeModal);
            
            // Close on ESC key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeModal();
                }
            });

            // Close on backdrop click
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    closeModal();
                }
            });

            // Prevent modal from closing when clicking inside
            modal.addEventListener('click', function(e) {
                e.stopPropagation();
            });

            // Add hover effects to info cards
            const infoCards = document.querySelectorAll('.info-card');
            infoCards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px) scale(1.02)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });

            // Auto-show tips after 3 seconds for demo purposes
            setTimeout(() => {
                if (!tipsVisible) {
                    showTipsSequentially();
                }
            }, 1000);
        });