import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthGard } from './auth/auth.guard';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'dev'
        ? 'http://localhost:3000'
        : 'https://hey-learn.vercel.app',
  });
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  app.useGlobalGuards(new AuthGard(configService));
  await app.listen(process.env.PORT ?? 4000);
}
void bootstrap();
