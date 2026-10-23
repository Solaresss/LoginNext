"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

type View = "login" | "register" | "forgot";

export default function AuthCard() {
  const [view, setView] = useState<View>("login");

  return (
    <div className="card">
      <div className="tabs" role="tablist">
        <button
          role="tab"
          aria-selected={view !== "register"}
          className={`tab ${view !== "register" ? "active" : ""}`}
          onClick={() => setView("login")}
        >
          Login
        </button>
        <button
          role="tab"
          aria-selected={view === "register"}
          className={`tab ${view === "register" ? "active" : ""}`}
          onClick={() => setView("register")}
        >
          Registrar
        </button>
      </div>

      {view === "login" && <LoginForm onForgot={() => setView("forgot")} />}
      {view === "register" && <RegisterForm />}
      {view === "forgot" && <ForgotPasswordForm onBack={() => setView("login")} />}
    </div>
  );
}
