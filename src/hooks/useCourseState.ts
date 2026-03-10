import { useState, useCallback, useEffect } from 'react';
import type { CourseState, CourseStatus } from '../data/types';
import { courseMap } from '../data/courses';

const STORAGE_KEY = 'ifb-despro-curriculum-state';

function loadState(): CourseState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {};
}

function saveState(state: CourseState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useCourseState() {
  const [state, setState] = useState<CourseState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const getStatus = useCallback(
    (courseId: string): CourseStatus => state[courseId] ?? 'default',
    [state],
  );

  const arePrereqsMet = useCallback(
    (courseId: string): boolean => {
      const course = courseMap.get(courseId);
      if (!course) return true;
      return course.prerequisites.every((pid) => state[pid] === 'completed');
    },
    [state],
  );

  const toggleStatus = useCallback((courseId: string) => {
    setState((prev) => {
      const current = prev[courseId] ?? 'default';
      const next: CourseStatus =
        current === 'default'
          ? 'in_progress'
          : current === 'in_progress'
            ? 'completed'
            : 'default';
      const copy = { ...prev };
      if (next === 'default') {
        delete copy[courseId];
      } else {
        copy[courseId] = next;
      }
      return copy;
    });
  }, []);

  const reset = useCallback(() => {
    setState({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const completedMandatory = Object.entries(state).filter(
    ([id, s]) => s === 'completed' && courseMap.get(id)?.category === 'mandatory',
  ).length;

  const completedElectives = Object.entries(state).filter(
    ([id, s]) =>
      s === 'completed' &&
      (courseMap.get(id)?.category === 'elective_prereq' ||
        courseMap.get(id)?.category === 'elective_free'),
  ).length;

  return {
    state,
    getStatus,
    arePrereqsMet,
    toggleStatus,
    reset,
    completedMandatory,
    completedElectives,
  };
}
