import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { AppModule } from '../src/app.module';

export interface TestContext {
  app: INestApplication;
  httpServer: any;
  dataSource: DataSource;
}

export async function bootstrapTestApp(): Promise<TestContext> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  const dataSource = app.get(DataSource);

  // Ensure proper teardown: when tests call app.close(), also destroy the DataSource to avoid open handles
  const originalClose = app.close.bind(app);
  (app as any).close = async () => {
    try {
      await originalClose();
    } finally {
      if (dataSource?.isInitialized) {
        await dataSource.destroy();
      }
    }
  };

  const httpServer = app.getHttpServer();

  return { app, httpServer, dataSource };
}

export async function clearDatabase(ds: DataSource) {
  // Clean all tables between tests to avoid cross-test pollution
  try {
    await ds.query('TRUNCATE TABLE "cards", "lists", "users" RESTART IDENTITY CASCADE');
  } catch (e) {
    // As a fallback (e.g., when TRUNCATE not supported), delete rows in FK order
    await ds.query('DELETE FROM "cards"');
    await ds.query('DELETE FROM "lists"');
    await ds.query('DELETE FROM "users"');
  }
}

export async function registerUser(app: INestApplication, email: string, password = 'Password123!', roles?: string[]) {
  const payload: any = { email, password };
  if (roles) payload.roles = roles;
  const res = await request(app.getHttpServer()).post('/auth/register').send(payload);
  return res;
}

export async function loginAndGetToken(app: INestApplication, email: string, password = 'Password123!') {
  const res = await request(app.getHttpServer()).post('/auth/login').send({ email, password });
  return res;
}