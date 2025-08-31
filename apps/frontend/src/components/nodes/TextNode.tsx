import { Handle, NodeProps, Position } from 'reactflow';
import { useEffect, useState } from 'react';
import PaywallDialog from '../PaywallDialog';
import { useModels, useRunGuard, runJob, pollJob } from './common';
import { Trash2, Settings, Copy } from 'lucide-react';

export default function TextNode({ id }: NodeProps) {
  const models = useModels('TextGen');
  const [model, setModel] = useState(models[0]);
  const [prompt, setPrompt] = useState('Напиши промпт...');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string>('');
  useEffect(() => { if (!model && models.length) setModel(models[0]); }, [models]);
  const { guardRun, paywallOpen, setPaywallOpen } = useRunGuard();

  async function execute() {
    setRunning(true);
    try {
      const jobId = await runJob({ type: 'TextGen', model: model || models[0], prompt });
      let status = 'queued';
      while (status === 'queued' || status === 'running') {
        const s = await pollJob(jobId);
        status = s.status;
        if (status === 'succeeded' && s.resultUrl) setResult(`Result URL: ${s.resultUrl}`);
        if (status !== 'succeeded') await new Promise(r => setTimeout(r, 500));
      }
    } finally { setRunning(false); }
  }

  return (
    <div className={`glass rounded-2xl p-4 w-[420px] ${running ? 'ring-2 ring-sky-300 animate-pulse' : ''}`}>
      <div className="flex items-center justify-between mb-2 text-sm">
        <div className="font-semibold">Text</div>
        <div className="flex items-center gap-2 opacity-70">
          <button title="Delete"><Trash2 size={16}/></button>
          <button title="Duplicate"><Copy size={16}/></button>
          <button title="Settings"><Settings size={16}/></button>
          <select className="px-2 py-1 rounded border bg-white" value={model} onChange={(e) => setModel(e.target.value)}>
            {models.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
      <div className="mb-2 min-h-[100px] flex items-center justify-center border rounded-2xl bg-white/60 text-xs opacity-60">Preview will appear here</div>
      <textarea className="w-full bg-white rounded-lg border p-3 mb-2" rows={4} value={prompt} onChange={(e)=>setPrompt(e.target.value)} placeholder="Enter your prompt here..." />
      <div className="flex justify-end">
        <button className="px-4 py-2 rounded-lg bg-emerald-500 text-white" onClick={() => guardRun(execute)}>Generate</button>
      </div>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
      <PaywallDialog open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </div>
  );
}
