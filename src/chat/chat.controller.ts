import { BadRequestException, Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async reply(
    @Body() body: {
      message?: string;
      context?: any;
      history?: Array<{ role?: string; content?: string }>;
    },
    @Res() response: Response,
  ) {
    const message = String(body.message || '').trim();
    if (!message) {
      throw new BadRequestException('El mensaje es obligatorio.');
    }

    response.status(200);
    response.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'keep-alive');
    response.flushHeaders();
    const history = Array.isArray(body.history)
      ? body.history.slice(-8).flatMap((entry) => {
        if (typeof entry.content !== 'string') return [];
        const role: 'assistant' | 'user' = entry.role === 'assistant' || entry.role === 'bot' ? 'assistant' : 'user';
        return [{ role, content: entry.content.trim().slice(0, 1500) }];
      })
      : [];

    try {
      await this.chatService.streamReply(message, (chunk) => {
        response.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }, body.context, history);
      response.write('event: done\ndata: {}\n\n');
    } catch (error) {
      response.write(`event: error\ndata: ${JSON.stringify('No se pudo obtener una respuesta de LideraBot.')}\n\n`);
    } finally {
      response.end();
    }
  }
}
