import { Handle, NodeProps, Position } from 'reactflow';
import { useEffect, useState } from 'react';
import PaywallDialog from '../PaywallDialog';
import { useModels, useRunGuard, runJob, pollJob } from './common';

export default function ImageNode({ id }: NodeProps) {
  const models = useModels('ImageGen');
  const [model, setModel] = useState(models[0] || 'sdxl');
  const [prompt, setPrompt] = useState('"Граффити в неоновом стиле"');
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
    <div className={`glass rounded-xl p-3 w-[360px] ${running ? 'ring-2 ring-sky-300 animate-pulse' : ''}`}>
      <div className="text-sm font-semibold mb-2">Image Generation</div>
      <div className="flex gap-2 mb-2 items-center">
        <select className="bg-slate-800 rounded px-2 py-1" value={aspectRatio} onChange={(e) => setAR(e.target.value)}>
          {['1:1','16:9','9:16','4:3'].map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <select className="bg-slate-800 rounded px-2 py-1" value={model} onChange={(e) => setModel(e.target.value)}>
          {models.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <button className="px-2 py-1 rounded bg-emerald-400 text-slate-900 font-semibold" onClick={() => guardRun(execute)}>Run</button>
      </div>
      <textarea className="w-full bg-slate-800 rounded p-2 mb-2" rows={3} value={prompt} onChange={(e)=>setPrompt(e.target.value)} />
      {url ? <img src={url} className="w-full rounded" /> : <div className="text-xs opacity-60">Предпросмотр появится здесь</div>}
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
      <PaywallDialog open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </div>
  );
}
