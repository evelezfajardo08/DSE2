import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class ChatService {
  constructor(private readonly configService: ConfigService) {}

  async streamReply(message: string, onChunk: (chunk: string) => void) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new ServiceUnavailableException(
        'Gemini no está configurado. Agrega GEMINI_API_KEY al archivo .env.',
      );
    }

    const modelName = this.configService.get<string>('GEMINI_MODEL') || 'gemini-2.5-flash';
    const systemInstruction = this.configService.get<string>('GEMINI_SYSTEM_INSTRUCTION') ||
      'Eres LideraBot, un mentor virtual en español especializado en desarrollo de liderazgo. Responde de forma clara, práctica y motivadora. Basa tus respuestas en el conocimiento y las instrucciones del Gem y notebook configurados por el equipo. No inventes datos académicos del estudiante.';

    try {
      const client = new GoogleGenerativeAI(apiKey);
      const model = client.getGenerativeModel({
        model: modelName,
        systemInstruction,
      });
      const result = await model.generateContentStream(message.trim());
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) onChunk(text);
      }
    } catch (error) {
      console.error('[Chat] Error al consultar Gemini:', error);
      throw new ServiceUnavailableException(
        'No se pudo obtener una respuesta de LideraBot en este momento.',
      );
    }
  }
}
