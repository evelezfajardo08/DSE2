import { BadRequestException, Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async reply(@Body() body: { message?: string }, @Res() response: Response) {
    const message = String(body.message || '').trim();
    if (!message) {
      throw new BadRequestException('El mensaje es obligatorio.');
    }

    response.status(200);
    response.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'keep-alive');
    response.flushHeaders();

    try {
      await this.chatService.streamReply(message, (chunk) => {
        response.write(`data: ${JSON.stringify(chunk)}\n\n`);
      });
      response.write('event: done\ndata: {}\n\n');
    } catch (error) {
      response.write(`event: error\ndata: ${JSON.stringify('No se pudo obtener una respuesta de LideraBot.')}\n\n`);
    } finally {
      response.end();
    }
  }
}
