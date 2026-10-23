import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Login Prueba",
  description: "Login con registro, verificación por correo y recuperación de contraseña con JWT",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <main className="center">{children}</main>
      </body>
    </html>
  );
}
