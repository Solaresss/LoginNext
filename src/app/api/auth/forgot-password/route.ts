import { NextResponse } from "next/server";
import { findUserByLogin } from "@/lib/db";
import { passwordFingerprint, signToken } from "@/lib/jwt";
import { sendPasswordResetEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  const { login = "" } = await req.json().catch(() => ({}));
  const user = login ? await findUserByLogin(login) : undefined;

  if (user) {
    const token = await signToken({
      sub: user.id,
      purpose: "resetPassword",
      pwf: passwordFingerprint(user.passwordHash),
    });
    try {
      await sendPasswordResetEmail(user.email, user.username, token);
    } catch (err) {
      console.error("[forgot-password] Error enviando correo", err);
      return NextResponse.json({ error: "No se pudo enviar el correo, intenta más tarde" }, { status: 500 });
    }
  }

  // Respuesta genérica para no revelar qué cuentas existen
  return NextResponse.json({
    message: "Si la cuenta existe, te enviamos un correo con el enlace para restablecer tu contraseña.",
  });
}
