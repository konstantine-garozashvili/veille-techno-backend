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

    const loginUser = await loginAndGetToken(ctx.app, 'user@example.com', 'Password123!');
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

  it('non-admin cannot create user via REST (POST /users -> 403)', async () => {
    const res = await request(ctx.httpServer)
      .post('/users')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ email: 'rest-forbidden@example.com', password: 'Password123!' });
    expect(res.status).toBe(403);
  });

  it('non-admin cannot create user via GraphQL (mutation createUser -> Forbidden)', async () => {
    const mutation = `
      mutation CreateUser($input: CreateUserDto!) {
        createUser(input: $input) { id email }
      }
    `;
    const variables = { input: { email: 'gql-forbidden@example.com', password: 'Password123!' } };

    const res = await request(ctx.httpServer)
      .post('/graphql')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ query: mutation, variables });

    // GraphQL typically returns 200 with errors array for exceptions thrown by resolvers/guards
    expect([200, 403]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body.errors && res.body.errors.length).toBeGreaterThan(0);
      const msg = res.body.errors[0].message as string;
      expect(msg.toLowerCase()).toContain('access denied');
      expect(res.body.data?.createUser).toBeFalsy();
    }
  });
});