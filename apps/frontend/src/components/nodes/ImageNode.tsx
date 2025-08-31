import { Handle, NodeProps, Position } from 'reactflow';
import { useEffect, useState } from 'react';
import PaywallDialog from '../PaywallDialog';
import { useModels, useRunGuard, runJob, pollJob } from './common';

export default function ImageNode({ id }: NodeProps) {
  const models = useModels('ImageGen');
  const [model, setModel] = useState(models[0] || 'sdxl');
  const [prompt, setPrompt] = useState('A vibrant graffiti art style character');
  const [aspectRatio, setAR] = useState('1:1');
  const [running, setRunning] = useState(false);
  const [url, setUrl] = useState<string>('');
  useEffect(() => { if (!model && models.length) setModel(models[0]); }, [models]);
  const { guardRun, paywallOpen, setPaywallOpen } = useRunGuard();

  async function execute() {
    setRunning(true);
    try {
      const jobId = await runJob({ type: 'ImageGen', model: model || 'sdxl', prompt, aspectRatio });
      let status = 'queued';
      while (status === 'queued' || status === 'running') {
        const s = await pollJob(jobId);
        status = s.status;
        if (status === 'succeeded' && s.resultUrl) setUrl(s.resultUrl);
        if (status !== 'succeeded') await new Promise(r => setTimeout(r, 500));
      }
    } finally { setRunning(false); }
  }

  return (
    <div className={`glass rounded-2xl p-4 w-[420px] ${running ? 'ring-2 ring-sky-300 animate-pulse' : ''}`}>
      <div className="toolbar mb-3 text-sm">
        <button className="px-2 py-1 rounded border" onClick={() => { setUrl(''); setPrompt(''); }}>✕</button>
        <select className="px-2 py-1 rounded border bg-white" value={aspectRatio} onChange={(e) => setAR(e.target.value)}>
          {['1:1','16:9','9:16','4:3'].map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <select className="px-2 py-1 rounded border bg-white" value={model} onChange={(e) => setModel(e.target.value)}>
          {['SD3.5','Dall‑E 3','Flux'].map((m) => <option key={m} value={m.toLowerCase()}>{m}</option>)}
        </select>
      </div>
      <div className="text-sm font-semibold mb-2">Image Generation Node</div>
      <div className="mb-3 min-h-[180px] flex items-center justify-center border rounded-2xl bg-white/60">
        {url ? <img src={url} className="w-full rounded-2xl" /> : <div className="text-xs opacity-60">Enter a prompt below to generate</div>}
      </div>
      <div className="flex items-center gap-2">
        <input className="flex-1 px-3 py-2 rounded-lg border bg-white" placeholder={'Try "A vibrant graffiti art style character"'} value={prompt} onChange={(e)=>setPrompt(e.target.value)} />
        <button className="px-3 py-2 rounded-lg bg-slate-900 text-white" onClick={() => guardRun(execute)}>▶</button>
      </div>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
      <PaywallDialog open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </div>
  );
}

