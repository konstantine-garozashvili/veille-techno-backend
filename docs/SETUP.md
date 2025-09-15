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

## Next steps

- Scaffold the NestJS API (Auth, Users, Lists, Cards), add a Dockerfile, and wire it to this Postgres service.
- Expose Swagger UI at /api and document endpoints.
- Optionally add API tests, fixtures, and performance/optimization notes.