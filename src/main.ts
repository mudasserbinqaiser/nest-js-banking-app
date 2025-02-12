import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { LoggingService } from './logging/logging.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = app.get(LoggingService);
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strips out unknown properties
    forbidNonWhitelisted: true, // Throws an error if unknown properties exist
    transform: true, // Automatically transforms payloads to match DTO types
  }));

  app.enableCors();
  await app.listen(configService.get('PORT') || 3000);
}
bootstrap();
