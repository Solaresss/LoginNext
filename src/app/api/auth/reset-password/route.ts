import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserById, updateUser } from "@/lib/db";
import { passwordFingerprint, verifyToken } from "@/lib/jwt";
import { passwordError } from "@/lib/validation";

export async function POST(req: Request) {
  const { token = "", password = "" } = await req.json().catch(() => ({}));

  const payload = await verifyToken(token, "resetPassword");
  const user = payload ? await findUserById(payload.sub) : undefined;

  // Si la contraseña ya cambió, la huella no coincide: el token ya se usó
  if (!payload || !user || payload.pwf !== passwordFingerprint(user.passwordHash))
    return NextResponse.json(
      { error: "El enlace de recuperación es inválido, expiró o ya fue utilizado" },
      { status: 400 }
    );

  const pwError = passwordError(password);
  if (pwError) return NextResponse.json({ error: pwError }, { status: 400 });

  // Restablecer por correo también demuestra que el correo es suyo
  await updateUser(user.id, { passwordHash: await bcrypt.hash(password, 10), verified: true });
  return NextResponse.json({ message: "Contraseña actualizada. Ya puedes iniciar sesión." });
}
