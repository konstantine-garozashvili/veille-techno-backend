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
      `Documentation de l'API Kanban. Utilisez cette interface pour explorer les endpoints, leurs paramètres et les réponses attendues.

🔧 **Compte administrateur de test :**
- Email : admin@example.com
- Mot de passe : Password123!
- Rôles : ['admin']

📝 **Instructions de test :**
1. Utilisez les identifiants ci-dessus pour vous connecter via /auth/login
2. Copiez le token JWT retourné
3. Cliquez sur "Authorize" en haut à droite et collez le token
4. Vous pouvez maintenant tester tous les endpoints protégés

⚠️ **Note :** Ce compte est créé automatiquement au démarrage de l'application pour faciliter les tests.`
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
