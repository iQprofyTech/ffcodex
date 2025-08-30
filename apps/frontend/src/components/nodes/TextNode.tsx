import { Handle, NodeProps, Position } from 'react-flow-renderer';
import { useEffect, useState } from 'react';
import PaywallDialog from '../PaywallDialog';
import { useModels, useRunGuard, runJob, pollJob } from './common';

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
    <div className={`glass rounded-xl p-3 w-[360px] ${running ? 'ring-2 ring-sky-300 animate-pulse' : ''}`}>
      <div className="text-sm font-semibold mb-2">Text Generation</div>
      <div className="flex gap-2 mb-2">
        <select className="bg-slate-800 rounded px-2 py-1" value={model} onChange={(e) => setModel(e.target.value)}>
          {models.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <button className="px-2 py-1 rounded bg-emerald-400 text-slate-900 font-semibold" onClick={() => guardRun(execute)}>Run</button>
      </div>
      <textarea className="w-full bg-slate-800 rounded p-2 mb-2" rows={4} value={prompt} onChange={(e)=>setPrompt(e.target.value)} />
      {result && <div className="text-xs opacity-80">{result}</div>}
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
      <PaywallDialog open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </div>
  );
}

