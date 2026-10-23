"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { postJson } from "@/lib/api";
import Alert, { type AlertState } from "./Alert";

export default function LoginForm({ onForgot }: { onForgot: () => void }) {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState>(null);
  const [unverified, setUnverified] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    const res = await postJson("/api/auth/login", { login, password });
    setLoading(false);
    setUnverified(!!res.unverified);
    if (!res.ok) return setAlert({ type: "error", text: res.error ?? "Error al iniciar sesión" });
    router.push("/dashboard");
    router.refresh();
  }

  async function resendVerification() {
    setLoading(true);
    const res = await postJson("/api/auth/resend-verification", { login });
    setLoading(false);
    setUnverified(false);
    setAlert({ type: res.ok ? "ok" : "error", text: (res.message ?? res.error)! });
  }

  return (
    <>
      <h1>Iniciar sesión</h1>
      <p className="subtitle">Ingresa con tu usuario y contraseña</p>
      <Alert alert={alert} />
      {unverified && (
        <p className="link-row" style={{ justifyContent: "flex-start", marginTop: -6 }}>
          <button className="link" onClick={resendVerification} disabled={loading}>
            Reenviar correo de confirmación
          </button>
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <label>
          Usuario o correo
          <input value={login} onChange={(e) => setLogin(e.target.value)} autoComplete="username" required />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <div className="link-row">
          <button type="button" className="link" onClick={onForgot}>
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        <button className="btn" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </>
  );
}
