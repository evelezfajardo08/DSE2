# LideraBot — Documento base para el desarrollo del prototipo

## 1. Propósito del documento

Este documento establece una guía inicial de trabajo para el equipo de desarrollo de **LideraBot**. Su objetivo es servir como punto de partida para organizar la implementación del prototipo, definir sus componentes principales y establecer una ruta de desarrollo compartida.

> **Nota:** Esta versión funciona como documento técnico inicial. Los detalles que no estén definidos en el proyecto deberán acordarse entre los integrantes antes de convertirlos en requisitos definitivos.

---

## 2. Descripción general

**LideraBot** es un proyecto de software educativo orientado al fortalecimiento de habilidades relacionadas con el liderazgo en estudiantes universitarios.

El prototipo busca integrar:

- Interacción conversacional mediante un chatbot.
- Actividades orientadas al desarrollo de habilidades de liderazgo.
- Seguimiento del progreso del estudiante.
- Retroalimentación personalizada.
- Recomendaciones adaptativas.
- Persistencia de la información mediante una base de datos.

---

## 3. Objetivo del prototipo

Construir una primera versión funcional que permita validar el flujo principal de LideraBot:

```text
Usuario
   ↓
Interfaz de LideraBot
   ↓
Chat / Actividad
   ↓
Procesamiento de la interacción
   ↓
IA + lógica de recomendaciones
   ↓
Retroalimentación
   ↓
Registro del progreso
   ↓
Dashboard del estudiante
```

El prototipo debe priorizar la **funcionalidad del flujo principal** antes que características avanzadas.

---

# 4. Alcance inicial

## 4.1. Funcionalidades prioritarias

### A. Gestión básica del usuario

El sistema debe permitir:

- Identificar al estudiante.
- Registrar información básica.
- Asociar las interacciones y actividades al usuario.
- Consultar su progreso.

### B. Chatbot

El estudiante podrá:

- Escribir mensajes.
- Recibir respuestas de LideraBot.
- Interactuar con actividades propuestas por el asistente.
- Recibir retroalimentación.

### C. Actividades

El sistema podrá presentar situaciones o ejercicios relacionados con:

- Liderazgo.
- Comunicación.
- Toma de decisiones.
- Trabajo en equipo.
- Resolución de situaciones.

### D. Evaluación

Cada actividad podrá producir una valoración o resultado que permita actualizar el progreso del estudiante.

### E. Recomendaciones

El sistema podrá recomendar actividades con base en los resultados obtenidos.

### F. Dashboard

El estudiante podrá consultar información básica sobre:

- Progreso general.
- Habilidades trabajadas.
- Actividades realizadas.
- Resultados.
- Recomendaciones.

---

# 5. Arquitectura propuesta

Para el prototipo se propone separar el sistema en tres capas principales:

```text
┌───────────────────────────────────────┐
│               FRONTEND                │
│                                       │
│  Chat │ Actividades │ Dashboard       │
└───────────────────┬───────────────────┘
                    │ HTTP / API
                    ▼
┌───────────────────────────────────────┐
│               BACKEND                 │
│                                       │
│ Usuarios │ Chat │ Actividades         │
│ Progreso │ Recomendaciones            │
└───────────────┬───────────────┬───────┘
                │               │
                ▼               ▼
       ┌──────────────┐  ┌──────────────┐
       │ Base de datos│  │ Motor de IA  │
       └──────────────┘  └──────────────┘
```

## 5.1. Frontend

Responsable de la experiencia del estudiante.

Componentes iniciales:

- Pantalla principal.
- Chat.
- Tarjetas de actividades.
- Vista de resultados.
- Dashboard.
- Indicadores de progreso.

## 5.2. Backend

Responsable de:

- Recibir solicitudes.
- Gestionar usuarios.
- Gestionar actividades.
- Procesar conversaciones.
- Comunicarse con el servicio de IA.
- Guardar resultados.
- Calcular o consultar progreso.
- Generar recomendaciones.

## 5.3. Motor de IA

Responsable de procesar las conversaciones y generar respuestas de acuerdo con las reglas definidas para LideraBot.

La integración concreta del proveedor/modelo de IA debe definirse durante la implementación.

## 5.4. Base de datos

Responsable de almacenar:

- Usuarios.
- Actividades.
- Interacciones.
- Resultados.
- Progreso.
- Recomendaciones.

---

# 6. Stack tecnológico sugerido

La siguiente selección es una propuesta para iniciar el prototipo y puede modificarse según los acuerdos del equipo.

### Frontend

- React
- Next.js o Vite
- Tailwind CSS

### Backend

