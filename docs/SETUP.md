# Project Setup and Rationale — WSL Ubuntu 22.04 + Docker

This document explains why we installed Ubuntu (via WSL 2) on Windows for this project and records all steps taken so far, including how to run the database and how to connect to it.

## Why Ubuntu (WSL 2) for this project

- Production parity: most backend deployments run on Linux; using WSL 2 provides a Linux kernel on Windows to match server environments.
- First‑class Docker support: Docker Desktop integrates with WSL 2 so containers run on the Linux side, improving compatibility and performance.
- Better developer ergonomics: access to Linux tooling (bash, apt, system packages) while keeping Windows IDEs/editors.
- Resource efficiency: lighter than full VMs; fast file I/O with integrated networking (localhost access from Windows).
- Consistency across stacks: the same WSL/Docker setup supports NestJS, Symfony, or Spring Boot backends without changing host OS.

## Steps we completed (chronological)

1. Installed Ubuntu 22.04 on WSL 2 and finished first‑run setup (username/password).
2. Verified WSL installation and set Ubuntu-22.04 as the default distribution.
3. Installed Docker Desktop for Windows and enabled “Use the WSL 2 based engine”.
4. Enabled WSL integration for the Ubuntu-22.04 distro in Docker Desktop Settings > Resources > WSL Integration.
5. Validated Docker from both Windows PowerShell and Ubuntu terminals:
   - docker --version
   - docker run hello-world (succeeded in Ubuntu)
   - docker compose version
6. Confirmed Docker context and permissions in Ubuntu (desktop-linux context; user in docker group).
7. Created database/init.sql to provision extensions (safe on first run).
8. Started PostgreSQL only via Compose:
   - docker compose up -d postgres
   - Verified container status and logs (database ready on port 5432).

## Run Postgres next time

- Start: docker compose up -d postgres
- Status: docker ps
- Logs: docker logs veille-techno-backend-postgres-1
- Stop (keep data): docker compose stop postgres
- Remove container (keep volume): docker compose rm -f postgres
- Remove everything including data: docker compose down -v (careful: deletes the postgres_data volume)

## Database connection details (development)

- Host: localhost
- Port: 5432
- Database: kanban_api
- Username: kanban_user
- Password: kanban_password

Examples:

- psql (from host with psql installed):
  psql "postgresql://kanban_user:kanban_password@localhost:5432/kanban_api"

- Environment URL (for apps):
  DATABASE_URL=postgresql://kanban_user:kanban_password@localhost:5432/kanban_api

## Notes and troubleshooting

- If Docker commands from Ubuntu say permission denied:
  - Ensure WSL integration is enabled for Ubuntu in Docker Desktop
  - Check Docker context: docker context ls (use desktop-linux)
  - Ensure your Linux user is in the docker group; log out/in after changes
- Compose warning: The version key in docker-compose.yml is obsolete; safe to ignore for now. We can remove it later to silence the warning.
- init.sql is idempotent for CREATE EXTENSION IF NOT EXISTS and safe on first boot; add more seed statements later as needed.

## Latest updates — NestJS scaffolding and PostgreSQL integration (2025-09-15)

What we implemented:
- Generated a new NestJS project under nestjs-implementation using Nest CLI with npm.
- Installed database/config packages: @nestjs/typeorm, typeorm, pg, @nestjs/config.
- Configured TypeORM and ConfigModule in src/app.module.ts to read env vars (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME), with autoLoadEntities: true, synchronize: true (dev only), and logging: ['error','schema'].
- Added a startup DB health check (OnModuleInit) that executes SELECT 1 and logs "Database connection verified (SELECT 1)".
- Improved src/main.ts to log the bound server URL after startup.
- Verified connectivity by running the Nest dev server with env variables; observed successful initialization and DB verification in the logs.

