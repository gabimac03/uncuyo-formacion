const $ = s => document.querySelector(s);

async function cargarCaptcha() {
  $('#msg').textContent = '';
  try {
    const r = await fetch('/api/captcha');
    const data = await r.json();
    $('#captchaQuestion').textContent = data.question;
    $('#captchaId').value = data.captchaId;
  } catch {
    $('#captchaQuestion').textContent = 'No se pudo cargar el CAPTCHA';
  }
}

$('#refreshCaptcha')?.addEventListener('click', cargarCaptcha);

$('#loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  $('#msg').textContent = 'Verificando...';

  const payload = {
    username: $('#username').value.trim(),
    password: $('#password').value,
    captchaId: $('#captchaId').value,
    captchaAnswer: $('#captchaAnswer').value.trim()
  };

  try {
    const r = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok || !data.ok) {
      $('#msg').textContent = data.error || 'Error de autenticación';
      await cargarCaptcha();            // nuevo captcha al fallar
      $('#captchaAnswer').value = '';
      return;
    }
    // OK → ir al home (tu index.html protegido)
    location.href = '/';
  } catch {
    $('#msg').textContent = 'Error de red';
  }
});

window.addEventListener('DOMContentLoaded', cargarCaptcha);
