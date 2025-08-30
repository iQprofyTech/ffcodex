import { Client } from 'minio';
import { config } from '../config';

let client: Client | null = null;
function getClient() {
  if (!client) {
    client = new Client({
      endPoint: config.minio.endPoint,
      port: config.minio.port,
      useSSL: config.minio.useSSL,
      accessKey: config.minio.accessKey,
      secretKey: config.minio.secretKey
    });
  }
  return client;
}

export async function ensureBucket() {
  try {
    const c = getClient();
    const exists = await c.bucketExists(config.minio.bucket);
    if (!exists) await c.makeBucket(config.minio.bucket);
  } catch (_) {
    // In dev without MinIO, fall back silently
  }
}

export async function uploadBuffer(key: string, buf: Buffer, mime?: string): Promise<string> {
  try {
    const c = getClient();
    await ensureBucket();
    await c.putObject(config.minio.bucket, key, buf, { 'Content-Type': mime || 'application/octet-stream' });
    const url = `${config.minio.useSSL ? 'https' : 'http'}://${config.minio.endPoint}:${config.minio.port}/${config.minio.bucket}/${encodeURIComponent(key)}`;
    return url;
  } catch {
    // Dev fallback: data URL
    const dataUrl = `data:${mime || 'application/octet-stream'};base64,${buf.toString('base64')}`;
    return dataUrl;
  }
}

