# Login Next

Login con Next.js (App Router + React + TypeScript):

- Pestañas **Login** / **Registrar** en la misma tarjeta.
- **Registro** con verificación por correo (token JWT, vence en 24 h). No se puede iniciar sesión sin verificar.
- **Recuperación de contraseña** por correo (token JWT, vence en 15 min y es de un solo uso).
- Sesión en cookie `httpOnly` con JWT (7 días) y página protegida `/dashboard`.

## Cómo correrlo

```bash
npm install
cp .env.example .env.local   # ya existe uno con un JWT_SECRET aleatorio
npm run dev
```

Abre http://localhost:3000

## Correos

- **Destinatario fijo:** `MAIL_RECIPIENT` en [src/lib/config.ts](src/lib/config.ts). Por ahora todos los correos se envían ahí.
  Colocar como `""` para enviarlos al correo con el que se registró cada usuario.
- **Sin SMTP configurado** se usa una cuenta de prueba de [Ethereal](https://ethereal.email): el correo no llega a un buzón real,
  pero en la consola del servidor aparece `[mailer] Ver correo: <url>` para verlo. En desarrollo por el momento también se imprime el enlace directo.
- **Con SMTP real** (por ejemplo Gmail con una *contraseña de aplicación*), llena `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`,
  `SMTP_PASS` y `SMTP_FROM` en `.env.local`.

## Estructura

| Ruta | Descripción |
| --- | --- |
| `src/app/page.tsx` | Tarjeta con pestañas Login / Registrar / Recuperar |
| `src/app/verify` | Página que confirma la cuenta con el token del correo |
| `src/app/reset-password` | Página para definir la nueva contraseña |
| `src/app/dashboard` | Página protegida |
| `src/app/api/auth/*` | `register`, `verify`, `resend-verification`, `login`, `logout`, `forgot-password`, `reset-password` |
| `src/lib/` | Configuración, JWT (`jose`), correo (`nodemailer`), sesión y almacenamiento |

Los usuarios se guardan en `data/users.json` (contraseñas con bcrypt). Esto es temporal
