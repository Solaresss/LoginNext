"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { postJson } from "@/lib/api";
import Alert, { type AlertState } from "@/components/Alert";

function Verify() {
  const token = useSearchParams().get("token") ?? "";
  const [alert, setAlert] = useState<AlertState>(null);
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    postJson("/api/auth/verify", { token }).then((res) =>
      setAlert({ type: res.ok ? "ok" : "error", text: (res.message ?? res.error)! })
    );
  }, [token]);

  return (
    <div className="card">
      <h1>Verificación de cuenta</h1>
      <p className="subtitle">Confirmando tu correo electrónico</p>
      {alert ? <Alert alert={alert} /> : <p>Verificando...</p>}
      <p className="footer">
        <Link href="/">Ir al login</Link>
      </p>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <Verify />
    </Suspense>
  );
}
