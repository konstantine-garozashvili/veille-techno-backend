import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';

// Ensure JWT secret is defined for tests to avoid reliance on external env
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_do_not_use_in_prod';

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

export async function registerUser(app: INestApplication, email: string, password = 'Password123!') {
  const payload: any = { email, password };
  const res = await request(app.getHttpServer()).post('/auth/register').send(payload);
  return res;
}

export async function loginAndGetToken(app: INestApplication, email: string, password = 'Password123!') {
  const res = await request(app.getHttpServer()).post('/auth/login').send({ email, password });
  return res;
}

export interface AdminSeedResult { id: string; token: string; email: string; }

export async function seedAdmin(ctx: TestContext, email = 'admin@example.com', password = 'Password123!'): Promise<AdminSeedResult> {
  // Ensure the user exists via public register endpoint
  const reg = await registerUser(ctx.app, email, password);
  if (![200, 201, 409].includes(reg.status)) {
    throw new Error(`Failed to register admin user for seeding (status ${reg.status})`);
  }

  const usersService = ctx.app.get(UsersService);
  const existing = await usersService.findByEmail(email);
  if (!existing) throw new Error('Registered admin user not found by UsersService');

  // Elevate to admin via service to avoid raw SQL in tests
  await usersService.update(existing.id, { roles: ['admin'] });

  // Login to get a token with admin role
  const login = await loginAndGetToken(ctx.app, email, password);
  if (login.status !== 200) throw new Error('Admin login failed in seeding');

  return { id: existing.id, token: login.body.access_token as string, email };
}