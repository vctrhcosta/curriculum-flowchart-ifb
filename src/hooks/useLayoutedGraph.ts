import { useMemo } from 'react';
import dagre from '@dagrejs/dagre';
import { type Node, type Edge, Position } from '@xyflow/react';
import { mandatoryCourses, electivePrereqCourses } from '../data/courses';
import type { Course } from '../data/types';

const NODE_WIDTH = 180;
const NODE_HEIGHT = 80;
const SEMESTER_GAP = 240;
const ELECTIVE_COL_X = 5 * SEMESTER_GAP; // column 5 for elective prereqs

function buildGraph(courses: Course[]) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', ranksep: 60, nodesep: 30 });

  courses.forEach((c) => {
    g.setNode(c.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  courses.forEach((c) => {
    c.prerequisites.forEach((pid) => {
      if (courses.some((cc) => cc.id === pid) || mandatoryCourses.some((cc) => cc.id === pid)) {
        g.setEdge(pid, c.id);
      }
    });
  });

  dagre.layout(g);
  return g;
}

export function useLayoutedGraph() {
  return useMemo(() => {
    const allGraphCourses = [...mandatoryCourses, ...electivePrereqCourses];
    const g = buildGraph(allGraphCourses);

    // Group mandatory courses by semester for x-positioning
    const semesterGroups = new Map<number, Course[]>();
    mandatoryCourses.forEach((c) => {
      const sem = c.semester ?? 1;
      if (!semesterGroups.has(sem)) semesterGroups.set(sem, []);
      semesterGroups.get(sem)!.push(c);
    });

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Position mandatory courses: x by semester, y by dagre within group
    semesterGroups.forEach((group, sem) => {
      // Sort by dagre y to maintain good ordering
      const sorted = group.sort((a, b) => {
        const ya = g.node(a.id)?.y ?? 0;
        const yb = g.node(b.id)?.y ?? 0;
        return ya - yb;
      });

      sorted.forEach((course, idx) => {
        nodes.push({
          id: course.id,
          type: 'courseNode',
          position: {
            x: (sem - 1) * SEMESTER_GAP,
            y: idx * (NODE_HEIGHT + 30),
          },
          data: { course },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        });
      });
    });

    // Position elective prereq courses in a separate column
    const electiveSorted = electivePrereqCourses.sort((a, b) => {
      const ya = g.node(a.id)?.y ?? 0;
      const yb = g.node(b.id)?.y ?? 0;
      return ya - yb;
    });

    electiveSorted.forEach((course, idx) => {
      // ECO2 goes one column further right
      const xOffset = course.id === 'ECO2' ? ELECTIVE_COL_X + SEMESTER_GAP : ELECTIVE_COL_X;
      nodes.push({
        id: course.id,
        type: 'courseNode',
        position: {
          x: xOffset,
          y: idx * (NODE_HEIGHT + 30),
        },
        data: { course },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });
    });

    // Build edges for all prerequisites
    allGraphCourses.forEach((course) => {
      course.prerequisites.forEach((pid) => {
        edges.push({
          id: `${pid}->${course.id}`,
          source: pid,
          target: course.id,
          type: 'smoothstep',
          animated: false,
        });
      });
    });

    return { nodes, edges };
  }, []);
}