Una de las siguientes alternativas:

- Node.js + Express
- Python + FastAPI

### Base de datos

- PostgreSQL

### IA

- API de un modelo de lenguaje compatible con el backend.

### Control de versiones

- Git
- GitHub

### Despliegue

Para el prototipo puede utilizarse una plataforma de despliegue compatible con el stack seleccionado.

---

# 7. Estructura inicial del repositorio

Se propone comenzar con una estructura separada para frontend, backend y base de datos:

```text
liderabot/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat/
│   │   │   ├── Dashboard/
│   │   │   ├── Activities/
│   │   │   └── Common/
│   │   │
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── utils/
│   │
│   └── package.json
│
├── database/
│   ├── schema/
│   ├── seeds/
│   └── README.md
│
├── docs/
│   ├── arquitectura.md
│   ├── api.md
│   └── decisiones-tecnicas.md
│
├── .env.example
├── .gitignore
└── README.md
```

---

# 8. Módulos del sistema

## 8.1. Módulo de usuarios

Responsabilidades:

- Registro.
- Identificación.
- Consulta de información.
- Asociación de datos con el estudiante.

Entidad inicial:

```text
User
- id
- name
- email
- created_at
- updated_at
```

> Los campos definitivos deben establecerse cuando se defina el modelo de datos final.

---

## 8.2. Módulo conversacional

Flujo básico:

```text
Usuario escribe mensaje
        ↓
Frontend envía mensaje al backend
        ↓
Backend procesa la solicitud
        ↓
Backend consulta el motor de IA
        ↓
IA genera respuesta
        ↓
Backend devuelve respuesta
        ↓
Frontend muestra respuesta
        ↓
Interacción registrada
```

### Endpoint inicial propuesto

```http
POST /api/chat
```

Solicitud:

```json
{
  "userId": "ID_USUARIO",
  "message": "Necesito practicar liderazgo"
}
```

Respuesta conceptual:

```json
{
  "message": "Claro. Podemos comenzar con una situación de liderazgo.",
  "type": "text"
}
```

La estructura definitiva deberá documentarse cuando se implemente la API.

---

# 9. Módulo de actividades

Una actividad puede contener:

```text
Activity
- id
- title
- description
- type
- difficulty
- questions
```

Tipos posibles:

```text
leadership
communication
decision_making
teamwork
conflict_resolution
```

## Flujo

```text
LideraBot recomienda actividad
        ↓
Usuario inicia actividad
        ↓
Usuario responde
        ↓
Sistema evalúa respuesta
        ↓
Se genera retroalimentación
        ↓
Se registra resultado
        ↓
Se actualiza progreso
```

---

# 10. Evaluación y progreso

El prototipo debe mantener una relación entre las actividades realizadas y el progreso del estudiante.

Modelo conceptual:

```text
Usuario
   │
   ├── Actividad 1 → resultado
   ├── Actividad 2 → resultado
   ├── Actividad 3 → resultado
   │
   └── Progreso acumulado
```

Áreas iniciales de seguimiento:

- Liderazgo.
- Comunicación.
- Toma de decisiones.

Estas categorías pueden ampliarse si el proyecto las incorpora formalmente.

---

# 11. Sistema de recomendaciones

El sistema de recomendaciones debe utilizar los resultados disponibles para orientar al estudiante hacia actividades relevantes.

Ejemplo conceptual:

```text
SI resultado en comunicación es bajo
ENTONCES recomendar actividad de comunicación.

SI resultado en toma de decisiones es bajo
ENTONCES recomendar actividad de toma de decisiones.

SI resultado general mejora
ENTONCES aumentar progresivamente la dificultad.
```

Para el primer prototipo se recomienda comenzar con **reglas simples y explícitas** antes de implementar un sistema de recomendación complejo.

---

# 12. Dashboard

El dashboard debe presentar de forma sencilla el estado del estudiante.

Elementos iniciales:

```text
┌─────────────────────────────────────┐
│          PROGRESO GENERAL            │
│                XX %                  │
└─────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┐
│ Liderazgo    │ Comunicación │ Decisiones   │
│    XX %      │     XX %     │     XX %     │
└──────────────┴──────────────┴──────────────┘

Actividades completadas: XX

Últimas actividades
- Actividad 1
- Actividad 2
- Actividad 3

Recomendación:
"Practica una actividad de toma de decisiones."
```

---

# 13. Modelo de datos conceptual

```text
USERS
  │
  ├───────────────┐
  │               │
  ▼               ▼
ACTIVITY_RESULTS  CHAT_MESSAGES
  │
  ▼
ACTIVITIES
  │
  ▼
PROGRESS
```

