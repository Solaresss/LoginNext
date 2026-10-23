export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const USERNAME_RE = /^[a-zA-Z0-9_.-]{3,30}$/;

export function passwordError(password: string): string | null {
  if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres";
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password))
    return "La contraseña debe incluir letras y números";
  return null;
}
