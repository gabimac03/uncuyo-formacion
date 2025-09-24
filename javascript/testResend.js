// testResend.js — prueba standalone para Resend
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const to = process.env.TEST_TO || process.argv[2] || 'tu_destino@ejemplo.com';

(async () => {
  try {
    console.log('[testResend] usando FROM=', process.env.RESET_FROM);
    console.log('[testResend] enviando a=', to);

    const resp = await resend.emails.send({
      from: process.env.RESET_FROM,
      to,
      subject: '🔧 Test Resend — prueba de envío',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h3>Prueba Resend</h3>
          <p>Este es un mensaje enviado desde el test de Resend.</p>
          <p>Si lo recibís, la integración funciona.</p>
        </div>
      `,
    });

    console.log('[testResend] Resend response:', JSON.stringify(resp, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('[testResend] Error enviando email:');
    console.error(err?.message || err);
    if (err?.response) {
      try { console.error('err.response.data:', JSON.stringify(err.response.data || err.response, null, 2)); }
      catch(e) { console.error('No pude parsear err.response'); }
    }
    process.exit(1);
  }
})();
