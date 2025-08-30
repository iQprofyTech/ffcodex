import { useUserStore } from '../store';

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = useUserStore.getState().token;
  const res = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export type CreateJobBody = {
  type: 'TextGen' | 'ImageGen' | 'VideoGen' | 'AudioGen';
  model: string;
  prompt: string;
  inputs?: any[];
  aspectRatio?: string;
}

