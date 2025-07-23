export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  thumbnail?: string;
  category: string;
  tags: string[];
  price: number;
  currency: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  duration: number; // in minutes (calculated from modules)
  enrollmentCount: number;
  rating: number;
  reviewCount: number;
  isPublished: boolean;
  isFeatured: boolean;

  // Instructor information
  instructorId: string;
  instructorName: string;
  instructorAvatar?: string;

  // Modules relationship
  modules: string[]; // Array of module IDs
  moduleCount: number;
  lectureCount: number; // Total lectures across all modules

  // Learning outcomes
  learningOutcomes: string[];
  prerequisites: string[];

  // SEO and marketing
  slug: string;
  metaDescription?: string;
  keywords: string[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;

  // Analytics
  totalEnrollments: number;
  completionRate: number;
  averageRating: number;
  totalRevenue: number;
}

export interface CourseStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  averageRating: number;
  topPerformingCourses: Course[];
}

export interface CourseFilters {
  category?: string;
  level?: string;
  priceRange?: [number, number];
  rating?: number;
  isPublished?: boolean;
  isFeatured?: boolean;
  instructorId?: string;
  tags?: string[];
}

export interface CourseFormData {
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  tags: string[];
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  learningOutcomes: string[];
  prerequisites: string[];
  isPublished: boolean;
  isFeatured: boolean;
}
