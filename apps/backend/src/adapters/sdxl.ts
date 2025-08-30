import { IAIProvider, JobPayload } from './IAIProvider.js';

export const SDXLProvider: IAIProvider = {
  id: 'sdxl',
  type: 'image',
  supports: (model: string) => ['sdxl'].includes(model),
  prepare: (job: JobPayload) => ({ provider: 'sdxl', ...job }),
  parse: (result: any) => ({ url: result?.url })
};
