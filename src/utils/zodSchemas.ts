import { z } from 'zod';

// Base validation utilities
const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
const urlRegex = /^https?:\/\/.+/;
const indianPhoneRegex = /^[+]?[91]?[6-9]\d{9}$/;

// Common field schemas
export const commonSchemas = {
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(phoneRegex, 'Please enter a valid phone number'),
  indianPhone: z
    .string()
    .regex(indianPhoneRegex, 'Please enter a valid Indian phone number'),
  url: z
    .string()
    .regex(
      urlRegex,
      'Please enter a valid URL starting with http:// or https://',
    ),
  price: z.number().min(0, 'Price must be a positive number'),
  percentage: z
    .number()
    .min(0)
    .max(100, 'Percentage must be between 0 and 100'),
  id: z.string().min(1, 'ID is required'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  shortDescription: z
    .string()
    .max(200, 'Short description must be less than 200 characters')
    .optional(),
};

// User Schema
export const userSchema = z.object({
  id: commonSchemas.id.optional(), // Optional for creation
  name: commonSchemas.name,
  email: commonSchemas.email,
  phone: commonSchemas.indianPhone.optional(),
  avatar: z.string().url('Please enter a valid avatar URL').optional(),
  role: z.enum(['admin', 'instructor', 'student'], {
    errorMap: () => ({ message: 'Please select a valid role' }),
  }),
  isActive: z.boolean().default(true),
  lastLogin: z.string().datetime().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),

  // Learning progress fields
  enrolledCourses: z.array(commonSchemas.id).default([]),
  completedCourses: z.array(commonSchemas.id).default([]),
  totalLearningTime: z.number().min(0).default(0),
  certificatesEarned: z.number().min(0).default(0),
  averageQuizScore: z.number().min(0).max(100).default(0),

  // Profile fields
  location: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  interests: z.array(z.string()).default([]),
  socialLinks: z
    .object({
      linkedin: z.string().url().optional(),
      twitter: z.string().url().optional(),
      github: z.string().url().optional(),
    })
    .optional(),
});

// Course Schema
export const courseSchema = z.object({
  id: commonSchemas.id.optional(),
  title: commonSchemas.title,
  description: commonSchemas.description,
  shortDescription: commonSchemas.shortDescription,
  thumbnail: z.string().url('Please enter a valid thumbnail URL').optional(),
  category: z.string().min(1, 'Please select a category'),
  tags: z.array(z.string()).default([]),
  price: commonSchemas.price,
  currency: z.string().default('INR'),
  level: z.enum(['beginner', 'intermediate', 'advanced'], {
    errorMap: () => ({ message: 'Please select a valid difficulty level' }),
  }),
  language: z.string().default('English'),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  enrollmentCount: z.number().min(0).default(0),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().min(0).default(0),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),

  // Instructor information
  instructorId: commonSchemas.id,
  instructorName: commonSchemas.name,
  instructorAvatar: z.string().url().optional(),

  // Relationships
  modules: z.array(commonSchemas.id).default([]),
  moduleCount: z.number().min(0).default(0),
  lectureCount: z.number().min(0).default(0),

  // Learning outcomes
  learningOutcomes: z.array(z.string()).default([]),
  prerequisites: z.array(z.string()).default([]),
  targetAudience: z.array(z.string()).default([]),

  // Timestamps
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),

  // Analytics
  totalEnrollments: z.number().min(0).default(0),
  completionRate: z.number().min(0).max(100).default(0),
  averageRating: z.number().min(0).max(5).default(0),
  totalRevenue: z.number().min(0).default(0),
});

