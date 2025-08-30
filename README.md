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
2) Install deps at root with your preferred package manager (npm/yarn/pnpm).
3) Run API: `npm run dev:backend` (expects Node 18+). In dev, `/api/auth/telegram` accepts any `initData` when `TELEGRAM_BOT_TOKEN` is empty.
4) Run FE: `npm run dev:frontend` (Vite on http://localhost:5173, proxies `/api`).

Docker (all-in-one, recommended for staging)
- See `infra/docker-compose.yml`. Services: postgres, redis, minio, n8n, backend, worker, frontend, reverse-proxy.
- Build & start: `docker compose -f infra/docker-compose.yml up -d --build`

API Contracts (MVP)
- POST `/api/jobs` — Create a job (text/image/video/audio). Validates via Zod.
- GET `/api/jobs/:id` — Get job status/result.
- GET `/api/models` — List available models by type.
- POST `/api/upload` — Upload asset to MinIO (stub in dev).
- POST `/api/auth/telegram` — Validate Telegram initData → JWT.

Notes
- All heavy model calls should be routed via n8n webhooks from the worker.
- This skeleton favors clarity over completeness; extend adapters under `apps/backend/src/adapters` and `apps/worker/src/executors`.
- Frontend canvas (`apps/frontend`) uses React Flow; nodes for Text/Image/Video/Audio with model/aspect selectors, prompt field, run button, and базовый пэйволл (3 бесплатные генерации).
