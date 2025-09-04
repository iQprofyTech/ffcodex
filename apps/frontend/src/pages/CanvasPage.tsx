import ReactFlow, { Background, Controls, MiniMap, addEdge, applyEdgeChanges, applyNodeChanges, Connection, Edge, Node, OnEdgesChange, OnNodesChange } from 'reactflow';
import { useCallback, useMemo, useState } from 'react';
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
  const [nodes, setNodes] = useState<Node[]>(() => (project?.nodes as any) || []);
  const [edges, setEdges] = useState<Edge[]>(() => (project?.edges as any) || []);

  const save = useCallback((n: Node[], e: Edge[]) => {
    if (!id) return;
    useProjectsStore.setState(s => ({
      projects: s.projects.map(p => p.id === id ? { ...p, nodes: n, edges: e } : p)
    }));
  }, [id]);

  const onNodesChange: OnNodesChange = useCallback((changes) => {
    setNodes((nds) => {
      const next = applyNodeChanges(changes, nds);
      save(next, edges);
      return next;
    });
  }, [edges, save]);

  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    setEdges((eds) => {
      const next = applyEdgeChanges(changes, eds);
      save(nodes, next);
      return next;
    });
  }, [nodes, save]);

  // Constraints
  const maxNodes = 144;
  const maxIncoming = 12;

  const hasCycle = (allNodes: Node[], allEdges: Edge[], newConn?: {source: string; target: string}) => {
    const adj: Record<string, string[]> = {};
    for (const n of allNodes) adj[n.id] = [];
    for (const e of allEdges) if (e.source && e.target) adj[e.source].push(e.target);
    if (newConn) adj[newConn.source]?.push(newConn.target);
    const visiting = new Set<string>();
    const visited = new Set<string>();
    const dfs = (v: string): boolean => {
      visiting.add(v);
      for (const u of adj[v] || []) {
        if (visiting.has(u)) return true;
        if (!visited.has(u)) {
          if (dfs(u)) return true;
        }
      }
      visiting.delete(v); visited.add(v); return false;
    };
    return allNodes.some(n => !visited.has(n.id) && dfs(n.id));
  };

  const onConnect = useCallback((conn: Connection) => {
    if (!conn.source || !conn.target) return;
    if (conn.source === conn.target) return alert('Нельзя соединять узел с самим собой');
    // limit incoming
    const incoming = edges.filter(e => e.target === conn.target).length;
    if (incoming >= maxIncoming) return alert('Максимум 12 входящих связей на узел');
    // no duplicates
    if (edges.some(e => e.source === conn.source && e.target === conn.target)) return;
    // no cycles
    if (hasCycle(nodes, edges, { source: conn.source, target: conn.target })) return alert('Циклы не допускаются');
    setEdges((eds) => {
      const next = addEdge({ ...conn, animated: false }, eds);
      save(nodes, next);
      return next;
    });
  }, [edges, nodes, save]);

  function Toolbar() {
    const add = (type: string) => {
      if (nodes.length >= maxNodes) { alert('Максимум 144 узла на холсте'); return; }
      const newNode: Node = {
        id: crypto.randomUUID(),
        type: `${type}Node` as any,
        position: { x: 40 + Math.random()*200, y: 40 + Math.random()*200 },
        data: {}
      };
      const next = [...nodes, newNode];
      setNodes(next); save(next, edges);
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
      <ReactFlow 
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes as any}
        fitView
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