// Module Schema
export const moduleSchema = z.object({
  id: commonSchemas.id.optional(),
  title: commonSchemas.title,
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  courseId: commonSchemas.id,
  orderIndex: z.number().min(0, 'Order index must be a positive number'),
  duration: z.number().min(1, 'Duration must be at least 1 minute').default(0),
  isPublished: z.boolean().default(false),
  isPreview: z.boolean().default(false),

  // Learning objectives
  objectives: z.array(z.string()).default([]),

  // Relationships
  lectures: z.array(commonSchemas.id).default([]),
  lectureCount: z.number().min(0).default(0),

  // Analytics
  completionRate: z.number().min(0).max(100).default(0),
  averageTimeSpent: z.number().min(0).default(0),

  // Timestamps
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// Lecture Schema
export const lectureSchema = z.object({
  id: commonSchemas.id.optional(),
  title: commonSchemas.title,
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  moduleId: commonSchemas.id,
  courseId: commonSchemas.id,
  orderIndex: z.number().min(0, 'Order index must be a positive number'),
  type: z
    .enum(['video', 'text', 'quiz', 'assignment'], {
      errorMap: () => ({ message: 'Please select a valid lecture type' }),
    })
    .default('video'),

  // Video specific fields
  videoUrl: commonSchemas.url.optional(),
  videoDuration: z
    .number()
    .min(1, 'Video duration must be at least 1 minute')
    .optional(),
  videoThumbnail: z.string().url().optional(),
  videoQuality: z.enum(['720p', '1080p', '1440p', '4K']).optional(),

  // Content fields
  content: z.string().optional(),
  resources: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url(),
        type: z.string(),
      }),
    )
    .default([]),

  // Settings
  isPublished: z.boolean().default(false),
  isPreview: z.boolean().default(false),
  isMandatory: z.boolean().default(true),

  // Analytics
  viewCount: z.number().min(0).default(0),
  averageWatchTime: z.number().min(0).default(0),
  completionRate: z.number().min(0).max(100).default(0),

  // Timestamps
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// Quiz Schema
export const quizSchema = z.object({
  id: commonSchemas.id.optional(),
  title: commonSchemas.title,
  description: commonSchemas.description,
  moduleId: commonSchemas.id,
  courseId: commonSchemas.id,

  // Quiz settings
  timeLimit: z.number().min(1, 'Time limit must be at least 1 minute'),
  passingScore: z
    .number()
    .min(0)
    .max(100, 'Passing score must be between 0 and 100'),
  maxAttempts: z.number().min(1, 'Maximum attempts must be at least 1'),
  randomizeQuestions: z.boolean().default(false),
  showResults: z.boolean().default(true),
  allowReview: z.boolean().default(true),

  // Questions
  questions: z
    .array(
      z.object({
        id: commonSchemas.id,
        type: z.enum([
          'multiple-choice',
          'true-false',
          'short-answer',
          'multiple-answer',
          'matching',
        ]),
        question: z.string().min(10, 'Question must be at least 10 characters'),
        options: z.array(z.string()).optional(),
        correctAnswer: z.union([z.string(), z.array(z.string())]),
        explanation: z.string().optional(),
        points: z.number().min(1, 'Points must be at least 1').default(1),
      }),
    )
    .min(1, 'Quiz must have at least 1 question'),

  // Analytics
  totalAttempts: z.number().min(0).default(0),
  averageScore: z.number().min(0).max(100).default(0),
  passRate: z.number().min(0).max(100).default(0),

  // Timestamps
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// Role Schema
export const roleSchema = z.object({
  id: commonSchemas.id.optional(),
  name: z
    .string()
    .min(2, 'Role name must be at least 2 characters')
    .max(30, 'Role name must be less than 30 characters'),
  description: z
    .string()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
  permissions: z
    .array(z.string())
    .min(1, 'Role must have at least one permission'),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// Form validation helpers
export const validateData = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => err.message);
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation failed'] };
  }
};

// Partial validation for updates
export const createUpdateSchema = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
) => {
  return schema.partial();
};

// Export specific schemas for components
export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateUserSchema = createUpdateSchema(userSchema);

export const createCourseSchema = courseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateCourseSchema = createUpdateSchema(courseSchema);

export const createModuleSchema = moduleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateModuleSchema = createUpdateSchema(moduleSchema);

export const createLectureSchema = lectureSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateLectureSchema = createUpdateSchema(lectureSchema);

export const createQuizSchema = quizSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateQuizSchema = createUpdateSchema(quizSchema);
