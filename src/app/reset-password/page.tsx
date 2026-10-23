"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { postJson } from "@/lib/api";
import { passwordError } from "@/lib/validation";
import Alert, { type AlertState } from "@/components/Alert";

function ResetPassword() {
  const token = useSearchParams().get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [alert, setAlert] = useState<AlertState>(
    token ? null : { type: "error", text: "Falta el token de recuperación en el enlace" }
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const pwError = passwordError(password);
    if (pwError) return setAlert({ type: "error", text: pwError });
    if (password !== confirm) return setAlert({ type: "error", text: "Las contraseñas no coinciden" });

    setLoading(true);
    setAlert(null);
    const res = await postJson("/api/auth/reset-password", { token, password });
    setLoading(false);
    setAlert({ type: res.ok ? "ok" : "error", text: (res.message ?? res.error)! });
    if (res.ok) setDone(true);
  }

  return (
    <div className="card">
      <h1>Nueva contraseña</h1>
      <p className="subtitle">Escribe tu nueva contraseña</p>
      <Alert alert={alert} />
      {!done && token && (
        <form onSubmit={handleSubmit}>
          <label>
            Nueva contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres, letras y números"
              required
            />
          </label>
          <label>
            Confirmar contraseña
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
          </label>
          <button className="btn" disabled={loading}>
            {loading ? "Guardando..." : "Cambiar contraseña"}
          </button>
        </form>
      )}
      <p className="footer">
        <Link href="/">Ir al login</Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  );
}
