import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CourseNode from './CourseNode';
import { useLayoutedGraph } from '../hooks/useLayoutedGraph';
import type { CourseStatus } from '../data/types';

const nodeTypes = { courseNode: CourseNode };

interface FlowChartProps {
  getStatus: (id: string) => CourseStatus;
  arePrereqsMet: (id: string) => boolean;
  toggleStatus: (id: string) => void;
}

export default function FlowChart({ getStatus, arePrereqsMet, toggleStatus }: FlowChartProps) {
  const { nodes: layoutNodes, edges: layoutEdges } = useLayoutedGraph();

  const onToggle = useCallback(
    (id: string) => toggleStatus(id),
    [toggleStatus],
  );

  const nodes: Node[] = useMemo(
    () =>
      layoutNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          status: getStatus(node.id),
          blocked: !arePrereqsMet(node.id),
          onToggle,
        },
      })),
    [layoutNodes, getStatus, arePrereqsMet, onToggle],
  );

  const edges: Edge[] = useMemo(
    () =>
      layoutEdges.map((edge) => {
        const sourceCompleted = getStatus(edge.source) === 'completed';
        return {
          ...edge,
          animated: sourceCompleted,
          style: {
            stroke: sourceCompleted ? '#16a34a' : '#94a3b8',
            strokeWidth: sourceCompleted ? 2.5 : 1.5,
          },
        };
      }),
    [layoutEdges, getStatus],
  );

  return (
    <div className="w-full h-[520px] border border-gray-200 rounded-xl bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        minZoom={0.3}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={20} size={1} color="#e2e8f0" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
