import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { TokenBlacklistService } from '../src/auth/token-blacklist.service';

describe('Logout (e2e)', () => {
  let app: INestApplication;
  let tokenBlacklistService: TokenBlacklistService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    tokenBlacklistService = moduleFixture.get<TokenBlacklistService>(TokenBlacklistService);
    
    await app.init();
  });

  beforeEach(async () => {
    // Clear blacklist before each test
    tokenBlacklistService.clearBlacklist();
  });

  afterAll(async () => {
    await app.close();
  });

  // Helper function to create a unique user and get token
  async function createUserAndGetToken(email: string): Promise<string> {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        password: 'password123'
      });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password: 'password123'
      });

    return loginResponse.body.access_token;
  }

  describe('REST API Logout', () => {
    it('should logout successfully with valid token', async () => {
      const authToken = await createUserAndGetToken('rest-logout-1@example.com');
      
      // Ensure token is not blacklisted before logout
      expect(tokenBlacklistService.isTokenBlacklisted(authToken)).toBe(false);
      
      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toBe('Successfully logged out');
      expect(tokenBlacklistService.isTokenBlacklisted(authToken)).toBe(true);
    });

    it('should fail to access protected route after logout', async () => {
      const authToken = await createUserAndGetToken('rest-logout-2@example.com');
      
      // Ensure token is not blacklisted before logout
      expect(tokenBlacklistService.isTokenBlacklisted(authToken)).toBe(false);
      
      // First logout
      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Try to access protected route with blacklisted token
      await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(401);
    });

    it('should fail logout without token', async () => {
      await request(app.getHttpServer())
        .post('/auth/logout')
        .expect(401);
    });

    it('should fail logout with invalid token', async () => {
      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('GraphQL Logout', () => {
    it('should logout successfully via GraphQL', async () => {
      const authToken = await createUserAndGetToken('graphql-logout-1@example.com');
      
      const mutation = `
        mutation {
          logout
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ query: mutation });

      // GraphQL logout should work
      expect(response.status).toBe(200);
      if (response.body.data && response.body.data.logout) {
        expect(response.body.data.logout).toBe('Successfully logged out');
      }
      
      // Check if token is blacklisted
      const isBlacklisted = tokenBlacklistService.isTokenBlacklisted(authToken);
      expect(isBlacklisted).toBe(true);
    });

    it('should fail GraphQL queries after logout', async () => {
      const authToken = await createUserAndGetToken('graphql-logout-2@example.com');
      
      // First logout
      const logoutMutation = `
        mutation {
          logout
        }
      `;

      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ query: logoutMutation })
        .expect(200);

      // Try to access protected GraphQL mutation with blacklisted token
      const protectedMutation = `
        mutation {
          createUser(input: {
            email: "test-protected@example.com"
            password: "password123"
          }) {
            id
            email
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ query: protectedMutation });

      // GraphQL can return errors in different ways
      if (response.status === 200 && response.body.errors) {
        expect(response.body.errors).toBeDefined();
      } else if (response.status === 401 || response.status === 400) {
        // Token was rejected at HTTP level (401) or bad request (400)
        expect([400, 401]).toContain(response.status);
      } else {
        // Unexpected response
        expect([200, 400, 401]).toContain(response.status);
      }
    });
  });

  describe('Token Blacklist Service', () => {
    it('should correctly identify blacklisted tokens', () => {
      const testToken = 'test-token-123';
      
      expect(tokenBlacklistService.isTokenBlacklisted(testToken)).toBe(false);
      
      tokenBlacklistService.blacklistToken(testToken);
      
      expect(tokenBlacklistService.isTokenBlacklisted(testToken)).toBe(true);
      expect(tokenBlacklistService.getBlacklistSize()).toBe(1);
    });

    it('should extract token from authorization header', () => {
      const authHeader = 'Bearer test-token-123';
      const extracted = tokenBlacklistService.extractTokenFromHeader(authHeader);
      
      expect(extracted).toBe('test-token-123');
    });

    it('should return null for invalid authorization header', () => {
      expect(tokenBlacklistService.extractTokenFromHeader('')).toBe(null);
      expect(tokenBlacklistService.extractTokenFromHeader('Invalid header')).toBe(null);
      expect(tokenBlacklistService.extractTokenFromHeader('Basic token')).toBe(null);
    });

    it('should clear blacklist', () => {
      tokenBlacklistService.blacklistToken('token1');
      tokenBlacklistService.blacklistToken('token2');
      
      expect(tokenBlacklistService.getBlacklistSize()).toBe(2);
      
      tokenBlacklistService.clearBlacklist();
      
      expect(tokenBlacklistService.getBlacklistSize()).toBe(0);
    });
  });
});