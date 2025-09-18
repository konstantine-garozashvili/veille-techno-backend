import 'reflect-metadata'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger/OpenAPI setup (French user-facing texts)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Kanban — Documentation')
    .setDescription(
      "Documentation de l'API Kanban. Utilisez cette interface pour explorer les endpoints, leurs paramètres et les réponses attendues."
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: "Jeton d'authentification Bearer (JWT)" },
      'bearer'
    )
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument, {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: 'API Kanban — Swagger',
  });

  await app.listen(parseInt(process.env.PORT || '3000', 10));
  const url = await app.getUrl();
  console.log(`HTTP server listening on ${url}`);
  console.log(`Swagger UI available at ${url}/api`);
}
bootstrap();
