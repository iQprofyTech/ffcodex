import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import jwt from '@fastify/jwt';
import { z } from 'zod';
import { config } from './config';
import { CreateJobSchema, JobIdParamSchema, ModelsQuerySchema, ModelCatalog, UploadResponseSchema } from '@flow-forge/shared/src/schemas';
import { verifyTelegramInitData, signJwt } from './services/telegram';
import { uploadBuffer } from './services/minio';
import { queues } from './services/queue';

const app = Fastify({ logger: true });

await app.register(cors, { origin: [config.webOrigin], credentials: true });
await app.register(multipart);
await app.register(jwt, { secret: config.jwtSecret });

app.get('/health', async () => ({ ok: true }));

// Telegram Mini App auth: initData -> validate -> JWT
app.post('/api/auth/telegram', async (req, reply) => {
  const body = (req.body ?? {}) as Record<string, string>;
  const initData = body.initData || '';
  if (!initData) return reply.code(400).send({ error: 'Missing initData' });
  try {
    // Dev fallback: if bot token not set and env=development, accept any initData
    const ok = config.telegramBotToken
      ? verifyTelegramInitData(initData, config.telegramBotToken)
      : (config.env === 'development');
    if (!ok) return reply.code(401).send({ error: 'Invalid initData' });
    const token = signJwt({ sub: 'tg-user', scope: 'user' });
    return { token };
  } catch (e: any) {
    req.log.error(e);
    return reply.code(500).send({ error: 'auth_failed' });
  }
});

// Models catalog
app.get('/api/models', async (req, reply) => {
  const q = ModelsQuerySchema.safeParse(req.query);
  if (!q.success) return reply.code(400).send(q.error.issues);
  if (q.data.type) {
    // @ts-ignore index by string key of const object
    return { type: q.data.type, models: ModelCatalog[q.data.type] };
  }
  return { catalog: ModelCatalog };
});

// Create job -> enqueues BullMQ -> worker calls n8n and updates result
app.post('/api/jobs', async (req, reply) => {
  const parsed = CreateJobSchema.safeParse(req.body);
  if (!parsed.success) return reply.code(400).send(parsed.error.issues);
  const jobData = parsed.data;
  const job = await queues.jobs.add('user-job', jobData, { removeOnComplete: 100, removeOnFail: 100 });
  return { id: job.id, status: 'queued' };
});

// Get job status
app.get('/api/jobs/:id', async (req, reply) => {
  const p = JobIdParamSchema.safeParse(req.params);
  if (!p.success) return reply.code(400).send(p.error.issues);
  const job = await queues.jobs.getJob(p.data.id);
  if (!job) return reply.code(404).send({ error: 'not_found' });
  const state = await job.getState();
  const result = job.returnvalue as any;
  return {
    id: job.id,
    status: state === 'completed' ? 'succeeded' : state === 'failed' ? 'failed' : state === 'waiting' || state === 'delayed' ? 'queued' : 'running',
    resultUrl: result?.url,
    error: job.failedReason
  };
});

// Upload to MinIO (multipart/form-data)
app.post('/api/upload', async (req, reply) => {
  const parts: Buffer[] = [];
  const mp = await req.file();
  if (!mp) return reply.code(400).send({ error: 'No file' });
  for await (const chunk of mp.file) parts.push(Buffer.from(chunk));
  const buf = Buffer.concat(parts);
  const key = `${Date.now()}-${mp.filename}`;
  const url = await uploadBuffer(key, buf, mp.mimetype);
  const resp = UploadResponseSchema.parse({ url, key });
  return resp;
});

app.listen({ port: config.port, host: '0.0.0.0' })
  .then(() => app.log.info(`API listening on :${config.port}`))
  .catch((err) => { app.log.error(err); process.exit(1); });
