    const $ = s => document.querySelector(s);

    async function loadCap() {
      try {
        const r = await fetch('/api/captcha');
        const d = await r.json();
        $('#capQ').textContent = d.question;
        $('#capId').value = d.captchaId;
      } catch {
        $('#capQ').textContent = 'No se pudo cargar el CAPTCHA';
      }
    }
    $('#capR').addEventListener('click', loadCap);
    window.addEventListener('DOMContentLoaded', loadCap);

    $('#fReg').addEventListener('submit', async (e) => {
      e.preventDefault();
      $('#msg').textContent = '';
      const dni = $('#dni').value.trim();
      const email = $('#email').value.trim();
      const pw = $('#pw').value;
      const captchaId = $('#capId').value;
      const captchaAnswer = $('#capA').value.trim();

      try {
        const r = await fetch('/api/register', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ dni, email, password: pw, captchaId, captchaAnswer })
        });
        const data = await r.json().catch(()=>({}));
        if (!r.ok || !data.ok) {
          $('#msg').style.color = '#ef4444';
          $('#msg').textContent = data.error || 'No se pudo registrar.';
          await loadCap(); // renovar CAPTCHA en error
          $('#capA').value = '';
          return;
        }
        $('#msg').style.color = '#22c55e';
        $('#msg').textContent = 'Registro creado. Redirigiendo al login…';
        setTimeout(() => location.href = '/login.html', 1000);
      } catch {
        $('#msg').textContent = 'Error de red.';
      }
    });
