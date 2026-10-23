"use client";

import { useRouter } from "next/navigation";
import { postJson } from "@/lib/api";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await postJson("/api/auth/logout", {});
    router.push("/");
    router.refresh();
  }

  return (
    <button className="btn" style={{ width: "100%" }} onClick={logout}>
      Cerrar sesión
    </button>
  );
}
