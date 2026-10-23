import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createUser, findUserByLogin } from "@/lib/db";
import { signToken } from "@/lib/jwt";
import { sendVerificationEmail } from "@/lib/mailer";
import { EMAIL_RE, USERNAME_RE, passwordError } from "@/lib/validation";

export async function POST(req: Request) {
  const { username = "", email = "", password = "" } = await req.json().catch(() => ({}));

  if (!USERNAME_RE.test(username))
    return NextResponse.json(
      { error: "El usuario debe tener 3-30 caracteres (letras, números, _ . -)" },
      { status: 400 }
    );
  if (!EMAIL_RE.test(email))
    return NextResponse.json({ error: "Correo electrónico inválido" }, { status: 400 });
  const pwError = passwordError(password);
  if (pwError) return NextResponse.json({ error: pwError }, { status: 400 });

  if (await findUserByLogin(username))
    return NextResponse.json({ error: "El nombre de usuario ya está en uso" }, { status: 409 });
  if (await findUserByLogin(email))
    return NextResponse.json({ error: "El correo ya está registrado" }, { status: 409 });

  const user = await createUser({
    username,
    email,
    passwordHash: await bcrypt.hash(password, 10),
  });

  const token = await signToken({ sub: user.id, purpose: "verifyEmail" });
  try {
    await sendVerificationEmail(user.email, user.username, token);
  } catch (err) {
    console.error("[register] Error enviando correo de verificación", err);
    return NextResponse.json({
      message:
        "Usuario creado, pero no se pudo enviar el correo de verificación. Intenta reenviarlo desde el login.",
    });
  }

  return NextResponse.json({
    message: "Usuario creado. Revisa tu correo para confirmar la cuenta antes de iniciar sesión.",
  });
}
