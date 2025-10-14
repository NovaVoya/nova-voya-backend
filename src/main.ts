import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // ✅ Increase request body size limits (adjust '50mb' as needed)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // --- Swagger config ---
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API docs for My Service')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {});
  SwaggerModule.setup('/docs', app, document, {
    jsonDocumentUrl: '/docs-json',
    customSiteTitle: 'My API Docs',
  });

  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
