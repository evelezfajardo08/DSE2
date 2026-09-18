# Integración funcional del login con MongoDB Atlas

Este documento describe cómo funciona y cómo poner en marcha la autenticación de LideraBot usando:

- Frontend React/Vite.
- Backend NestJS.
- MongoDB Atlas mediante Mongoose.
- Contraseñas cifradas con `bcrypt`.
- Sesiones autenticadas mediante tokens JWT.

## 1. Arquitectura del flujo

El flujo de autenticación es:

1. El frontend envía los datos a `http://localhost:4001/auth/register` o `http://localhost:4001/auth/login`.
2. `AuthController` recibe la solicitud.
3. `AuthService` busca o crea el usuario mediante `UsersService`.
4. `UsersService` utiliza el modelo Mongoose `User`.
5. Mongoose guarda o consulta los documentos en la colección de usuarios de MongoDB Atlas.
6. En un registro exitoso o login válido, el backend firma un JWT.
7. El frontend guarda el `access_token` en `localStorage` y continúa con la sesión.

Archivos principales:

- `src/app.module.ts`: carga la configuración y abre la conexión con Atlas.
- `src/users/entities/schema.ts`: define el esquema MongoDB de `User`.
- `src/users/users.service.ts`: ejecuta las operaciones de usuarios.
- `src/auth/auth.service.ts`: registra, autentica y firma el JWT.
- `src/auth/auth.controller.ts`: publica las rutas de autenticación.
- `frontend/src/app/components/LoginScreen.tsx`: formulario de registro y login.

## 2. Requisitos previos

- Node.js instalado.
- Dependencias instaladas con `npm install` en la raíz y en `frontend`.
- Una cuenta de MongoDB Atlas.
- Un cluster activo en Atlas.
- Un usuario de base de datos de Atlas.
- La dirección IP del equipo agregada en **Network Access** de Atlas.

## 3. Configurar MongoDB Atlas

### 3.1 Crear o seleccionar el cluster

En MongoDB Atlas:

1. Abre el proyecto que contiene el cluster.
2. Entra a **Database**.
3. Confirma que el cluster esté activo.

### 3.2 Crear el usuario de base de datos

En **Database Access**:

1. Selecciona **Add New Database User**.
2. Crea un usuario exclusivo para la aplicación.
3. Asigna permisos mínimos para la base de datos que utilizará la aplicación.
4. Guarda el usuario y la contraseña en un gestor seguro.

La contraseña debe estar URL-encoded si contiene caracteres especiales. Por ejemplo, `@` debe convertirse en `%40`.

### 3.3 Permitir la IP del equipo

En **Network Access**:

1. Selecciona **Add IP Address**.
2. Agrega la IP pública actual del equipo.
3. Si la IP cambia, actualiza esta regla.

Para una prueba temporal se puede usar `0.0.0.0/0`, pero no debe mantenerse en producción porque permite intentos de conexión desde cualquier IP. Es preferible agregar únicamente las IP necesarias.

### 3.4 Obtener la URI de conexión

En el cluster:

1. Selecciona **Connect**.
2. Selecciona **Drivers**.
3. Copia la URI `mongodb+srv://`.
4. Añade el nombre de la base de datos, por ejemplo `liderabot`.

La URI debe comenzar exactamente por `mongodb://` o `mongodb+srv://`. No debe contener comillas, espacios, texto de ejemplo ni caracteres ocultos.

Ejemplo de formato, usando valores ficticios:

```env
MONGODB_URI=mongodb+srv://USUARIO:CONTRASENA@cluster0.example.mongodb.net/liderabot?retryWrites=true&w=majority&appName=Cluster0
```

No copies credenciales reales a esta documentación, al frontend, a GitHub ni al chat.

## 4. Configurar el archivo `.env`

Crea o actualiza `.env` en la raíz del backend:

```env
PORT=4001
MONGODB_URI=mongodb+srv://USUARIO:CONTRASENA@cluster0.example.mongodb.net/liderabot?retryWrites=true&w=majority&appName=Cluster0
```

La aplicación carga las variables con `ConfigModule.forRoot({ isGlobal: true })` y obtiene `MONGODB_URI` desde `ConfigService` en `src/app.module.ts`.

### Variables opcionales de correo

El flujo de recuperación de contraseña usa variables SMTP adicionales. No son necesarias para registrar o iniciar sesión:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=correo-remitente@example.com
SMTP_PASS=CONTRASENA_DE_APLICACION
SMTP_FROM=correo-remitente@example.com
FRONTEND_URL=http://localhost:5175
```

Nunca subas `.env` al repositorio. Si una contraseña o API key fue compartida públicamente, revócala y genera una nueva.

## 5. Instalar y ejecutar

Desde la raíz del proyecto:

```powershell
npm install
npm run build
npm run start
```

El backend queda disponible en:

```text
http://localhost:4001
```

Para iniciar el frontend:

```powershell
cd frontend
npm install
npm run dev
```

Vite puede escoger otro puerto si el configurado ya está ocupado. Usa la URL que muestre la terminal, por ejemplo `http://localhost:5175`.

La conexión exitosa con Atlas aparece en los logs de NestJS como la inicialización de `MongooseCoreModule`. Si Atlas no es accesible, NestJS reintentará y mostrará errores como:

- `Invalid scheme`: la URI no empieza con `mongodb://` o `mongodb+srv://`.
- `querySrv ECONNREFUSED`: la red, DNS o Atlas impiden resolver la URI SRV.
- `Authentication failed`: el usuario o la contraseña de Atlas son incorrectos.
- `IP not allowed`: la IP del equipo no está permitida en **Network Access**.

## 6. Registrar un usuario

El frontend envía:

```http
POST http://localhost:4001/auth/register
Content-Type: application/json
```

```json
{
  "name": "María González",
  "email": "maria@example.com",
  "password": "ClaveSegura123",
  "role": "student"
}
```

Roles utilizados por la aplicación:

- `student`: estudiante.
- `teacher`: docente.

El backend:

1. Busca si ya existe un usuario con ese correo.
2. Rechaza duplicados con `409 Conflict`.
3. Cifra la contraseña con `bcrypt`.
4. Genera un identificador numérico.
5. Guarda el documento en MongoDB Atlas.
6. Devuelve un JWT y los datos públicos del usuario.

La contraseña nunca debe guardarse en texto plano ni devolverse en una respuesta.

Respuesta esperada:

```json
{
  "access_token": "JWT_GENERADO_POR_EL_BACKEND",
  "user": {
    "name": "María González",
    "email": "maria@example.com",
    "role": "student"
  }
}
```

## 7. Iniciar sesión

El frontend envía el rol seleccionado junto con el correo y la contraseña:

```http
POST http://localhost:4001/auth/login
Content-Type: application/json
```

```json
{
  "email": "maria@example.com",
  "password": "ClaveSegura123",
  "role": "student"
}
```

El backend:

1. Busca el usuario por correo.
2. Comprueba que el rol solicitado coincida con el rol almacenado.
3. Compara la contraseña con el hash mediante `bcrypt.compare`.
4. Firma un JWT con el identificador, correo, rol y nombre.

Si el usuario intenta entrar por el login equivocado, la API devuelve un error indicando que debe usar el login de estudiante o docente correspondiente.

El frontend guarda el token así:

```ts
localStorage.setItem('access_token', data.access_token);
```

## 8. Estructura del documento en MongoDB

El esquema definido en `src/users/entities/schema.ts` contiene:

```json
{
  "id": 123456,
  "name": "María González",
  "email": "maria@example.com",
  "password": "HASH_BCRYPT",
  "role": "student",
  "registered_at": "2026-01-01T00:00:00.000Z",
  "status": "active"
}
```

Los campos `id` y `email` tienen índices únicos declarados en el esquema. Atlas puede mostrar la colección después del primer registro; la base de datos y la colección se crean cuando Mongoose guarda el primer documento.

## 9. Verificar que el usuario se guardó

En MongoDB Atlas:

1. Abre **Database**.
2. Selecciona **Browse Collections**.
3. Abre la base `liderabot`.
4. Busca la colección de usuarios, normalmente `users`.
5. Confirma que el documento contiene el correo, rol y hash de contraseña.

No edites manualmente el hash para cambiar contraseñas. Usa el endpoint de recuperación o una operación controlada del backend.

## 10. Probar con PowerShell

Registro:

```powershell
$body = @{
  name = 'Usuario Prueba'
  email = 'prueba@example.com'
  password = 'ClaveSegura123'
  role = 'student'
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri 'http://localhost:4001/auth/register' `
  -Method Post `
  -ContentType 'application/json' `
  -Body $body
```

Login:

```powershell
$body = @{
  email = 'prueba@example.com'
  password = 'ClaveSegura123'
  role = 'student'
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri 'http://localhost:4001/auth/login' `
  -Method Post `
  -ContentType 'application/json' `
  -Body $body
```

## 11. Diagnóstico rápido

### El backend no inicia

- Comprueba que `MONGODB_URI` tenga el prefijo correcto.
- Comprueba que el cluster esté activo.
- Agrega la IP pública actual en Atlas.
- Verifica usuario, contraseña y permisos de Database Access.
- Prueba desde otra red si DNS o Atlas aparecen como `ECONNREFUSED`.

### El registro devuelve correo duplicado

El correo ya existe. Usa otro correo o inicia sesión con el usuario existente.

### El login devuelve credenciales inválidas

Comprueba el correo y la contraseña. La contraseña debe ser la misma usada durante el registro.

### El login indica rol incorrecto

Selecciona el acceso correcto:

- un usuario `student` debe entrar por el acceso de estudiante;
- un usuario `teacher` debe entrar por el acceso de docente.

### El frontend no conecta con el backend

- Confirma que NestJS esté ejecutándose en el puerto `4001`.
- Confirma que el frontend use `http://localhost:4001`.
- Revisa CORS en `src/main.ts`.
- Usa la URL exacta que Vite muestre en la terminal.

## 12. Recomendaciones antes de producción

La implementación actual es funcional para desarrollo, pero antes de publicar se recomienda:

- mover el secreto JWT de `src/auth/auth.module.ts` a una variable `JWT_SECRET`;
- validar DTOs con `class-validator` y activar `ValidationPipe`;
- aplicar límites de intentos al login;
- usar HTTPS;
- guardar el token en una estrategia segura de sesión o cookie `HttpOnly`;
- almacenar los códigos de recuperación con expiración en una base de datos o Redis;
- no imprimir códigos de recuperación en logs de producción;
- restringir CORS al dominio real del frontend;
- rotar cualquier credencial que haya sido expuesta.