## Entidades principales

### Users

```text
id
name
email
created_at
updated_at
```

### Activities

```text
id
title
description
type
difficulty
created_at
```

### Activity Results

```text
id
user_id
activity_id
score
feedback
completed_at
```

### Chat Messages

```text
id
user_id
role
message
created_at
```

### Progress

```text
id
user_id
leadership_score
communication_score
decision_making_score
updated_at
```

> Este modelo es conceptual y debe validarse antes de crear la base de datos definitiva.

---

# 14. API inicial

## Usuarios

```http
POST /api/users
GET /api/users/:id
```

## Chat

```http
POST /api/chat
GET /api/chat/:userId
```

## Actividades

```http
GET /api/activities
GET /api/activities/:id
POST /api/activities/:id/submit
```

## Progreso

```http
GET /api/progress/:userId
```

## Recomendaciones

```http
GET /api/recommendations/:userId
```

Los endpoints son una propuesta inicial y deberán ajustarse al diseño definitivo del backend.

---

# 15. Variables de entorno

Nunca subir claves privadas al repositorio.

Crear:

```text
.env
```

y utilizar:

```text
.env.example
```

Ejemplo conceptual:

```env
PORT=
DATABASE_URL=
AI_API_KEY=
```

El archivo `.env` debe estar incluido en `.gitignore`.

---

# 16. Reglas básicas para la IA

LideraBot debe mantener una personalidad coherente con su propósito educativo.

La lógica del asistente debe priorizar:

1. Orientar al estudiante.
2. Promover reflexión.
3. Proporcionar retroalimentación.
4. Motivar la participación.
5. Evitar respuestas que sustituyan completamente el proceso de aprendizaje.
6. Mantener las actividades relacionadas con las competencias definidas por el proyecto.

El prompt definitivo del sistema debe almacenarse y versionarse dentro de la documentación del proyecto, evitando colocar claves o información sensible.

---

# 17. Flujo principal del prototipo

```text
                  ┌───────────────┐
                  │    Usuario    │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │   Frontend    │
                  └───────┬───────┘
                          │
                 ┌────────┴────────┐
                 │                 │
                 ▼                 ▼
             Chatbot          Actividades
                 │                 │
                 └────────┬────────┘
                          ▼
                  ┌───────────────┐
                  │    Backend    │
                  └───────┬───────┘
                          │
                ┌─────────┴─────────┐
                ▼                   ▼
          ┌───────────┐       ┌───────────┐
          │ Motor IA  │       │ Base datos│
          └───────────┘       └─────┬─────┘
                                    │
                                    ▼
                              ┌───────────┐
                              │ Progreso  │
                              └─────┬─────┘
                                    │
                                    ▼
                              ┌───────────┐
                              │Dashboard  │
                              └───────────┘
```

---

# 18. Plan de desarrollo

## Sprint 0 — Preparación

- [ ] Crear repositorio.
- [ ] Definir responsables.
- [ ] Elegir stack definitivo.
- [ ] Configurar ramas.
- [ ] Crear estructura inicial.
- [ ] Crear `.env.example`.
- [ ] Documentar decisiones técnicas.

## Sprint 1 — Base del sistema

- [ ] Crear frontend.
- [ ] Crear backend.
- [ ] Configurar comunicación frontend/backend.
- [ ] Configurar base de datos.
- [ ] Crear modelo de usuario.

## Sprint 2 — Chat

- [ ] Crear interfaz del chat.
- [ ] Crear endpoint `/api/chat`.
- [ ] Integrar motor de IA.
- [ ] Mostrar respuestas.
- [ ] Registrar conversaciones.

## Sprint 3 — Actividades

- [ ] Crear modelo de actividades.
- [ ] Crear listado de actividades.
- [ ] Crear vista de actividad.
- [ ] Registrar respuestas.
- [ ] Calcular resultado.

## Sprint 4 — Progreso

- [ ] Crear modelo de progreso.
- [ ] Actualizar progreso después de cada actividad.
- [ ] Crear endpoint de progreso.
- [ ] Crear dashboard inicial.

## Sprint 5 — Recomendaciones

- [ ] Crear reglas de recomendación.
- [ ] Generar recomendaciones.
- [ ] Mostrar recomendaciones en el dashboard/chat.
- [ ] Validar comportamiento.

## Sprint 6 — Integración y pruebas

- [ ] Probar flujo completo.
- [ ] Corregir errores.
- [ ] Mejorar interfaz.
- [ ] Validar experiencia de usuario.
- [ ] Preparar demostración del prototipo.

---

