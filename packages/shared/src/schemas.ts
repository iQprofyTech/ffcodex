import { z } from 'zod';

export const NodeType = z.enum(["TextGen", "ImageGen", "VideoGen", "AudioGen"]);

export const AspectRatio = z.enum(["1:1","16:9","9:16","4:3","3:4","21:9"]);

export const BaseNodeSchema = z.object({
  id: z.string(),
  type: NodeType,
  model: z.string().min(1),
  prompt: z.string().default(''),
  inputs: z.array(z.string()).default([]),
  outputs: z.array(z.string()).default([]),
  status: z.enum(["idle","queued","running","succeeded","failed"]).default("idle"),
  previewURL: z.string().url().optional(),
  aspectRatio: AspectRatio.optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  x: z.number().default(0),
  y: z.number().default(0),
  width: z.number().default(320),
  height: z.number().default(180)
});

export const CreateJobSchema = z.object({
  type: NodeType,
  model: z.string().min(1),
  prompt: z.string().min(1),
  inputs: z.array(z.any()).default([]),
  aspectRatio: AspectRatio.optional()
});

export const JobIdParamSchema = z.object({ id: z.string().uuid("Invalid job id") });

export const JobStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["queued","running","succeeded","failed"]),
  resultUrl: z.string().url().optional(),
  error: z.string().optional()
});

export const ModelsQuerySchema = z.object({
  type: NodeType.optional()
});

export const UploadResponseSchema = z.object({
  url: z.string().url(),
  key: z.string()
});

export type CreateJobInput = z.infer<typeof CreateJobSchema>;
export type JobStatus = z.infer<typeof JobStatusSchema>;

export const ModelCatalog = {
  TextGen: [
    'gpt-4.5', 'gpt-4o', 'claude-3.7', 'deepseek-r1', 'grok-3', 'gemini-pro', 'gemini-flash-2.0', 'llama-3.1-405b'
  ],
  ImageGen: [
    'sdxl', 'flux.1', 'flux.1-editor', 'flux.1-pro', 'flux.1.1-pro', 'flux-ultra', 'gpt-4o-image', 'sora-images', 'ideogram', 'google-imagen-4'
  ],
  VideoGen: [
    'sora', 'runway-gen-4', 'luma-dream-machine', 'kling-2.0', 'google-veo-3', 'higgsfield', 'hailuo-minimax-02', 'seedance', 'lipsync-runway', 'lipsync-kling'
  ],
  AudioGen: [
    'suno-v4', 'suno-v3.5', 'tts-generic'
  ]
} as const;

