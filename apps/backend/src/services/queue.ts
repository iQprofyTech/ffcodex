import { Queue, QueueEvents, Worker } from 'bullmq';
import { config } from '../config.js';
import { randomUUID } from 'node:crypto';
import { resolveProvider } from '../adapters/index.js';

const connection = { connection: { url: config.redisUrl } } as const;

export const queues = {
  jobs: new Queue('jobs', connection)
};

export function startLocalWorker() {
  // Simple local worker for dev. In production, use apps/worker service.
  const worker = new Worker('jobs', async (job) => {
    // Dev-only minimal worker: simulate provider + return previewable placeholders
    const provider = resolveProvider(job.data.model);
    if (!provider) throw new Error('No provider for model');
    const payload = provider.prepare(job.data);
    await new Promise((r) => setTimeout(r, 400));

    let url = `${config.apiOrigin}/mock/${randomUUID()}`;
    const t = job.data.type as string;
    if (t === 'ImageGen') {
      const svg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='640' height='640'><rect width='100%' height='100%' fill='#0b1020'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#e9eefc' font-size='28' font-family='Arial'>Mock Image</text></svg>`);
      url = `data:image/svg+xml;utf8,${svg}`;
    } else if (t === 'TextGen') {
      const text = `Mock text for prompt: ${job.data.prompt}`;
      url = `data:text/plain;base64,${Buffer.from(text).toString('base64')}`;
    } else if (t === 'VideoGen') {
      url = 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4';
    } else if (t === 'AudioGen') {
      url = 'https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav';
    }
    return { url, provider: provider.id, payload };
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
