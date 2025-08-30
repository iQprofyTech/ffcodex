import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import { useMemo } from 'react';
import TextNode from '../components/nodes/TextNode';
import ImageNode from '../components/nodes/ImageNode';
import VideoNode from '../components/nodes/VideoNode';
import AudioNode from '../components/nodes/AudioNode';

const nodeTypes = { TextNode, ImageNode, VideoNode, AudioNode } as const;

export default function CanvasPage() {
  const initial = useMemo(() => ([
    { id: 'n1', type: 'VideoNode', position: { x: 40, y: 20 }, data: {} },
    { id: 'n2', type: 'TextNode', position: { x: 460, y: 20 }, data: {} },
    { id: 'n3', type: 'ImageNode', position: { x: 40, y: 280 }, data: {} },
    { id: 'n4', type: 'AudioNode', position: { x: 460, y: 280 }, data: {} }
  ]), []);

  return (
    <div className="h-[calc(100vh-80px)] rounded-xl overflow-hidden glass">
      <ReactFlow defaultNodes={initial} defaultEdges={[]} nodeTypes={nodeTypes as any} fitView>
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
