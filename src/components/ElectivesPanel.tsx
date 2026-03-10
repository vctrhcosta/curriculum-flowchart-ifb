import { electiveFreeCourses } from '../data/courses';
import type { CourseStatus } from '../data/types';

interface ElectivesPanelProps {
  getStatus: (id: string) => CourseStatus;
  toggleStatus: (id: string) => void;
}

export default function ElectivesPanel({ getStatus, toggleStatus }: ElectivesPanelProps) {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-3">
        Optativas Livres (sem pré-requisito)
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {electiveFreeCourses.map((course) => {
          const status = getStatus(course.id);

          let bgClass = 'bg-emerald-500 hover:bg-emerald-600';
          let icon = '';
          if (status === 'in_progress') {
            bgClass = 'bg-emerald-500 ring-2 ring-amber-400 animate-pulse';
            icon = '\u{1F552} ';
          } else if (status === 'completed') {
            bgClass = 'bg-green-700';
            icon = '\u2705 ';
          }

          return (
            <button
              key={course.id}
              onClick={() => toggleStatus(course.id)}
              className={`${bgClass} text-white text-xs font-medium rounded-lg px-3 py-3 text-center transition-all duration-200 cursor-pointer select-none`}
            >
              {icon}{course.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
