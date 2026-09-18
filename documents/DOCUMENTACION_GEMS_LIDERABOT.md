# Guía de Integración de LideraBot con Gemini en NestJS

Esta guía documenta los pasos necesarios para integrar la API de Google Gemini en tu proyecto NestJS para que funcione como **LideraBot**, un asistente educativo para estudiantes universitarios.

## 1. Requisitos Previos e Instalación

### Obtener Clave de API
1. Entra a [Google AI Studio](https://aistudio.google.com/).
2. Genera una nueva API Key.
3. En la raíz de tu proyecto, asegúrate de que exista un archivo `.env` y añade tu clave:

```env
GEMINI_API_KEY=tu_clave_secreta_aqui
```

**Importante:** Nunca subas el archivo `.env` a GitHub. Verifica que `.env` esté incluido en tu `.gitignore`.

### Instalar la SDK de Gemini
Google recomienda usar el paquete oficial `@google/genai`. En tu terminal, ejecuta:

```bash
npm install @google/genai
```

---

## 2. Creación del Servicio (La lógica de LideraBot)

Es recomendable centralizar la conexión con Gemini en un servicio. Puedes crear un módulo nuevo (por ejemplo, `chat`) o agregarlo a tu módulo de `bots` o `messages`. En este ejemplo, crearemos un servicio `ChatService`.

Crea el archivo `src/chat/chat.service.ts` (o `src/bots/bots.service.ts` si prefieres integrarlo allí):

```typescript
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class ChatService {
  private ai: GoogleGenAI;

  constructor() {
    // Inicializa el cliente. Automáticamente tomará GEMINI_API_KEY del entorno.
    this.ai = new GoogleGenAI({});
  }

  async sendMessage(userMessage: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash', // o el modelo que prefieras usar
        contents: userMessage,
        config: {
          systemInstruction: `
            Eres LideraBot, un asistente educativo para estudiantes universitarios.
            Ayudas a desarrollar liderazgo, comunicación, toma de decisiones y trabajo en equipo.

            Debes:
            - Hacer preguntas que promuevan la reflexión.
            - Proponer actividades prácticas breves.
            - Dar retroalimentación respetuosa y concreta.
            - No resolver por completo las actividades del estudiante.
            - Mantener un tono motivador, claro y profesional.
            - Recomendar una habilidad para practicar según las respuestas del estudiante.
          `,
          temperature: 0.7, // Ajusta la creatividad de la respuesta
        },
      });

      return response.text;
    } catch (error) {
      console.error('Error al comunicarse con Gemini:', error);
      throw new InternalServerErrorException('Error al generar respuesta de LideraBot');
    }
  }
}
```

---

## 3. Creación del Controlador (El Endpoint POST /chat)

El controlador expondrá el endpoint para que tu frontend (web o móvil) pueda enviar el mensaje del estudiante.

Crea el archivo `src/chat/chat.controller.ts`:

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async handleChat(@Body('message') message: string) {
    if (!message) {
      return { error: 'El mensaje no puede estar vacío.' };
    }
    
    const reply = await this.chatService.sendMessage(message);
    
    return {
      bot: 'LideraBot',
      reply: reply
    };
  }
}
```

---

## 4. Registrar en el Módulo

Si creaste un nuevo módulo para el chat (`src/chat/chat.module.ts`):

```typescript
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
```

Luego, asegúrate de importarlo en tu `AppModule` (`src/app.module.ts`):

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Si usas el módulo de configuración de Nest
import { ChatModule } from './chat/chat.module';
// ... otras importaciones

@Module({
  imports: [
    ConfigModule.forRoot(), // Recomendado para cargar variables de entorno
    ChatModule,
    // ... otros módulos (bots, messages, conversations)
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

---

## 5. Pruebas

Inicia tu servidor NestJS:

```bash
npm run start:dev
```

Prueba el endpoint usando cURL, Postman o Insomnia:

**Petición (POST):**
```http
POST http://localhost:3000/chat
Content-Type: application/json

{
  "message": "Hola, me está costando trabajo organizar las tareas con mi equipo de la universidad."
}
```

**Respuesta Esperada:**
```json
{
  "bot": "LideraBot",
  "reply": "¡Hola! Es completamente normal enfrentar desafíos al organizar tareas en equipo... (Respuesta generada por Gemini respetando las reglas de LideraBot)"
}
```
