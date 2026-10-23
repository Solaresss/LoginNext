import { NextResponse } from "next/server";
import { findUserById, updateUser } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: Request) {
  const { token = "" } = await req.json().catch(() => ({}));

  const payload = await verifyToken(token, "verifyEmail");
  if (!payload)
    return NextResponse.json({ error: "El enlace de verificación es inválido o expiró" }, { status: 400 });

  const user = await findUserById(payload.sub);
  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  if (user.verified) return NextResponse.json({ message: "Tu cuenta ya estaba verificada" });

  await updateUser(user.id, { verified: true });
  return NextResponse.json({ message: "¡Cuenta verificada! Ya puedes iniciar sesión." });
}
