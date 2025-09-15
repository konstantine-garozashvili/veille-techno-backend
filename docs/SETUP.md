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
2) In Windows PowerShell, set env variables and start the app:
   $env:DB_HOST="localhost"; $env:DB_PORT="5432"; $env:DB_USER="kanban_user"; $env:DB_PASSWORD="kanban_password"; $env:DB_NAME="kanban_api"
   cd nestjs-implementation
   npm run start:dev
3) Expected logs include:
   [NestFactory] Starting Nest application...
   Database connection verified (SELECT 1)
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

## Next steps (updated)

- Add a /health/db endpoint that pings the database and returns an explicit status JSON.
- Create a Dockerfile for the NestJS app and wire a nest service into docker-compose with dependencies on postgres and a proper healthcheck/wait strategy.
- Scaffold domain modules and entities: Auth, Users, Lists, Cards; define relations and CRUD endpoints with validation and guards.
- Introduce environment configuration via @nestjs/config with schema validation and .env files per environment.
- Add TypeORM migrations and disable synchronize outside local dev.
- Add tests (unit/e2e) and optional fixtures for API testing.