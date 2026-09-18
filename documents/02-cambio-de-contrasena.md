# Cambio y recuperación de contraseña

## Cambio desde configuración

La pantalla de configuración permite cambiar la contraseña de una cuenta autenticada.

El flujo:

1. El usuario introduce su contraseña actual.
2. Introduce la nueva contraseña dos veces.
3. El backend verifica la contraseña actual con `bcrypt`.
4. Se valida que la nueva contraseña tenga mínimo seis caracteres.
5. Se verifica que ambas contraseñas nuevas coincidan.
6. La nueva contraseña se cifra y se guarda en MongoDB.

Ruta utilizada:

- `POST /auth/change-password`

## Recuperación de contraseña

- El usuario solicita un código usando su correo Gmail.
- El código se envía mediante Gmail SMTP.
- El código expira después de 15 minutos.
- Existe un límite de 60 segundos para solicitar otro código.
- El código no se muestra en la interfaz ni en la consola.
- Si el primer mensaje no llega, el botón **Reenviar código** genera uno nuevo.
- La respuesta del backend es genérica para no revelar si un correo está registrado.

Rutas utilizadas:

- `POST /auth/forgot-password`
- `POST /auth/reset-password`

## Archivos relacionados

- `src/auth/auth.service.ts`
- `src/auth/auth.controller.ts`
- `frontend/src/app/components/LoginScreen.tsx`
- `frontend/src/app/App.tsx`

## Notas de seguridad

Las credenciales SMTP deben mantenerse únicamente en `.env`. La contraseña de aplicación de Gmail no debe publicarse ni incluirse en documentación.
