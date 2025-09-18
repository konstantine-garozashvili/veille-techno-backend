import request from 'supertest';
import { bootstrapTestApp, clearDatabase, TestContext, seedAdmin } from './helpers';

// GraphQL e2e that seeds lists and cards as an admin user
// Flow:
// - Use seedAdmin helper (register via REST, elevate via service), get JWT
// - Create lists and cards via GraphQL mutations
// - Verify via GraphQL queries

describe('Admin data seeding via GraphQL (e2e)', () => {
  let ctx: TestContext;
  let adminToken: string;
  const adminEmail = 'admin@example.com';
  const adminPassword = 'Password123!';

  beforeAll(async () => {
    ctx = await bootstrapTestApp();
  });

  afterAll(async () => {
    await ctx.app.close();
  });

  async function gql(query: string, variables?: any, token?: string) {
    const req = request(ctx.httpServer).post('/graphql').send({ query, variables });
    if (token) req.set('Authorization', `Bearer ${token}`);
    return req;
  }

  beforeEach(async () => {
    await clearDatabase(ctx.dataSource);

    // Seed admin using helper, then reuse token for GraphQL operations
    const seeded = await seedAdmin(ctx, adminEmail, adminPassword);
    adminToken = seeded.token;
  });

  it('should create lists and cards via GraphQL and retrieve them', async () => {
    // Create lists
    const createListMutation = /* GraphQL */ `
      mutation CreateList($input: CreateListDto!) {
        createList(input: $input) { id title }
      }
    `;

    const backlogRes = await gql(createListMutation, { input: { title: 'Backlog' } }, adminToken);
    expect(backlogRes.status).toBe(200);
    expect(backlogRes.body.errors).toBeUndefined();
    const backlogId = backlogRes.body.data.createList.id as string;

    const inProgressRes = await gql(createListMutation, { input: { title: 'In Progress' } }, adminToken);
    expect(inProgressRes.status).toBe(200);
    expect(inProgressRes.body.errors).toBeUndefined();
    const inProgressId = inProgressRes.body.data.createList.id as string;

    // Create cards
    const createCardMutation = /* GraphQL */ `
      mutation CreateCard($listId: String!, $input: CreateCardDto!) {
        createCard(listId: $listId, input: $input) { id title position }
      }
    `;

    const c1 = await gql(
      createCardMutation,
      { listId: backlogId, input: { title: 'Setup CI', description: 'Configure CI pipeline', position: 1 } },
      adminToken,
    );
    expect(c1.status).toBe(200);
    expect(c1.body.errors).toBeUndefined();

    const c2 = await gql(
      createCardMutation,
      { listId: backlogId, input: { title: 'Implement Auth', description: 'JWT login/registration', position: 2 } },
      adminToken,
    );
    expect(c2.status).toBe(200);
    expect(c2.body.errors).toBeUndefined();

    const c3 = await gql(
      createCardMutation,
      { listId: inProgressId, input: { title: 'Lists CRUD', description: 'Create/Update/Delete lists', position: 1 } },
      adminToken,
    );
    expect(c3.status).toBe(200);
    expect(c3.body.errors).toBeUndefined();

    // Verify lists
    const listsQuery = /* GraphQL */ `
      query {
        lists { id title }
      }
    `;
    const listsRes = await gql(listsQuery, undefined, adminToken);
    expect(listsRes.status).toBe(200);
    expect(listsRes.body.errors).toBeUndefined();
    const lists: Array<{ id: string; title: string }> = listsRes.body.data.lists;
    expect(lists.some(l => l.id === backlogId)).toBe(true);
    expect(lists.some(l => l.id === inProgressId)).toBe(true);

    // Verify cards per list
    const cardsQuery = /* GraphQL */ `
      query Cards($listId: String!) { cards(listId: $listId) { id title position } }
    `;
    const backlogCards = await gql(cardsQuery, { listId: backlogId }, adminToken);
    expect(backlogCards.status).toBe(200);
    expect(backlogCards.body.errors).toBeUndefined();
    expect(Array.isArray(backlogCards.body.data.cards)).toBe(true);
    expect(backlogCards.body.data.cards.length).toBe(2);

    const inProgressCards = await gql(cardsQuery, { listId: inProgressId }, adminToken);
    expect(inProgressCards.status).toBe(200);
    expect(inProgressCards.body.errors).toBeUndefined();
    expect(Array.isArray(inProgressCards.body.data.cards)).toBe(true);
    expect(inProgressCards.body.data.cards.length).toBe(1);

    // Spot-check a specific card
    const cardQuery = /* GraphQL */ `
      query Card($listId: String!, $cardId: String!) { card(listId: $listId, cardId: $cardId) { id title } }
    `;
    const cardRes = await gql(cardQuery, { listId: backlogId, cardId: c1.body.data.createCard.id }, adminToken);
    expect(cardRes.status).toBe(200);
    expect(cardRes.body.errors).toBeUndefined();
    expect(cardRes.body.data.card.title).toBe('Setup CI');
  });
});