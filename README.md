Flow Forge — Monorepo (MVP Skeleton)

Summary
- Web + Telegram Mini App for cascade content generation (text/image/video/audio).
- FE → BE (Fastify) → n8n (workflow orchestrator) → AI providers.
- This repo contains a runnable skeleton with API stubs, Zod contracts, queues, and infra.

Packages
- apps/backend — Fastify API with Zod validation, Telegram auth verify, jobs API, upload stub.
- apps/worker — BullMQ worker stub that would call n8n webhooks.
- apps/frontend — Placeholder React app (to be expanded with canvas UI).
- packages/shared — Shared Zod schemas and types.
- infra — docker-compose, Nginx config, and service wiring.

Quick Start (dev, without Docker)
1) Create `.env` from `.env.example`. Keep placeholders for secrets.
2) Install deps at root with your preferred package manager (npm/yarn/pnpm) and generate Prisma client if you choose to use DB locally.
3) Run API: `npm -w apps/backend run dev` (expects Node 18+). Frontend is a placeholder.

Docker (all-in-one, recommended for staging)
- See `infra/docker-compose.yml`. Services: postgres, redis, minio, n8n, backend, frontend, nginx.
- Reverse proxy at `https://app.iqprofy.tech` (adjust host and SSL offload as needed).

API Contracts (MVP)
- POST `/api/jobs` — Create a job (text/image/video/audio). Validates via Zod.
- GET `/api/jobs/:id` — Get job status/result.
- GET `/api/models` — List available models by type.
- POST `/api/upload` — Upload asset to MinIO (stub in dev).
- POST `/api/auth/telegram` — Validate Telegram initData → JWT.

Notes
- All heavy model calls should be routed via n8n webhooks from the worker.
- This skeleton favors clarity over completeness; extend adapters under `apps/backend/src/adapters` and `apps/worker/src/executors`.

