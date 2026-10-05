# Documentación: Integración de la Interfaz Figma al Proyecto LideraBot

## Descripción General

Este documento explica paso a paso cómo se integró la interfaz de usuario (diseñada en Figma y exportada como proyecto React/Vite) al backend NestJS del proyecto LideraBot.

---

## Estructura Final del Proyecto

```
DSE2-main/
├── src/                    ← Backend NestJS (API)
│   ├── auth/               ← Módulo de autenticación (registro/login)
│   ├── users/              ← Módulo de usuarios
│   ├── bots/
│   ├── conversations/
│   ├── messages/
│   └── ...
├── frontend/               ← Frontend React/Vite (Interfaz de Usuario)
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.tsx
│   │   │   └── components/
│   │   │       ├── ChatPanel.tsx
│   │   │       ├── LoginScreen.tsx
│   │   │       └── ui/             ← Componentes shadcn/Radix
│   └── package.json
├── .env
└── package.json
```

---

## Paso 1: Obtener el Archivo de la Interfaz

El diseño fue creado en **Figma** y exportado usando la herramienta **Figma Make**, que genera automáticamente un proyecto React/Vite listo para usar con:
- **React 18** como librería de UI
- **Vite** como servidor de desarrollo y empaquetador
- **Tailwind CSS** para los estilos
- **shadcn/ui (Radix UI)** como librería de componentes

El archivo exportado se entregó como un `.zip` llamado `User Interface.zip`.

---

## Paso 2: Descomprimir y Ubicar el Proyecto

Se descomprimió el archivo `.zip` en la raíz del proyecto y se renombró la carpeta para mayor claridad:

```powershell
# Descomprimir (se hizo automáticamente al subir el zip al workspace)
Expand-Archive -Path "User Interface.zip" -DestinationPath "ui_temp" -Force

# Renombrar a "frontend"
Rename-Item -Path "ui_temp" -NewName "frontend"
```

---

## Paso 3: Corregir los Imports del Frontend

Figma Make genera los archivos con versiones de paquete pegadas directamente en los imports, lo cual es inválido en Node.js. Por ejemplo:

```typescript
// ❌ Incorrecto (como lo exportó Figma)
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area@1.2.3";

// ✅ Correcto
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
```

Se ejecutó un script de Node.js para corregir automáticamente los 41 archivos afectados:

```javascript
// fix_imports.js
const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src').filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  const newContent = content.replace(/from\s+(['"])([^'"]+?)@[\d\.]+(['"])/g, 'from $1$2$3');
  if (content !== newContent) {
    fs.writeFileSync(f, newContent);
    console.log('Fixed', f);
  }
});
```

Ejecutado con:
```bash
node fix_imports.js
```

---

## Paso 4: Corregir el package.json del Frontend

El `package.json` exportado por Figma también tenía nombres de dependencias duplicados con un formato inválido:

```json
// ❌ Incorrecto
"@emotion/react@11.14.0": "npm:@emotion/react@11.14.0"
```

Se limpió automáticamente eliminando las claves duplicadas con formato inválido.

---

## Paso 5: Crear el tsconfig.json del Frontend

Figma Make no incluye un archivo `tsconfig.json`, lo cual causaba cientos de errores de TypeScript del tipo:
```
error TS17004: Cannot use JSX unless the '--jsx' flag is provided.
```

Se creó el archivo `frontend/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

---

## Paso 6: Instalar Dependencias del Frontend

```bash
cd frontend
npm install
```

---

## Paso 7: Habilitar CORS en el Backend

Para que el frontend (puerto `5173`) pueda comunicarse con el backend (puerto `4001`) sin errores de bloqueo del navegador, se habilitó CORS en `src/main.ts`:

```typescript
// src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // ← Se agregó esta línea
  // ...
}
```

---

## Paso 8: Conectar el Chat al Backend (Gemini/LideraBot)

Se modificó el componente `frontend/src/app/components/ChatPanel.tsx` para que, en lugar de simular respuestas con un `setTimeout`, haga una petición real al backend:

```typescript
// ❌ Antes: Respuesta simulada
setTimeout(() => {
  const botMessage = { content: 'Respuesta hardcodeada...' };
  setMessages(prev => [...prev, botMessage]);
  setIsTyping(false);
}, 1500);

// ✅ Después: Petición real al backend
const response = await fetch('http://localhost:4001/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: userMessage.content }),
});
const data = await response.json();
const botMessage = { content: data.reply };
setMessages(prev => [...prev, botMessage]);
```

---

## Paso 9: Conectar el Login al Backend (Autenticación JWT)

Se modificó `frontend/src/app/components/LoginScreen.tsx` para que el formulario haga peticiones reales al backend en vez de dar acceso directo:

```typescript
// ❌ Antes: Acceso inmediato sin validación
const handleSubmit = (e) => {
  onLogin(role, { name, email });
};

// ✅ Después: Petición real al backend
const handleSubmit = async (e) => {
  const endpoint = isLogin ? '/auth/login' : '/auth/register';
  const response = await fetch(`http://localhost:4001${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  localStorage.setItem('access_token', data.access_token);
  onLogin(data.user.role, { name: data.user.name, email: data.user.email });
};
```

También se eliminaron los campos innecesarios del registro: **Código estudiantil**, **Carrera**, **Institución** y **Asignatura**.

---

## Cómo Correr el Proyecto

Para ejecutar el proyecto completo se necesitan **dos terminales abiertas**:

### Terminal 1 — Backend (NestJS)
```bash
# En la carpeta raíz: DSE2-main/
npm run start:dev
# El servidor queda disponible en http://localhost:4001
```

### Terminal 2 — Frontend (React/Vite)
```bash
# Entrar a la carpeta del frontend
cd frontend
npm run dev
# La interfaz queda disponible en http://localhost:5173
```

---

## Tecnologías Utilizadas

| Parte | Tecnología |
|---|---|
| Backend | NestJS, MongoDB (Mongoose), JWT |
| Frontend | React 18, Vite, TypeScript |
| Estilos | Tailwind CSS |
| Componentes UI | shadcn/ui (Radix UI) |
| Autenticación | bcrypt + JSON Web Tokens |
| IA / Chatbot | Google Gemini API (`@google/genai`) |
