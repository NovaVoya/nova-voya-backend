import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

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
    .addBearerAuth() // shows "Authorize" button for JWT
    // .addCookieAuth('sid')   // or cookies
    // .addServer('/v1')       // if you version via path
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    // include?: [Module1, Module2], // to limit to certain modules
    // deepScanRoutes: true,         // sometimes needed for lazy-loaded modules
  });

  SwaggerModule.setup('/docs', app, document, {
    jsonDocumentUrl: '/docs-json', // you can GET the raw OpenAPI JSON here
    customSiteTitle: 'My API Docs',
  });

  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
