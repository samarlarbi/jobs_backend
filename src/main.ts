import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // strips unknown fields
      forbidNonWhitelisted: true, // throws error if unknown fields
    }),
  );  await app.listen(3000);
}
bootstrap();
