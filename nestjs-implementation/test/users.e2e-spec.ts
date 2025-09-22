import request from 'supertest';
import { bootstrapTestApp, clearDatabase, loginAndGetToken, registerUser, TestContext, seedAdmin } from './helpers';

async function promoteToAdmin(ctx: TestContext, token: string, userId: string) {
  const res = await request(ctx.httpServer)
    .patch(`/users/${userId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ roles: ['admin'] });
  return res;
}

describe('Users (e2e)', () => {
  let ctx: TestContext;
  let userToken: string;
  let adminToken: string;
  let adminUserId: string;
  beforeAll(async () => {
    ctx = await bootstrapTestApp();
  });

  afterAll(async () => {
    await ctx.app.close();
  });

  beforeEach(async () => {
    await clearDatabase(ctx.dataSource);

    // Seed an admin user using helper
    const admin = await seedAdmin(ctx, 'admin@example.com', 'Password123!');
    adminToken = admin.token;
    adminUserId = admin.id;

    // Create a normal user
    const regUser = await registerUser(ctx.app, 'user@example.com', 'Password123!');
    expect(regUser.status).toBe(201);

    // Login the user to get token
    const loginUser = await loginAndGetToken(ctx.app, 'user@example.com', 'Password123!');
    expect(loginUser.status).toBe(200);
    userToken = loginUser.body.access_token;
  });

  it('non-admin cannot update roles', async () => {
    // normal user attempts to promote admin
    const resSelf = await request(ctx.httpServer)
      .patch(`/users/${adminUserId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ roles: ['admin'] });
    expect(resSelf.status).toBe(403);
  });
  it('admin can update roles', async () => {
    // As admin, create another user then promote them
    const regTarget = await registerUser(ctx.app, 'target@example.com', 'Password123!');
    const targetId = regTarget.body.id;
    
    const promote = await request(ctx.httpServer)
      .patch(`/users/${targetId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ roles: ['admin'] });
    expect(promote.status).toBe(200);
    expect(promote.body.roles).toEqual(['admin']);
  });
});