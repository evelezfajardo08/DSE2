import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { setServers } from 'node:dns';

// Configurar DNS personalizado para MongoDB Atlas (evita timeouts en serverless)
const dnsServers = process.env.MONGODB_DNS_SERVERS?.split(',')
  .map((s) => s.trim())
  .filter(Boolean);
if (dnsServers?.length) {
  setServers(dnsServers);
}

const server = express();
let isInitialized = false;
let initError: Error | null = null;

async function bootstrap() {
  if (initError) throw initError;
  if (!isInitialized) {
    try {
      const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
        logger: ['error', 'warn'],
      });
      app.enableCors();
      await app.init();
      isInitialized = true;
    } catch (err) {
      initError = err as Error;
      throw initError;
    }
  }
  return server;
}

export default async function handler(req: any, res: any) {
  try {
    const expressInstance = await bootstrap();
    expressInstance(req, res);
  } catch (err: any) {
    res.status(500).json({
      statusCode: 500,
      message: 'Error interno del servidor al inicializar la aplicación.',
      error: err?.message || 'Internal Server Error',
    });
  }
}
