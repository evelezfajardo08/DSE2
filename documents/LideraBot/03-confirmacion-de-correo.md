# Confirmación de correo electrónico

## Objetivo

Evitar que se creen cuentas con correos inexistentes o que el usuario no controle.

## Funcionamiento

1. El registro solo acepta direcciones que terminen en `@gmail.com`.
2. El backend genera un código numérico de seis dígitos.
3. El código se guarda como hash SHA-256.
4. La cuenta se crea con estado `pending` y `emailVerified: false`.
5. El código se envía mediante Gmail SMTP.
6. El usuario introduce el código recibido.
7. El backend valida el hash y la fecha de expiración.
8. La cuenta cambia a `active` y `emailVerified: true`.
9. Se genera la sesión automáticamente.

## Reenvío

Si el correo inicial no llega:

- El usuario puede pulsar **Reenviar código**.
- Se genera un código nuevo.
- El código anterior deja de ser válido.
- El nuevo código dura 15 minutos.
- Se aplica un límite de 60 segundos entre reenvíos.

## Campos almacenados

- `emailVerified`
- `emailVerificationCodeHash`
- `emailVerificationExpiresAt`
- `status`

## Archivos relacionados

- `src/auth/auth.service.ts`
- `src/auth/auth.controller.ts`
- `src/users/entities/schema.ts`
- `src/users/dto/create-user.dto.ts`
- `frontend/src/app/components/LoginScreen.tsx`
