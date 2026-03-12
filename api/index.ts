import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../backend/src/app.module';
import express from 'express';

const expressApp = express();
let isInitialized = false;
let cachedApp: express.Express;

async function createApp(): Promise<express.Express> {
  if (isInitialized && cachedApp) return cachedApp;

  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter, { logger: false });

  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000'];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.init();

  isInitialized = true;
  cachedApp = expressApp;
  return cachedApp;
}

export default async function handler(req: any, res: any) {
  if (req.url.startsWith('/api')) {
    req.url = req.url.slice(4) || '/';
  }
  const app = await createApp();
  app(req, res);
}
