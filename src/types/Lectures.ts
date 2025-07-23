export interface Lecture {
  id: string;
  title: string;
  description: string;
  moduleId: string;
  courseId: string;
  order: number; // For sorting lectures within a module

  // Video content
  videoUrl: string; // For showcase, we'll use sample video URLs
  videoDuration: number; // in seconds
  videoThumbnail?: string;
  videoQuality: ('480p' | '720p' | '1080p')[];

  // Content details
  type: 'video' | 'text' | 'quiz' | 'assignment';
  content?: string; // For text lectures
  downloadableResources: Resource[];

  // Access control
  isFree: boolean; // If lecture is available for free preview
  isPublished: boolean;

  // Timestamps
  createdAt: string;
  updatedAt: string;

  // Analytics
  viewCount: number;
  completionRate: number;
  averageWatchTime: number; // in seconds
  dropOffPoints: number[]; // Array of seconds where users commonly drop off
}

export interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'zip' | 'code' | 'other';
  url: string;
  size: number; // in bytes
}

export interface LectureFormData {
  title: string;
  description: string;
  videoUrl: string;
  videoDuration: number;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  content?: string;
  isFree: boolean;
  isPublished: boolean;
  downloadableResources: Resource[];
}

export interface LectureProgress {
  lectureId: string;
  userId: string;
  watchedDuration: number; // in seconds
  isCompleted: boolean;
  lastWatchedAt: string;
  completedAt?: string;
}

export interface LectureStats {
  totalLectures: number;
  publishedLectures: number;
  totalDuration: number; // in minutes
  averageCompletionRate: number;
  mostWatchedLecture: Lecture | null;
}
