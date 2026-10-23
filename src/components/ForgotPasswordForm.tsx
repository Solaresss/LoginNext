"use client";

import { useState, type FormEvent } from "react";
import { postJson } from "@/lib/api";
import Alert, { type AlertState } from "./Alert";

export default function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [login, setLogin] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    const res = await postJson("/api/auth/forgot-password", { login });
    setLoading(false);
    setAlert({ type: res.ok ? "ok" : "error", text: (res.message ?? res.error)! });
  }

  return (
    <>
      <h1>Recuperar contraseña</h1>
      <p className="subtitle">Te enviaremos un enlace por correo para crear una nueva contraseña</p>
      <Alert alert={alert} />
      <form onSubmit={handleSubmit}>
        <label>
          Usuario o correo
          <input value={login} onChange={(e) => setLogin(e.target.value)} autoComplete="username" required />
        </label>
        <button className="btn" disabled={loading}>
          {loading ? "Enviando..." : "Enviar enlace"}
        </button>
      </form>
      <p className="footer">
        <button className="link" onClick={onBack}>
          Volver al login
        </button>
      </p>
    </>
  );
}
