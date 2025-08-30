import { useEffect, useState } from 'react';
import { api, CreateJobBody } from '../../lib/api';
import { useUserStore } from '../../store';

export function useModels(type: CreateJobBody['type']) {
  const [models, setModels] = useState<string[]>([]);
  useEffect(() => {
    api<{ type: string; models: string[] } | { catalog: Record<string, string[]> }>(`/api/models?type=${type}`)
      .then((res: any) => setModels(res.models || []))
      .catch(() => setModels([]));
  }, [type]);
  return models;
}

export function useRunGuard() {
  const { freeUses, subscribed, incUses } = useUserStore();
  const [paywallOpen, setPaywallOpen] = useState(false);
  function guardRun(run: () => void) {
    if (!subscribed && freeUses >= 3) {
      setPaywallOpen(true);
      return;
    }
    incUses();
    run();
  }
  return { guardRun, paywallOpen, setPaywallOpen };
}

export async function runJob(body: CreateJobBody): Promise<string> {
  const res = await api<{ id: string; status: string }>(`/api/jobs`, { method: 'POST', body: JSON.stringify(body) });
  return res.id;
}

export async function pollJob(id: string): Promise<{ status: string; resultUrl?: string }>{
  const res = await api<{ id: string; status: string; resultUrl?: string }>(`/api/jobs/${id}`);
  return res;
}

