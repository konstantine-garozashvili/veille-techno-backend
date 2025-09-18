import request from 'supertest';
import { bootstrapTestApp, clearDatabase, loginAndGetToken, registerUser, TestContext, seedAdmin } from './helpers';

// This e2e spec seeds data (lists and cards) using an admin user
// It now uses a reusable seedAdmin helper to elevate a user to admin via service layer
// then uses REST endpoints to create lists and cards and verifies persistence.
describe('Admin data seeding (e2e)', () => {
  let ctx: TestContext;
  let adminToken: string;
  const adminEmail = 'admin@example.com';

  beforeAll(async () => {
    ctx = await bootstrapTestApp();
  });

  afterAll(async () => {
    await ctx.app.close();
  });

  beforeEach(async () => {
    // Ensure a clean DB for each test
    await clearDatabase(ctx.dataSource);

    // Seed admin user and login
    const seeded = await seedAdmin(ctx, adminEmail, 'Password123!');
    adminToken = seeded.token;
  });

  it('should create lists and cards as admin and retrieve them', async () => {
    // Create two lists
    const backlogRes = await request(ctx.httpServer)
      .post('/lists')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Backlog' });
    expect(backlogRes.status).toBe(201);
    const backlogId = backlogRes.body.id as string;

    const inProgressRes = await request(ctx.httpServer)
      .post('/lists')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'In Progress' });
    expect(inProgressRes.status).toBe(201);
    const inProgressId = inProgressRes.body.id as string;

    // Create cards in Backlog
    const c1 = await request(ctx.httpServer)
      .post(`/lists/${backlogId}/cards`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Setup CI', description: 'Configure CI pipeline', position: 1 });
    expect(c1.status).toBe(201);

    const c2 = await request(ctx.httpServer)
      .post(`/lists/${backlogId}/cards`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Implement Auth', description: 'JWT login/registration', position: 2 });
    expect(c2.status).toBe(201);

    // Create a card in In Progress
    const c3 = await request(ctx.httpServer)
      .post(`/lists/${inProgressId}/cards`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Lists CRUD', description: 'Create/Update/Delete lists', position: 1 });
    expect(c3.status).toBe(201);

    // Verify lists
    const listRes = await request(ctx.httpServer)
      .get('/lists')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(listRes.status).toBe(200);
    expect(listRes.body.some((l: any) => l.id === backlogId)).toBe(true);
    expect(listRes.body.some((l: any) => l.id === inProgressId)).toBe(true);

    // Verify cards per list
    const backlogCards = await request(ctx.httpServer)
      .get(`/lists/${backlogId}/cards`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(backlogCards.status).toBe(200);
    expect(Array.isArray(backlogCards.body)).toBe(true);
    expect(backlogCards.body.length).toBe(2);

    const inProgressCards = await request(ctx.httpServer)
      .get(`/lists/${inProgressId}/cards`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(inProgressCards.status).toBe(200);
    expect(Array.isArray(inProgressCards.body)).toBe(true);
    expect(inProgressCards.body.length).toBe(1);

    // Spot-check a specific card
    const getCard = await request(ctx.httpServer)
      .get(`/lists/${backlogId}/cards/${c1.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(getCard.status).toBe(200);
    expect(getCard.body.title).toBe('Setup CI');
  });
});