import { cookies } from "next/headers";
import { SESSION_COOKIE } from "./config";
import { findUserById } from "./db";
import { signToken, verifyToken } from "./jwt";

export async function createSession(userId: string) {
  const token = await signToken({ sub: userId, purpose: "session" });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifyToken(token, "session");
  if (!payload) return null;
  return (await findUserById(payload.sub)) ?? null;
}
