import { NextResponse } from "next/server";
import { findUserByLogin } from "@/lib/db";
import { signToken } from "@/lib/jwt";
import { sendVerificationEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  const { login = "" } = await req.json().catch(() => ({}));
  const user = login ? await findUserByLogin(login) : undefined;

  if (user && !user.verified) {
    const token = await signToken({ sub: user.id, purpose: "verifyEmail" });
    try {
      await sendVerificationEmail(user.email, user.username, token);
    } catch (err) {
      console.error("[resend-verification] Error enviando correo", err);
      return NextResponse.json({ error: "No se pudo enviar el correo, intenta más tarde" }, { status: 500 });
    }
  }

  // Respuesta genérica para no revelar qué cuentas existen
  return NextResponse.json({
    message: "Si la cuenta existe y no está verificada, te enviamos un nuevo correo de confirmación.",
  });
}
