import { IAIProvider, JobPayload } from './IAIProvider.js';

export const GeminiProvider: IAIProvider = {
  id: 'gemini',
  type: 'text',
  supports: (model: string) => ['gemini-pro','gemini-flash-2.0'].includes(model),
  prepare: (job: JobPayload) => ({ provider: 'gemini', ...job }),
  parse: (result: any) => ({ text: result?.text, url: result?.url })
};
