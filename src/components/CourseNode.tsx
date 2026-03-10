import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { Course } from '../data/types';

interface CourseNodeData {
  course: Course;
  status: 'default' | 'in_progress' | 'completed';
  blocked: boolean;
  onToggle: (id: string) => void;
  [key: string]: unknown;
}

function CourseNodeComponent({ data }: NodeProps) {
  const { course, status, blocked, onToggle } = data as unknown as CourseNodeData;

  const isMandatory = course.category === 'mandatory';
  const baseColor = isMandatory ? 'bg-blue-500' : 'bg-emerald-500';

  let nodeClass = baseColor;
  let icon = '';
  let extraClass = '';

  if (blocked && status === 'default') {
    nodeClass = isMandatory ? 'bg-blue-500/40' : 'bg-emerald-500/40';
    icon = '\u{1F512}';
    extraClass = 'cursor-not-allowed';
  } else if (status === 'in_progress') {
    nodeClass = isMandatory ? 'bg-blue-500' : 'bg-emerald-500';
    extraClass = 'ring-2 ring-amber-400 animate-pulse cursor-pointer';
    icon = '\u{1F552}';
  } else if (status === 'completed') {
    nodeClass = 'bg-green-700';
    icon = '\u2705';
    extraClass = 'cursor-pointer';
  } else {
    extraClass = 'cursor-pointer';
  }

  const handleClick = () => {
    if (blocked && status === 'default') return;
    onToggle(course.id);
  };

  return (
    <div
      className={`${nodeClass} ${extraClass} text-white rounded-lg px-3 py-2 text-center shadow-md w-[170px] select-none transition-all duration-200`}
      onClick={handleClick}
    >
      <Handle type="target" position={Position.Left} className="!bg-gray-400 !w-2 !h-2" />
      <div className="text-xs font-bold leading-tight">
        {icon && <span className="mr-1">{icon}</span>}
        {course.shortName}
      </div>
      <div className="text-[10px] opacity-80 mt-0.5">{course.hours}h</div>
      {course.semester && (
        <div className="text-[9px] opacity-60">{course.semester}&ordm; Semestre</div>
      )}
      <Handle type="source" position={Position.Right} className="!bg-gray-400 !w-2 !h-2" />
    </div>
  );
}

export default memo(CourseNodeComponent);
