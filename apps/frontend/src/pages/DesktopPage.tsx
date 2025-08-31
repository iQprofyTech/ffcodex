import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProjectsStore, Project } from '../store';
import { MoreHorizontal, Pencil, Copy, Trash2, Image as Img } from 'lucide-react';

export default function DesktopPage() {
  const { projects, addProject, ensureDefault } = useProjectsStore();
  const navigate = useNavigate();
  useEffect(() => ensureDefault(), [ensureDefault]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Рабочий стол</h2>
        <button className="px-3 py-2 rounded-lg bg-emerald-400 text-slate-900 font-semibold" onClick={() => {
          const id = addProject();
          navigate(`/project/${id}`);
        }}>Новый проект</button>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects.map((p) => <Card key={p.id} p={p} />)}
      </div>
    </div>
  );
}

function Card({ p }: { p: Project }) {
  const navigate = useNavigate();
  const { updateProject, addProject } = useProjectsStore();
  const [menu, setMenu] = useState(false);
  const thumb = useMemo(() => {
    // Берём первый preview из узлов, если появится.
    return (p as any).previewURL || '';
  }, [p]);
  return (
    <div className="glass rounded-xl p-3 hover:ring-2 hover:ring-sky-300">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold truncate" title={p.name}>{p.name}</div>
        <button className="p-1" onClick={()=>setMenu(v=>!v)}><MoreHorizontal size={16}/></button>
      </div>
      <div className="aspect-square rounded-lg border bg-white/60 mb-2 flex items-center justify-center">
        {thumb ? <img src={thumb} className="w-full h-full object-cover rounded-lg"/> : <div className="text-xs opacity-60 flex items-center gap-1"><Img size={16}/> Preview</div>}
      </div>
      <div className="text-xs opacity-70 mb-2">{new Date(p.createdAt).toLocaleDateString()} • {p.nodes.length} нод(ы)</div>
      <button className="w-full px-3 py-2 rounded-lg bg-slate-900 text-white" onClick={()=>navigate(`/project/${p.id}`)}>Открыть</button>
      {menu && (
        <div className="mt-2 text-sm bg-white border rounded-lg p-2 flex items-center gap-3">
          <button className="inline-flex items-center gap-1" onClick={() => {
            const name = prompt('Новое имя проекта', p.name) || p.name;
            updateProject(p.id, { name });
            setMenu(false);
          }}><Pencil size={14}/> Переименовать</button>
          <button className="inline-flex items-center gap-1" onClick={() => {
            const id = crypto.randomUUID();
            const copy = JSON.parse(JSON.stringify(p));
            (copy as any).id = id; (copy as any).name = `${p.name} (copy)`; (copy as any).createdAt = Date.now();
            useProjectsStore.setState(s => ({ projects: [copy, ...s.projects] }));
            setMenu(false);
          }}><Copy size={14}/> Дублировать</button>
          <button className="inline-flex items-center gap-1 text-rose-600" onClick={() => {
            useProjectsStore.setState(s => ({ projects: s.projects.filter(pp => pp.id !== p.id) }));
            setMenu(false);
          }}><Trash2 size={14}/> Удалить</button>
        </div>
      )}
    </div>
  );
}
