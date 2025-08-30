import { IAIProvider, JobPayload } from './IAIProvider';

export const SDXLProvider: IAIProvider = {
  id: 'sdxl',
  type: 'image',
  supports: (model) => ['sdxl'].includes(model),
  prepare: (job: JobPayload) => ({ provider: 'sdxl', ...job }),
  parse: (result: any) => ({ url: result?.url })
};

