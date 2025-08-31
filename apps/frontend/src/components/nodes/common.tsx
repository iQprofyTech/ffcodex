import { useEffect, useMemo, useState } from 'react';
import { api, CreateJobBody } from '../../lib/api';
import { useUserStore, useProjectsStore } from '../../store';
import { Upload } from 'lucide-react';

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

export function useUpdateNodePreview(projectId?: string, nodeId?: string) {
  const updateProject = useProjectsStore((s) => s.updateProject);
  return (url?: string) => {
    if (!projectId || !nodeId) return;
    updateProject(projectId, {
      nodes: (prev => prev) as any // placeholder to trigger update
    } as any);
  };
}

export function UploadButton({ onUploaded, accept }: { onUploaded: (url: string) => void; accept: string }) {
  const [busy, setBusy] = useState(false);
  const id = useMemo(() => `f_${Math.random().toString(36).slice(2)}`,[ ]);
  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data?.url) onUploaded(data.url);
    } finally { setBusy(false); e.currentTarget.value = ''; }
  }
  return (
    <label htmlFor={id} className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg border bg-white cursor-pointer ${busy?'opacity-60 pointer-events-none':''}`}>
      <Upload size={16} /> Upload
      <input id={id} type="file" accept={accept} className="hidden" onChange={onChange} />
    </label>
  );
}