How to run the NestJS API locally (development):
1) Ensure Postgres is running via Docker: docker compose up -d postgres
2) In Windows PowerShell, set env variables and start the app (both DB_* and DATABASE_* are supported):
   $env:DB_HOST="localhost"; $env:DB_PORT="5432"; $env:DB_USER="kanban_user"; $env:DB_PASSWORD="kanban_password"; $env:DB_NAME="kanban_api"
   # alternatively, using DATABASE_* names compatible with docker-compose
   # $env:DATABASE_HOST="localhost"; $env:DATABASE_PORT="5432"; $env:DATABASE_USER="kanban_user"; $env:DATABASE_PASSWORD="kanban_password"; $env:DATABASE_NAME="kanban_api"
   cd nestjs-implementation
   npm run start:dev
3) Expected logs include:
   [NestFactory] Starting Nest application...
   [TypeOrmModule] Connected to the database
   [NestApplication] Nest application successfully started
   HTTP server listening on http://localhost:3000
   Swagger UI available at http://localhost:3000/api

Technical considerations:
- synchronize: true is enabled for faster local development and will be disabled in production in favor of migrations.
- autoLoadEntities: true lets TypeORM auto-register entities from imported modules as we build features (Users, Lists, Cards, etc.).
- The uuid-ossp extension is created by database/init.sql; entities can use type: 'uuid' with default: () => "uuid_generate_v4()".
- PowerShell note: use $env:VAR="value" and semicolons to chain; the CMD syntax set "VAR=value" && ... is not valid in PowerShell.
- IPv6 addresses like http://[::1]:3000 in logs are normal; http://localhost:3000 works the same.
- Swagger is exposed at /api and uses French texts for UI (title, description, auth description) while keeping code/logs in English to enforce language separation.

## Latest updates — Health endpoint /health/db (2025-09-15)

What we implemented:
- Added HealthModule (controller + service) with GET /health/db.
- Controller annotated with French Swagger metadata (summary/description) per language policy.
- Service uses TypeORM DataSource to run SELECT 1 and returns { status: "ok", details: { database: "up" } } on success.

How to verify locally:
1) Ensure the NestJS dev server is running (see previous section).
2) In a terminal, run: curl http://localhost:3000/health/db
3) Expected JSON response: {"status":"ok","details":{"database":"up"}}
4) You should also see the /health/db endpoint listed in Swagger at http://localhost:3000/api.

Technical considerations:
- The HealthModule is registered in AppModule so it loads with the app.
- This endpoint is intentionally unauthenticated for now to simplify readiness checks; we can add auth later if needed and keep an unauthenticated /health/ready for infra.

## Quick test — Users endpoint (2025-09-15)

What we verified:
- Database connectivity via GET /health/db returns {"status":"ok","details":{"database":"up"}}
- Creating a user via POST /users returns a record without passwordHash and with roles defaulting to ["user"].

PowerShell examples:
- Health check:
  Invoke-RestMethod -Uri http://localhost:3000/health/db -Method GET | ConvertTo-Json -Depth 5
- Create user:
  $body = @{ email = "test.user+1@example.com"; password = "Password123!" } | ConvertTo-Json
  Invoke-RestMethod -Uri http://localhost:3000/users -Method POST -ContentType 'application/json' -Body $body | ConvertTo-Json -Depth 5

Notes:
- Email must be unique; duplicate creation returns 409 Conflict.
- Password is validated (min length 8) and stored as bcrypt hash.

## Next steps (updated)

- Create a Dockerfile for the NestJS app and wire a nest service into docker-compose with dependencies on postgres and a proper healthcheck/wait strategy.
- Scaffold domain modules and entities: Auth, Users, Lists, Cards; define relations and CRUD endpoints with validation and guards.
- Introduce environment configuration via @nestjs/config with schema validation and .env files per environment.
- Add TypeORM migrations and disable synchronize outside local dev.
- Add tests (unit/e2e) and optional fixtures for API testing.

