import { IAIProvider, JobPayload } from './IAIProvider.js';

export const SunoTTSProvider: IAIProvider = {
  id: 'suno-tts',
  type: 'audio',
  supports: (model: string) => ['suno-v4','suno-v3.5','tts-generic'].includes(model),
  prepare: (job: JobPayload) => ({ provider: 'suno-tts', ...job }),
  parse: (result: any) => ({ url: result?.url })
};
