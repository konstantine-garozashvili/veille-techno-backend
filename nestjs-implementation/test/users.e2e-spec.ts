import request from 'supertest';
import { bootstrapTestApp, clearDatabase, loginAndGetToken, registerUser, TestContext } from './helpers';

describe('Users (e2e)', () => {
  let ctx: TestContext;
  let token: string;

  beforeAll(async () => {
    ctx = await bootstrapTestApp();
  });

  afterAll(async () => {
    await ctx.app.close();
  });

  beforeEach(async () => {
    await clearDatabase(ctx.dataSource);
    await registerUser(ctx.app, 'admin@example.com', 'Password123!', ['admin']);
    const res = await loginAndGetToken(ctx.app, 'admin@example.com', 'Password123!');
    token = res.body.access_token;
  });

  it('should create a user (public endpoint)', async () => {
    const res = await request(ctx.httpServer).post('/users').send({ email: 'u1@example.com', password: 'Password123!' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ email: 'u1@example.com' });
    expect(res.body).not.toHaveProperty('passwordHash');
  });

  it('should not create a user with duplicate email', async () => {
    await request(ctx.httpServer).post('/users').send({ email: 'dup@example.com', password: 'Password123!' });
    const res = await request(ctx.httpServer).post('/users').send({ email: 'dup@example.com', password: 'Password123!' });
    expect(res.status).toBe(409);
  });

  it('should validate payload and reject non-whitelisted fields', async () => {
    const res = await request(ctx.httpServer)
      .post('/users')
      .send({ email: 'bad@example.com', password: 'Password123!', unknown: 'value' });
    expect(res.status).toBe(400);
  });

  it('should require auth to list users', async () => {
    const resNoAuth = await request(ctx.httpServer).get('/users');
    expect(resNoAuth.status).toBe(401);

    await request(ctx.httpServer).post('/users').send({ email: 'a@example.com', password: 'Password123!' });
    const res = await request(ctx.httpServer).get('/users').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should get, update, and delete a user by id (auth required)', async () => {
    const created = await request(ctx.httpServer).post('/users').send({ email: 'toedit@example.com', password: 'Password123!' });
    expect(created.status).toBe(201);

    const id = created.body.id;

    const getRes = await request(ctx.httpServer).get(`/users/${id}`).set('Authorization', `Bearer ${token}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.email).toBe('toedit@example.com');

    const patchRes = await request(ctx.httpServer)
      .patch(`/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'edited@example.com', roles: ['user', 'editor'] });
    expect(patchRes.status).toBe(200);
    expect(patchRes.body.email).toBe('edited@example.com');
    expect(patchRes.body.roles).toEqual(['user', 'editor']);

    const delRes = await request(ctx.httpServer).delete(`/users/${id}`).set('Authorization', `Bearer ${token}`);
    expect(delRes.status).toBe(200);

    const getMissing = await request(ctx.httpServer).get(`/users/${id}`).set('Authorization', `Bearer ${token}`);
    expect(getMissing.status).toBe(404);
  });

  it('should validate update payload', async () => {
    const created = await request(ctx.httpServer).post('/users').send({ email: 'val@example.com', password: 'Password123!' });
    const id = created.body.id;
    const res = await request(ctx.httpServer)
      .patch(`/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ roles: [123 as unknown as string] });
    expect(res.status).toBe(400);
  });
});