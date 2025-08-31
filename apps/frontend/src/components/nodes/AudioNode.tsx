import { Handle, NodeProps, Position } from 'reactflow';
import { useEffect, useRef, useState } from 'react';
import PaywallDialog from '../PaywallDialog';
import { useModels, useRunGuard, runJob, pollJob, UploadButton } from './common';
import { Trash2, Settings, Copy, Mic } from 'lucide-react';

export default function AudioNode({ id }: NodeProps) {
  const models = useModels('AudioGen');
  const [model, setModel] = useState(models[0] || 'suno-v4');
  const [prompt, setPrompt] = useState('Описать жанр/настроение/темп');
  const [running, setRunning] = useState(false);
  const [url, setUrl] = useState<string>('');
  useEffect(() => { if (!model && models.length) setModel(models[0]); }, [models]);
  const { guardRun, paywallOpen, setPaywallOpen } = useRunGuard();
  const [recording, setRecording] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);

  async function execute() {
    setRunning(true);
    try {
      const jobId = await runJob({ type: 'AudioGen', model: model || 'suno-v4', prompt });
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
      <div className="flex items-center justify-between mb-2 text-sm">
        <div className="font-semibold">Audio</div>
        <div className="flex items-center gap-2 opacity-70">
          <button title="Delete"><Trash2 size={16}/></button>
          <button title="Duplicate"><Copy size={16}/></button>
          <button title="Settings"><Settings size={16}/></button>
          <select className="px-2 py-1 rounded border bg-white" value={model} onChange={(e) => setModel(e.target.value)}>
            {models.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
      <div className="mb-3 min-h-[120px] flex flex-col items-center justify-center gap-2 border rounded-2xl bg-white/60">
        {url ? <audio src={url} controls className="w-full" /> : <div className="text-xs opacity-60">Preview will appear here</div>}
        <div className="flex gap-2">
          <UploadButton accept="audio/*" onUploaded={(u)=>setUrl(u)} />
          <button className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg border bg-white ${recording?'bg-rose-50 border-rose-300':''}`} onClick={async ()=>{
            if (recording) { mediaRef.current?.stop(); setRecording(false); return; }
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mr = new MediaRecorder(stream);
            mediaRef.current = mr; setRecording(true);
            const chunks: BlobPart[] = [];
            mr.ondataavailable = (e) => chunks.push(e.data);
            mr.onstop = async () => {
              const file = new File(chunks, 'record.webm', { type: 'audio/webm' });
              const fd = new FormData(); fd.append('file', file);
              const res = await fetch('/api/upload', { method:'POST', body: fd });
              const data = await res.json(); if (data?.url) setUrl(data.url);
              stream.getTracks().forEach(t=>t.stop());
            };
            mr.start();
          }}><Mic size={16}/> {recording?'Stop':'Record'}</button>
        </div>
      </div>
      <textarea className="w-full bg-white rounded-lg border p-3 mb-2" rows={3} value={prompt} onChange={(e)=>setPrompt(e.target.value)} placeholder="Describe genre/mood/tempo..." />
      <div className="flex justify-end">
        <button className="px-4 py-2 rounded-lg bg-emerald-500 text-white" onClick={() => guardRun(execute)}>Generate</button>
      </div>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
      <PaywallDialog open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </div>
  );
}
