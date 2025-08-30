export type ProviderType = 'text' | 'image' | 'video' | 'audio';

export interface JobPayload {
  type: 'TextGen' | 'ImageGen' | 'VideoGen' | 'AudioGen';
  model: string;
  prompt: string;
  inputs?: any[];
  aspectRatio?: string;
}

export interface IAIProvider {
  id: string;
  type: ProviderType;
  supports(model: string): boolean;
  prepare(job: JobPayload): Record<string, any>;
  parse(result: any): { url?: string; text?: string };
}

