import { IAIProvider, JobPayload } from './IAIProvider.js';

export const ModelScopeT2VProvider: IAIProvider = {
  id: 'modelscope-t2v',
  type: 'video',
  supports: (model: string) => ['modelscope-t2v'].includes(model),
  prepare: (job: JobPayload) => ({ provider: 'modelscope-t2v', ...job }),
  parse: (result: any) => ({ url: result?.url })
};
