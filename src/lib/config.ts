/**
 * Configuración central de la app.
 *
 * MAIL_RECIPIENT: por ahora TODOS los correos (verificación de cuenta y
 * recuperación de contraseña) se envían a esta dirección fija.
 */
export const MAIL_RECIPIENT = "anasolares3711@gmail.com";

export const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

// Secreto para firmar los JWT (Esta es de desarrollo para pruebas)

export const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "1df379a2f4eb7a07c44301969ef8e9cb113a8aed2af15f8a2769a413994a6ad987e584040f5ad56391f33366c1d37be4"
);

// Tiempos de vida de cada tipo de token
export const TOKEN_TTL = {
  verifyEmail: "24h",
  resetPassword: "15m",
  session: "7d",
} as const;

export const SESSION_COOKIE = "session";
