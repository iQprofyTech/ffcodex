import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 8080),
  apiOrigin: process.env.API_ORIGIN || 'http://localhost:8080',
  webOrigin: process.env.WEB_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  n8n: {
    baseUrl: process.env.N8N_BASE_URL || 'http://localhost:5678',
    jobWebhook: process.env.N8N_JOB_WEBHOOK || '/webhook/jobs/execute'
  },
  minio: {
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: Number(process.env.MINIO_PORT || 9000),
    useSSL: process.env.MINIO_USE_SSL === 'true' ? true : false,
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    bucket: process.env.MINIO_BUCKET || 'flowforge'
  }
};

