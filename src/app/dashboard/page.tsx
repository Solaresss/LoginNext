import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import LogoutButton from "@/components/LogoutButton";

export default async function Dashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  return (
    <div className="card">
      <h1>¡Bienvenido, {user.username}!</h1>
      <p className="subtitle">Iniciaste sesión correctamente</p>
      <p>
        <strong>Correo:</strong> {user.email}
      </p>
      <p>
        <strong>Cuenta creada:</strong> {new Date(user.createdAt).toLocaleString("es-MX")}
      </p>
      <LogoutButton />
    </div>
  );
}
