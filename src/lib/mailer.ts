import nodemailer, { type Transporter } from "nodemailer";
import { APP_URL, MAIL_RECIPIENT } from "./config";

let transporterPromise: Promise<Transporter> | null = null;

function getTransporter() {
  if (!transporterPromise) {
    transporterPromise = (async () => {
      if (process.env.SMTP_HOST) {
        return nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT ?? 587),
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });
      }
      const test = await nodemailer.createTestAccount();
      console.log("[mailer] Sin SMTP configurado: usando cuenta de prueba Ethereal");
      return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: { user: test.user, pass: test.pass },
      });
    })();
    transporterPromise.catch(() => (transporterPromise = null));
  }
  return transporterPromise;
}

async function sendMail(to: string, subject: string, html: string, link: string) {
  // En desarrollo siempre mostramos el enlace en consola, por si el correo falla
  if (process.env.NODE_ENV !== "production") console.log(`[mailer] Enlace (${subject}): ${link}`);

  const transporter = await getTransporter();
  const recipient = MAIL_RECIPIENT || to;
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || "Login Prueba <no-reply@login-prueba.local>",
    to: recipient,
    subject,
    html,
  });
  console.log(`[mailer] "${subject}" enviado a ${recipient}`);
  const preview = nodemailer.getTestMessageUrl(info);
  if (preview) console.log(`[mailer] Ver correo: ${preview}`);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

function layout(title: string, text: string, link: string, button: string) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
      <h2>${escapeHtml(title)}</h2>
      <p>${text}</p>
      <p><a href="${link}" style="display:inline-block;padding:10px 18px;background:#4f46e5;color:#fff;border-radius:6px;text-decoration:none">${button}</a></p>
      <p style="color:#666;font-size:12px">Si el botón no funciona copia este enlace:<br>${link}</p>
    </div>`;
}

export async function sendVerificationEmail(to: string, username: string, token: string) {
  const link = `${APP_URL}/verify?token=${encodeURIComponent(token)}`;
  await sendMail(
    to,
    "Confirma tu cuenta",
    layout(
      `Hola ${username}`,
      "Gracias por registrarte. Confirma tu correo para activar la cuenta. El enlace vence en 24 horas.",
      link,
      "Confirmar cuenta"
    ),
    link
  );
}

export async function sendPasswordResetEmail(to: string, username: string, token: string) {
  const link = `${APP_URL}/reset-password?token=${encodeURIComponent(token)}`;
  await sendMail(
    to,
    "Recupera tu contraseña",
    layout(
      `Hola ${username}`,
      "Recibimos una solicitud para restablecer tu contraseña. El enlace vence en 15 minutos y solo puede usarse una vez. Si no fuiste tú, ignora este correo.",
      link,
      "Restablecer contraseña"
    ),
    link
  );
}