## Latest updates — Authentication + JWT protection (2025-09-15)

What we implemented:
- Added AuthModule with endpoints: POST /auth/register and POST /auth/login.
- Implemented JwtStrategy and a JwtAuthGuard; protected Users endpoints (GET /users, GET /users/:id, PATCH /users/:id, DELETE /users/:id).
- Kept POST /users public to allow initial user creation (useful for bootstrapping).
- Swagger is configured with Bearer auth; you can authorize in the UI and call protected routes.

Security notes:
- JWT payload contains sub (user id), email, and roles; configurable expiration via JWT_EXPIRES_IN.
- Never commit real secrets; set JWT_SECRET via environment variables in non-dev environments.

## Quick tests — Auth and Users endpoints (2025-09-15)

Env vars (set in your shell or .env):
- JWT_SECRET: secret used to sign tokens (default dev_secret_change_me)
- JWT_EXPIRES_IN: token lifetime (default 1h)

PowerShell examples:

1) Register and login
$reg = @{ email = "test.user+e2e@example.com"; password = "Password123!" } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:3000/auth/register -Method POST -ContentType 'application/json' -Body $reg | ConvertTo-Json -Depth 5
$loginBody = @{ email = "test.user+e2e@example.com"; password = "Password123!" } | ConvertTo-Json
$login = Invoke-RestMethod -Uri http://localhost:3000/auth/login -Method POST -ContentType 'application/json' -Body $loginBody
$token = $login.access_token

2) Access protected list of users
Invoke-RestMethod -Uri http://localhost:3000/users -Method GET -Headers @{ Authorization = "Bearer $token" } | ConvertTo-Json -Depth 5

3) Get/update/delete a user
# Replace <id> with the id returned by register
Invoke-RestMethod -Uri http://localhost:3000/users/<id> -Method GET -Headers @{ Authorization = "Bearer $token" } | ConvertTo-Json -Depth 5
$patch = @{ roles = @('user','manager'); password = 'NewPassword123!' } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:3000/users/<id> -Method PATCH -ContentType 'application/json' -Headers @{ Authorization = "Bearer $token" } -Body $patch | ConvertTo-Json -Depth 5

4) Login with new password
$login2Body = @{ email = "test.user+e2e@example.com"; password = "NewPassword123!" } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:3000/auth/login -Method POST -ContentType 'application/json' -Body $login2Body | ConvertTo-Json -Depth 5

5) Public create + authorized delete (throwaway user)
$pub = @{ email = "trash.user+e2e@example.com"; password = "Password123!" } | ConvertTo-Json
$created = Invoke-RestMethod -Uri http://localhost:3000/users -Method POST -ContentType 'application/json' -Body $pub
Invoke-RestMethod -Uri ("http://localhost:3000/users/" + $created.id) -Method DELETE -Headers @{ Authorization = "Bearer $token" }

Expected behaviors:
- GET /users without Authorization header returns 401 Unauthorized.
- Duplicate register (same email) returns 409 Conflict.
- GET for a deleted/nonexistent user returns 404 Not Found.
- Root path GET / currently returns 404 (no root controller wired by design).
- Swagger UI: http://localhost:3000/api and raw JSON: http://localhost:3000/api-json.
- Health DB check: GET http://localhost:3000/health/db returns {"status":"ok","details":{"database":"up"}}.

## Tooling updates — TypeScript config and tests (2025-09-15)

What changed:
- Switched TypeScript module settings to CommonJS with classic node resolution for the Nest app.
  - tsconfig.json: "module": "CommonJS", "moduleResolution": "node" (removed resolvePackageJsonExports)
- Reason: avoid editor/resolution friction for extensionless relative imports and align with Nest defaults.

How to validate locally:
- Type-check (build config, excludes tests):
  npx tsc -p tsconfig.build.json --noEmit
- Full build:
  npm run build
