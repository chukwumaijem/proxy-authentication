import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import * as rateLimit from 'express-rate-limit';

import { AppModule } from './app.module';
import envs from './config/app';


async function bootstrap() {
  const logLevels = ['log', 'error'];
  if (!envs.isProduction) {
    logLevels.push('warn', 'debug');
  }

  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: 30,
    }),
  );
  await app.listen(envs.PORT);
}
bootstrap();
