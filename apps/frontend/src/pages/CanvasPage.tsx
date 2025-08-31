import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import { useMemo } from 'react';
import TextNode from '../components/nodes/TextNode';
import ImageNode from '../components/nodes/ImageNode';
import VideoNode from '../components/nodes/VideoNode';
import AudioNode from '../components/nodes/AudioNode';
import { useParams } from 'react-router-dom';
import { useProjectsStore } from '../store';
import { Image as ImgIcon, Type, Video as VideoIcon, Music2 } from 'lucide-react';

const nodeTypes = { TextNode, ImageNode, VideoNode, AudioNode } as const;

export default function CanvasPage() {
  const { id } = useParams();
  const project = useProjectsStore((s) => (id ? s.getProject(id) : undefined));
  const nodes = useMemo(() => project?.nodes || [
    { id: 't1', type: 'TextNode', position: { x: 460, y: 40 }, data: {} },
    { id: 'i1', type: 'ImageNode', position: { x: 40, y: 40 }, data: {} }
  ], [project]);
  const edges = project?.edges || [];

  function Toolbar() {
    const add = (type: string) => {
      useProjectsStore.setState(s => ({
        projects: s.projects.map(p => p.id===id ? {
          ...p,
          nodes: [...p.nodes, { id: crypto.randomUUID(), type: `${type}Node`, position: { x: 40 + Math.random()*200, y: 40 + Math.random()*200 }, data: {} }]
        } : p)
      }));
    };
    return (
      <div className="absolute left-1/2 -translate-x-1/2 top-4 z-10 glass rounded-full px-3 py-2 flex items-center gap-3">
        <button title="Text" onClick={()=>add('Text')}><Type size={18}/></button>
        <button title="Image" onClick={()=>add('Image')}><ImgIcon size={18}/></button>
        <button title="Video" onClick={()=>add('Video')}><VideoIcon size={18}/></button>
        <button title="Audio" onClick={()=>add('Audio')}><Music2 size={18}/></button>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-80px)] rounded-xl overflow-hidden glass">
      <Toolbar />
      <ReactFlow defaultNodes={nodes} defaultEdges={edges} nodeTypes={nodeTypes as any} fitView>
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
