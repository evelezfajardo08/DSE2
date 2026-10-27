import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { setServers } from 'node:dns';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'node:path';
import { existsSync } from 'node:fs';

async function bootstrap() {
  const dnsServers = process.env.MONGODB_DNS_SERVERS?.split(',')
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers?.length) {
    setServers(dnsServers);
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('API de prueba')
    .setDescription('Api de prueba')
    .setVersion('1.0')
    .addTag('prueba')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Servir frontend compilado en producción si existe
  const frontendDist = join(process.cwd(), 'frontend', 'dist');
  if (existsSync(frontendDist)) {
    const server = app.getHttpAdapter().getInstance();
    server.use(express.static(frontendDist));
    server.use((req: any, res: any, next: any) => {
      if (req.method !== 'GET') {
        return next();
      }
      if (
        req.path.startsWith('/api') ||
        req.path.startsWith('/auth') ||
        req.path.startsWith('/chat') ||
        req.path.startsWith('/progress') ||
        req.path.startsWith('/activities') ||
        req.path.startsWith('/results') ||
        req.path.startsWith('/users') ||
        req.path.startsWith('/messages') ||
        req.path.startsWith('/conversations') ||
        req.path.startsWith('/modules') ||
        req.path.startsWith('/contents') ||
        req.path.startsWith('/assessments') ||
        req.path.startsWith('/suggestions') ||
        req.path.startsWith('/bots')
      ) {
        return next();
      }
      res.sendFile(join(frontendDist, 'index.html'));
    });
  }

  const port = process.env.PORT ?? 4001;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
