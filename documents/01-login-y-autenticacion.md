# Login y autenticación

## Resumen

Se consolidó el inicio de sesión de LideraBot para diferenciar correctamente estudiantes y docentes.

## Cambios implementados

- El frontend envía el rol seleccionado junto con el correo y la contraseña.
- El backend compara el rol solicitado con el rol almacenado en MongoDB.
- Un docente que intenta entrar por el login de estudiante recibe un mensaje indicando que debe usar el login docente, y viceversa.
- Las contraseñas se comparan con `bcrypt`.
- El backend genera un JWT después de autenticar correctamente.
- La sesión conserva nombre, correo y rol para mostrarlos en la interfaz.
- Las cuentas nuevas no pueden iniciar sesión hasta verificar su correo.
- El login distingue entre credenciales inválidas, rol incorrecto y correo pendiente de verificación.

## Rutas principales

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/verify-email`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

## Archivos relacionados

- `src/auth/auth.service.ts`
- `src/auth/auth.controller.ts`
- `src/auth/auth.module.ts`
- `frontend/src/app/components/LoginScreen.tsx`
- `frontend/src/app/App.tsx`

## Validación

El backend y el frontend compilan correctamente. La validación de roles se realiza en el backend para evitar que pueda omitirse desde el navegador.