# 19. Organización del equipo

Cada integrante debe tener responsabilidades claramente definidas.

Ejemplo:

| Área | Responsabilidades |
|---|---|
| Frontend | Interfaz, chat, actividades, dashboard |
| Backend | API, lógica del sistema, integración |
| Base de datos | Modelo, consultas, persistencia |
| IA | Prompts, comportamiento conversacional, evaluación |
| UX/UI | Diseño visual y experiencia |
| QA | Pruebas, documentación de errores y validación |

Una persona puede asumir más de un área dependiendo del tamaño del equipo.

---

# 20. Estrategia Git

Ramas sugeridas:

```text
main
develop
feature/chat
feature/dashboard
feature/activities
feature/database
feature/ai
fix/nombre-del-error
```

Flujo recomendado:

```text
main
  │
  └── develop
        │
        ├── feature/chat
        ├── feature/activities
        ├── feature/dashboard
        └── feature/ai
```

### Convención para commits

Utilizar mensajes claros:

```text
feat: agrega interfaz del chatbot
feat: crea endpoint de actividades
fix: corrige cálculo del progreso
docs: actualiza documentación de API
refactor: reorganiza servicio de IA
test: agrega pruebas para actividades
```

---

# 21. Criterios mínimos de aceptación del prototipo

El prototipo puede considerarse funcional cuando sea posible completar este flujo:

```text
1. Usuario entra al sistema.
2. Usuario interactúa con LideraBot.
3. LideraBot responde.
4. LideraBot propone una actividad.
5. Usuario completa la actividad.
6. Sistema registra el resultado.
7. El progreso se actualiza.
8. El dashboard muestra el resultado.
9. El sistema genera una recomendación.
```

---

# 22. Prioridades

Para evitar que el proyecto crezca demasiado antes de validar la idea, trabajar en este orden:

### Prioridad 1 — MVP

- Chat.
- Una actividad funcional.
- Registro del resultado.
- Progreso básico.

### Prioridad 2

- Varias actividades.
- Retroalimentación.
- Recomendaciones.
- Dashboard.

### Prioridad 3

- Personalización avanzada.
- Analítica.
- Mejoras de IA.
- Gamificación.
- Funciones adicionales.

---

# 23. Decisiones pendientes

Antes de comenzar la implementación definitiva, el equipo debe acordar:

- [ ] Framework definitivo del frontend.
- [ ] Tecnología definitiva del backend.
- [ ] Motor/modelo de IA.
- [ ] Sistema de autenticación.
- [ ] Base de datos definitiva.
- [ ] Modelo final de evaluación.
- [ ] Escala de puntuación.
- [ ] Reglas de recomendación.
- [ ] Diseño final de la interfaz.
- [ ] Estrategia de despliegue.

---

# 24. Recomendación de desarrollo

No comenzar desarrollando todas las funcionalidades al mismo tiempo.

La primera meta debe ser conseguir este **vertical slice**:

```text
Frontend
   ↓
Chat
   ↓
Backend
   ↓
IA
   ↓
Respuesta
   ↓
Base de datos
```

Una vez este flujo funcione correctamente, incorporar actividades, evaluación, progreso y recomendaciones.

Esto permitirá detectar rápidamente problemas de arquitectura y reducir el riesgo de desarrollar componentes que posteriormente deban ser reemplazados.

---

# 25. Estado del proyecto

**Estado:** Prototipo en desarrollo

### Checklist general

- [ ] Arquitectura definida
- [ ] Repositorio creado
- [ ] Frontend configurado
- [ ] Backend configurado
- [ ] Base de datos configurada
- [ ] Chat implementado
- [ ] IA integrada
- [ ] Actividades implementadas
- [ ] Evaluación implementada
- [ ] Progreso implementado
- [ ] Recomendaciones implementadas
- [ ] Dashboard implementado
- [ ] Pruebas realizadas
- [ ] Prototipo listo para demostración

---

# 26. Nota para el equipo

Este documento debe considerarse una **base de trabajo viva**.

Cada decisión importante del proyecto debe documentarse y actualizarse aquí para que todos los integrantes trabajen sobre la misma versión de los requisitos y la arquitectura.

Antes de implementar una funcionalidad nueva, verificar:

1. ¿Está dentro del alcance del prototipo?
2. ¿Qué módulo debe modificar?
3. ¿Qué datos necesita?
4. ¿Qué endpoint requiere?
5. ¿Cómo afecta al flujo existente?
6. ¿Cómo se probará?

---

## LideraBot

**Prototipo de asistente virtual educativo para el desarrollo de habilidades de liderazgo.**
