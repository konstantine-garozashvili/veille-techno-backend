import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(parseInt(process.env.PORT || '3000', 10));
  const url = await app.getUrl();
  console.log(`HTTP server listening on ${url}`);
}
bootstrap();
