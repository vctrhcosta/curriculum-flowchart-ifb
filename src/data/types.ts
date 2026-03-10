export type CourseStatus = 'default' | 'in_progress' | 'completed';

export type CourseCategory = 'mandatory' | 'elective_prereq' | 'elective_free';

export interface Course {
  id: string;
  name: string;
  shortName: string;
  category: CourseCategory;
  semester?: number; // 1-4 for mandatory, undefined for electives
  prerequisites: string[]; // array of course IDs
  hours: number;
}

export type CourseState = Record<string, CourseStatus>;
