"use client";

import { useState, type FormEvent } from "react";
import { postJson } from "@/lib/api";
import { passwordError } from "@/lib/validation";
import Alert, { type AlertState } from "./Alert";

const EMPTY = { username: "", email: "", password: "", confirm: "" };

export default function RegisterForm() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState>(null);

  const set = (field: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [field]: e.target.value });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const pwError = passwordError(form.password);
    if (pwError) return setAlert({ type: "error", text: pwError });
    if (form.password !== form.confirm)
      return setAlert({ type: "error", text: "Las contraseñas no coinciden" });

    setLoading(true);
    setAlert(null);
    const { confirm: _, ...body } = form;
    const res = await postJson("/api/auth/register", body);
    setLoading(false);
    if (!res.ok) return setAlert({ type: "error", text: res.error ?? "Error al registrar" });
    setForm(EMPTY);
    setAlert({ type: "ok", text: res.message! });
  }

  return (
    <>
      <h1>Crear cuenta</h1>
      <p className="subtitle">Te enviaremos un correo para confirmar tu cuenta</p>
      <Alert alert={alert} />
      <form onSubmit={handleSubmit}>
        <label>
          Usuario
          <input value={form.username} onChange={set("username")} autoComplete="username" required />
        </label>
        <label>
          Correo electrónico
          <input type="email" value={form.email} onChange={set("email")} autoComplete="email" required />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={form.password}
            onChange={set("password")}
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres, letras y números"
            required
          />
        </label>
        <label>
          Confirmar contraseña
          <input
            type="password"
            value={form.confirm}
            onChange={set("confirm")}
            autoComplete="new-password"
            required
          />
        </label>
        <button className="btn" disabled={loading}>
          {loading ? "Creando..." : "Registrarme"}
        </button>
      </form>
    </>
  );
}
