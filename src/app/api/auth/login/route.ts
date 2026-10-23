import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByLogin } from "@/lib/db";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
  const { login = "", password = "" } = await req.json().catch(() => ({}));

  const user = login ? await findUserByLogin(login) : undefined;
  if (!user || !(await bcrypt.compare(password, user.passwordHash)))
    return NextResponse.json({ error: "Usuario o contraseña incorrectos" }, { status: 401 });

  if (!user.verified)
    return NextResponse.json(
      { error: "Debes confirmar tu correo antes de iniciar sesión", unverified: true },
      { status: 403 }
    );

  await createSession(user.id);
  return NextResponse.json({ message: "Sesión iniciada" });
}
