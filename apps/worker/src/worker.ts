import 'dotenv/config';
import { Worker } from 'bullmq';
import fetch from 'node-fetch';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://localhost:5678';
const N8N_JOB_WEBHOOK = process.env.N8N_JOB_WEBHOOK || '/webhook/jobs/execute';

const connection = { connection: { url: REDIS_URL } } as const;

const worker = new Worker('jobs', async (job) => {
  // Forward to n8n webhook; attach job data
  try {
    const res = await fetch(`${N8N_BASE_URL}${N8N_JOB_WEBHOOK}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: job.id, ...job.data })
    });
    if (!res.ok) throw new Error(`n8n ${res.status}`);
    const data = await res.json().catch(() => ({}));
    // Expecting { url } or similar
    return data;
  } catch (e: any) {
    throw e;
  }
}, connection);

worker.on('completed', (j) => console.log('Completed', j.id));
worker.on('failed', (j, err) => console.error('Failed', j?.id, err?.message));

