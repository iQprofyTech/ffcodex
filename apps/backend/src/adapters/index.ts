import { IAIProvider } from './IAIProvider';
import { GeminiProvider } from './gemini';
import { SDXLProvider } from './sdxl';
import { ModelScopeT2VProvider } from './modelscope';
import { SunoTTSProvider } from './suno';

export const providers: IAIProvider[] = [
  GeminiProvider,
  SDXLProvider,
  ModelScopeT2VProvider,
  SunoTTSProvider
];

export function resolveProvider(model: string) {
  return providers.find((p) => p.supports(model));
}

