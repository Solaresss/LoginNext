import { SignJWT, jwtVerify } from "jose";
import crypto from "crypto";
import { JWT_SECRET, TOKEN_TTL } from "./config";

type Purpose = keyof typeof TOKEN_TTL;

type Payload = {
  sub: string;
  purpose: Purpose;
  /** Huella del hash de la contraseña: invalida el token de recuperación una vez usado. */
  pwf?: string;
};

export async function signToken(payload: Payload) {
  return new SignJWT({ purpose: payload.purpose, pwf: payload.pwf })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL[payload.purpose])
    .sign(JWT_SECRET);
}

/** Devuelve el payload si el token es válido y es del tipo esperado; si no, null. */
export async function verifyToken(token: string, purpose: Purpose): Promise<Payload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, { algorithms: ["HS256"] });
    if (payload.purpose !== purpose || !payload.sub) return null;
    return { sub: payload.sub, purpose, pwf: payload.pwf as string | undefined };
  } catch {
    return null;
  }
}

export function passwordFingerprint(passwordHash: string) {
  return crypto.createHash("sha256").update(passwordHash).digest("hex").slice(0, 16);
}
