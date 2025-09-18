# NestJS Kanban Board — Project Overview and Viva Q&A

## 1) What this project is
A complete Kanban Board backend exposing both REST and GraphQL APIs, built with NestJS and TypeORM on PostgreSQL. It covers authentication (JWT), role-based access control (admin vs user), lists and cards CRUD, validation, and auto-generated Swagger docs.

## 2) Why we chose NestJS (short rationale)
- Developer productivity: structured modules, DI, decorators, and CLI speed up feature delivery.
- Ecosystem fit: TypeORM, class-validator, Swagger, and GraphQL integrate first-class.
- Learning impact: modern Node.js framework that enforces clean architecture (controllers/services/DTOs).
- Flexibility: serve REST and GraphQL side-by-side, same domain logic.

(Full technology watch/justification is in docs/veille_technologique_backend.md.)

## 3) High-level architecture
- Layered by domain with clear boundaries:
  - Controllers/Resolvers (I/O) → Services (domain logic) → Repositories/Entities (data access).
- Validation at the edge via DTOs and ValidationPipe.
- Auth via JWT strategy and role guards.
- Database: PostgreSQL, entities mapped with TypeORM.

## 4) Data model (TypeORM)
- User: id, email (unique), passwordHash, roles, timestamps.
- List: id, title, timestamps.
- Card: id, title, description, position, listId, timestamps.
- Relations: List 1—N Card; a card belongs to exactly one list.

## 5) APIs
- REST (Swagger at /api): CRUD for users, lists, cards; auth endpoints.
- GraphQL (playground at /graphql): mirrors key operations (createList, createCard, lists, cards, removeList, removeCard, etc.).
- Both APIs share the same services so behavior remains consistent.

## 6) Security
- Authentication: JWT (login issues access token).
- Authorization: role-based (admin can manage roles; regular users limited).
- Passwords: stored as bcrypt hashes; never returned by APIs.
- Validation: class-validator on all DTOs; whitelist + forbid non-whitelisted fields.

## 7) Testing
- End-to-end tests with Jest + Supertest.
- Suites: auth, users, lists, cards, app health, and admin seeding.
- GraphQL e2e mirrors the REST seed (register → elevate role in test DB → create lists/cards → verify).
- Command: `npm run test:e2e` (from nestjs-implementation).

## 8) How to run
- See docs/SETUP.md for Docker, environment, and commands.
- Key URLs: Swagger at `/api`, GraphQL at `/graphql`.

## 9) Where things live (file map)
- Root
  - `docker-compose.yml`: Postgres service & app wiring.
  - `database/init.sql`: optional DB bootstrap.
  - `docs/`: API, setup, and technology watch.
- `nestjs-implementation/`
  - `src/app.module.ts`: wires modules (TypeORM, Swagger, GraphQL).
  - `src/main.ts`: bootstraps Nest app + Swagger at /api.
  - `src/auth/`: auth controller & resolver, DTOs, JWT strategy/service.
  - `src/users/`: user entity, controller, resolver, service, DTOs.
  - `src/lists/`: list entity, controller, resolver, service, DTOs.
  - `src/cards/`: card entity, controller, resolver, service, DTOs.
  - `src/health/`: health check controller/service.
  - `src/schema.gql`: generated GraphQL schema snapshot.
  - `test/`: all e2e suites, including REST and GraphQL seeding.

## 10) Notable implementation details
- ValidationPipe (whitelist + forbidNonWhitelisted) applied on controllers to block unsafe input.
- UsersService hashes passwords using bcrypt on create/update.
- Roles update is guarded; non-admin attempts receive 403.
- REST and GraphQL reuse the same services to avoid duplication.

## 11) Potential extensions
- Add migrations and a dedicated seed CLI for non-test environments.
- CI to run e2e on PRs.
- GraphQL update/delete e2e to complement creation queries.

---

## Viva (Oral Exam) — Likely Questions and Suggested Answers

1) Why NestJS over Symfony/Spring Boot?
- NestJS gives a strong architectural pattern similar to Angular/Spring, excellent TypeScript support, and seamless Swagger/GraphQL/TypeORM integration, which accelerated delivery while keeping code maintainable. Symfony/Spring Boot are great, but NestJS best matched our team skills and two-API (REST+GraphQL) goal.

2) How is authentication implemented?
- Email/password login verifies credentials with bcrypt and issues a JWT. Protected routes require Bearer tokens; guards extract and validate the token to attach the user to the request.

3) How do you enforce authorization (admin vs user)?
- We use role-based guards. Role metadata on handlers is checked after authentication; non-admin attempts to admin-only endpoints receive 403.

4) How are passwords stored?
- Never in plaintext. We store a bcrypt hash with a cost factor (salted). The hash is not exposed in responses.

5) How do you validate inputs and protect against mass assignment?
- DTOs use class-validator; the global ValidationPipe runs with `whitelist: true` and `forbidNonWhitelisted: true`, stripping unknown fields and rejecting extra data.

6) Why add GraphQL in addition to REST?
- To showcase the framework’s versatility and to compare developer experience. Both APIs share services, so business rules stay consistent.

7) How did you test the system end-to-end?
- Jest + Supertest spin up the app, hit real HTTP/GraphQL endpoints, and assert on responses. Seeding tests create an admin (in test DB), perform list/card operations, and verify retrieval.

8) What are the main entities and relations?
- User (auth, roles), List (kanban column), Card (task). One List has many Cards; a Card belongs to one List.

9) How do you document the API?
- SwaggerModule builds a spec from decorators on controllers/DTOs and serves it at `/api`. We also ship a written docs/API.md.

10) How do migrations/DB init work here?
- We provide a dockerized Postgres and an optional init.sql. Adding TypeORM migrations is straightforward and listed as a next step.

11) How would you handle performance concerns?
- Add indices on foreign keys (listId), paginate list/card queries, use SELECT projections, avoid N+1 in GraphQL with batching where needed, and cache read-mostly endpoints if required.

12) How do you avoid leaking sensitive data?
- Never return passwordHash. Services/controllers strip it before returning. We also avoid logging secrets and use environment variables for config.

13) What would you improve next?
- Add refresh tokens, RBAC policies with fine-grained rules, comprehensive GraphQL CRUD e2e, and CI with database containers for deterministic tests.