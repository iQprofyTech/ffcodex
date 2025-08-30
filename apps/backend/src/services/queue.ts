import { Queue, QueueEvents, Worker } from 'bullmq';
import { config } from '../config';
import { randomUUID } from 'node:crypto';
import { resolveProvider } from '../adapters';

const connection = { connection: { url: config.redisUrl } } as const;

export const queues = {
  jobs: new Queue('jobs', connection)
};

export function startLocalWorker() {
  // Simple local worker for dev. In production, use apps/worker service.
  const worker = new Worker('jobs', async (job) => {
    // Dev-only minimal worker: resolve provider and pretend to call n8n
    const provider = resolveProvider(job.data.model);
    if (!provider) {
      throw new Error('No provider for model');
    }
    const payload = provider.prepare(job.data);
    // Simulate delay and fabricated result
    await new Promise((r) => setTimeout(r, 500));
    return { url: `${config.apiOrigin}/mock/${randomUUID()}`, provider: provider.id, payload };
  }, connection);

  const events = new QueueEvents('jobs', connection);
  events.on('completed', ({ jobId }) => {
    console.log('Job completed', jobId);
  });
  events.on('failed', ({ jobId, failedReason }) => {
    console.error('Job failed', jobId, failedReason);
  });
  return { worker, events };
}
