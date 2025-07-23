export interface Quiz {
  id: string;
  title: string;
  description: string;

  // Associations
  courseId: string;
  moduleId?: string; // Optional - quiz can be for entire course or specific module
  lectureId?: string; // Optional - quiz can be for specific lecture

  // Quiz configuration
  questions: string[]; // Array of question IDs
  passingScore: number; // Percentage needed to pass
  timeLimit?: number; // in minutes, null for unlimited
  maxAttempts: number; // 0 for unlimited
  randomizeQuestions: boolean;
  showCorrectAnswers: boolean;

  // Access control
  isRequired: boolean; // Must complete to progress
  isPublished: boolean;
  availableFrom?: string;
  availableUntil?: string;

  // Analytics
  totalAttempts: number;
  averageScore: number;
  passRate: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'essay' | 'matching';
  question: string;
  explanation?: string;
  points: number;
  order: number;

  // Question options (for multiple choice, matching, etc.)
  options?: QuizOption[];

  // Correct answers
  correctAnswers: string[]; // Array of correct option IDs or text

  // Media
  image?: string;
  video?: string;

  // Analytics
  difficultyLevel: 'easy' | 'medium' | 'hard';
  correctAnswerRate: number;
  averageTimeSpent: number; // in seconds
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;

  // Attempt details
  answers: QuizAnswer[];
  score: number; // Percentage
  passed: boolean;
  timeSpent: number; // in seconds

  // Status
  status: 'in-progress' | 'completed' | 'abandoned';
  attemptNumber: number;

  // Timestamps
  startedAt: string;
  completedAt?: string;
  submittedAt?: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswers: string[]; // Array of selected option IDs or text
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent: number; // in seconds
}

export interface QuizFormData {
  title: string;
  description: string;
  moduleId?: string;
  lectureId?: string;
  passingScore: number;
  timeLimit?: number;
  maxAttempts: number;
  randomizeQuestions: boolean;
  showCorrectAnswers: boolean;
  isRequired: boolean;
  isPublished: boolean;
  availableFrom?: string;
  availableUntil?: string;
}

export interface QuizStats {
  totalQuizzes: number;
  publishedQuizzes: number;
  totalAttempts: number;
  averagePassRate: number;
  mostAttemptedQuiz: Quiz | null;
  hardestQuiz: Quiz | null; // Lowest pass rate
}

export interface QuizFilters {
  courseId?: string;
  moduleId?: string;
  isPublished?: boolean;
  isRequired?: boolean;
  difficultyLevel?: string;
  passRateRange?: [number, number];
}
