import request from 'supertest';
import { bootstrapTestApp, clearDatabase, loginAndGetToken, registerUser, TestContext } from './helpers';

describe('Cards (e2e)', () => {
  let ctx: TestContext;
  let token: string;
  let listId: string;

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

    // create a list
    const listRes = await request(ctx.httpServer)
      .post('/lists')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Backlog' });
    listId = listRes.body.id;
  });

  it('should require auth for cards endpoints', async () => {
    const res = await request(ctx.httpServer).get(`/lists/${listId}/cards`);
    expect(res.status).toBe(401);
  });

  it('should create, list, get, update, and delete a card', async () => {
    const createRes = await request(ctx.httpServer)
      .post(`/lists/${listId}/cards`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Implement feature', description: 'Do it', position: 1 });
    expect(createRes.status).toBe(201);
    const cardId = createRes.body.id;

    const listRes = await request(ctx.httpServer)
      .get(`/lists/${listId}/cards`)
      .set('Authorization', `Bearer ${token}`);
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);

    const getRes = await request(ctx.httpServer)
      .get(`/lists/${listId}/cards/${cardId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.title).toBe('Implement feature');

    const patchRes = await request(ctx.httpServer)
      .patch(`/lists/${listId}/cards/${cardId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Implement feature - Updated', position: 2 });
    expect(patchRes.status).toBe(200);
    expect(patchRes.body.position).toBe(2);

    const delRes = await request(ctx.httpServer)
      .delete(`/lists/${listId}/cards/${cardId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(delRes.status).toBe(200);

    const getMissing = await request(ctx.httpServer)
      .get(`/lists/${listId}/cards/${cardId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(getMissing.status).toBe(404);
  });

  it('should validate create/update payload', async () => {
    const badCreate = await request(ctx.httpServer)
      .post(`/lists/${listId}/cards`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '' });
    expect(badCreate.status).toBe(400);

    const goodCreate = await request(ctx.httpServer)
      .post(`/lists/${listId}/cards`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Task' });
    const id = goodCreate.body.id;

    const badUpdate = await request(ctx.httpServer)
      .patch(`/lists/${listId}/cards/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ position: -1 });
    expect(badUpdate.status).toBe(400);
  });

  it('should return 404 when creating card for non-existent list', async () => {
    const res = await request(ctx.httpServer)
      .post(`/lists/00000000-0000-0000-0000-000000000000/cards`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Orphan card' });
    expect(res.status).toBe(404);
  });
});