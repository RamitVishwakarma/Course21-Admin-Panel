export interface Module {
  id: string;
  title: string;
  description: string;
  courseId: string;
  order: number; // For sorting modules within a course
  duration: number; // in minutes (calculated from lectures)
  lectureCount: number;

  // Content
  lectures: string[]; // Array of lecture IDs
  objectives: string[];

  // Status
  isPublished: boolean;
  isPreview: boolean; // If module is available as preview

  // Timestamps
  createdAt: string;
  updatedAt: string;

  // Progress tracking
  completionRate: number;
  enrollmentCount: number;
}

export interface ModuleFormData {
  title: string;
  description: string;
  objectives: string[];
  isPublished: boolean;
  isPreview: boolean;
}

export interface ModuleStats {
  totalModules: number;
  publishedModules: number;
  averageCompletionRate: number;
  mostPopularModule: Module | null;
}
