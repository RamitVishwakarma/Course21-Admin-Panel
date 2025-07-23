export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar?: string;

  // Role and permissions
  roleId: string;
  roleName: string;
  permissions: string[];

  // Profile information
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };

  // Account status
  isActive: boolean;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;

  // Learning/Teaching stats (for instructors)
  isInstructor: boolean;
  coursesCreated?: number;
  totalStudents?: number;
  totalRevenue?: number;
  rating?: number;

  // Student stats
  coursesEnrolled: number;
  enrolledCourses?: string[]; // Array of course IDs the user is enrolled in
  coursesCompleted: number;
  certificatesEarned: number;
  totalLearningTime: number; // in minutes

  // Timestamps
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  emailVerifiedAt?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  username: string;
  roleId: string;
  bio?: string;
  location?: string;
  website?: string;
  isActive: boolean;
  isInstructor: boolean;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  instructors: number;
  students: number;
  newUsersThisMonth: number;
  verifiedUsers: number;
}

export interface UserFilters {
  roleId?: string;
  isActive?: boolean;
  isInstructor?: boolean;
  isEmailVerified?: boolean;
  dateRange?: [string, string];
}
