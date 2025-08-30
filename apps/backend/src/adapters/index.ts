import { IAIProvider } from './IAIProvider.js';
import { GeminiProvider } from './gemini.js';
import { SDXLProvider } from './sdxl.js';
import { ModelScopeT2VProvider } from './modelscope.js';
import { SunoTTSProvider } from './suno.js';

export const providers: IAIProvider[] = [
  GeminiProvider,
  SDXLProvider,
  ModelScopeT2VProvider,
  SunoTTSProvider
];

export function resolveProvider(model: string) {
  return providers.find((p) => p.supports(model));
}