- If your editor still shows stale errors, restart the TypeScript server and the dev process (npm run start:dev).

E2E tests note (supertest import):
- If you run type-check across tests and see “namespace-style import is not callable” for supertest, use default import:
  import request from 'supertest'
  // instead of: import * as request from 'supertest'

## Smoke test checklist (2025-09-15)

Run after the app is up (http://localhost:3000):
- GET /health/db → 200 OK, { status: "ok", details: { database: "up" } }
- POST /auth/register → 201 Created, returns user (no passwordHash)
- POST /auth/login → 200 OK, returns { access_token, user }
- GET /users (no Authorization) → 401 Unauthorized
- GET /users (with Bearer token) → 200 OK, returns list
- GET /users/:id (with Bearer token) → 200 OK, returns user
- PATCH /users/:id (with Bearer token; roles/password) → 200 OK, returns updated user
- POST /users (public) → 201 Created, returns user
- DELETE /users/:id (with Bearer token) → 200 OK, returns { deleted: true }
- GET /users/:id (after delete) → 404 Not Found
- Swagger UI → http://localhost:3000/api (Authorize with Bearer token)
- OpenAPI JSON → http://localhost:3000/api-json
- Root / → 404 Not Found (intentional until root controller is wired)

Security reminders:
- Never commit real secrets. Set JWT_SECRET and DB_* via environment variables.
- Keep synchronize: true only for local dev; prefer migrations for shared/test/prod.

## Docker Compose — Postgres + NestJS (2025-09-15)

Services et ports
- postgres → expose 5432 (host:5432)
- nestjs-api → expose 3000 dans le conteneur, mappé sur host:3001
- symfony-api → host:3002 (optionnel)
- springboot-api → host:3003 (optionnel)
- nginx → host:80 (optionnel; nécessite un fichier nginx.conf à la racine)

Lancer uniquement Postgres et NestJS
- docker compose up -d postgres nestjs-api
- Attendez que postgres soit "healthy", puis accédez à l'API NestJS sur http://localhost:3001
- Swagger: http://localhost:3001/api

Variables d'environnement utilisées par NestJS
- Dans le code (TypeORM), les noms suivants sont acceptés (DB_* ou DATABASE_*):
  - DB_HOST / DATABASE_HOST (défaut: localhost)
  - DB_PORT / DATABASE_PORT (défaut: 5432)
  - DB_USER / DATABASE_USER (défaut: kanban_user)
  - DB_PASSWORD / DATABASE_PASSWORD (défaut: kanban_password)
  - DB_NAME / DATABASE_NAME (défaut: kanban_api)
- En local (sans Docker), créez .env avec ces clés; en Docker Compose, elles sont injectées via le service nestjs-api.

Notes nginx
- Le service nginx du docker-compose attend un fichier ./nginx.conf. Si vous ne l'avez pas, commentez le service nginx dans docker-compose.yml ou ajoutez votre propre configuration.

Astuce
- Si vous développez en dehors de Docker: l'API écoute sur http://localhost:3000 par défaut (PORT variable). Via Docker Compose: http://localhost:3001.

Note Dockerfile NestJS
- Le service nestjs-api du docker-compose suppose un fichier ./nestjs-implementation/Dockerfile. S'il est absent, commentez ce service dans docker-compose.yml ou ajoutez un Dockerfile minimal avant d'exécuter docker compose up.

## Vérification du endpoint racine (Hello World)

- En mode local (npm run start:dev): ouvrez http://localhost:3000/ et vérifiez que la réponse est exactement: Hello World!
- En mode Docker Compose: ouvrez http://localhost:3001/ (port mappé) et vérifiez la même réponse.
- Cette réponse est fournie par AppController.getHello() et AppService.getHello().

## Rappels Swagger (FR)

- L’UI Swagger est exposée sur /api avec titres/descriptions en français.
- Local: http://localhost:3000/api
- Docker Compose: http://localhost:3001/api