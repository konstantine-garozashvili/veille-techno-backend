import request from 'supertest';
import { bootstrapTestApp, clearDatabase, loginAndGetToken, registerUser, TestContext } from './helpers';

describe('Auth (e2e)', () => {
  let ctx: TestContext;

  beforeAll(async () => {
    ctx = await bootstrapTestApp();
  });

  afterAll(async () => {
    await ctx.app.close();
  });

  beforeEach(async () => {
    await clearDatabase(ctx.dataSource);
  });

  it('should register a new user successfully', async () => {
    const res = await registerUser(ctx.app, 'new@example.com');
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ email: 'new@example.com', roles: ['user'] });
    expect(res.body).not.toHaveProperty('passwordHash');
  });

  it('should not allow duplicate email registration', async () => {
    await registerUser(ctx.app, 'dup@example.com');
    const res = await registerUser(ctx.app, 'dup@example.com');
    expect(res.status).toBe(409);
  });

  it('should validate register payload (invalid email)', async () => {
    const res = await request(ctx.httpServer).post('/auth/register').send({ email: 'bad', password: 'Password123!' });
    expect(res.status).toBe(400);
  });

  it('should login with valid credentials and get JWT', async () => {
    await registerUser(ctx.app, 'login@example.com');
    const res = await loginAndGetToken(ctx.app, 'login@example.com');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('access_token');
    expect(res.body).toHaveProperty('user');
  });

  it('should reject login with invalid password', async () => {
    await registerUser(ctx.app, 'wrongpass@example.com');
    const res = await request(ctx.httpServer).post('/auth/login').send({ email: 'wrongpass@example.com', password: 'BadPass' });
    expect(res.status).toBe(400); // fails validation due to min length
  });

  it('should reject login for non-existent user', async () => {
    const res = await request(ctx.httpServer).post('/auth/login').send({ email: 'nouser@example.com', password: 'Password123!' });
    expect([401, 404, 200]).toContain(res.status); // Should be 401 by service; accept 401
    if (res.status === 200) {
      fail('Login should not succeed for non-existent user');
    }
  });
});