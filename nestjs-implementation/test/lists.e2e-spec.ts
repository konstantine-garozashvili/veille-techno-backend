import request from 'supertest';
import { bootstrapTestApp, clearDatabase, loginAndGetToken, registerUser, TestContext } from './helpers';

describe('Lists (e2e)', () => {
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
    await registerUser(ctx.app, 'user@example.com');
    const res = await loginAndGetToken(ctx.app, 'user@example.com');
    token = res.body.access_token;
  });

  it('should require auth for lists endpoints', async () => {
    const res = await request(ctx.httpServer).get('/lists');
    expect(res.status).toBe(401);
  });

  it('should create, list, get, update, and delete a list', async () => {
    const createRes = await request(ctx.httpServer)
      .post('/lists')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Backlog' });
    expect(createRes.status).toBe(201);
    const listId = createRes.body.id;

    const listRes = await request(ctx.httpServer).get('/lists').set('Authorization', `Bearer ${token}`);
    expect(listRes.status).toBe(200);
    expect(listRes.body.find((l: any) => l.id === listId)).toBeTruthy();

    const getRes = await request(ctx.httpServer).get(`/lists/${listId}`).set('Authorization', `Bearer ${token}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.title).toBe('Backlog');

    const patchRes = await request(ctx.httpServer)
      .patch(`/lists/${listId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'To Do' });
    expect(patchRes.status).toBe(200);
    expect(patchRes.body.title).toBe('To Do');

    const delRes = await request(ctx.httpServer).delete(`/lists/${listId}`).set('Authorization', `Bearer ${token}`);
    expect(delRes.status).toBe(200);

    const getMissing = await request(ctx.httpServer).get(`/lists/${listId}`).set('Authorization', `Bearer ${token}`);
    expect(getMissing.status).toBe(404);
  });

  it('should validate create/update payload', async () => {
    const badCreate = await request(ctx.httpServer)
      .post('/lists')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '' });
    expect(badCreate.status).toBe(400);

    const goodCreate = await request(ctx.httpServer)
      .post('/lists')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Sprint' });
    const id = goodCreate.body.id;

    const badUpdate = await request(ctx.httpServer)
      .patch(`/lists/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '' });
    expect(badUpdate.status).toBe(400);
  });
});