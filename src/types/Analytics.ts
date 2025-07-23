export interface AnalyticsOverview {
  // Time period for analytics
  period: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  startDate: string;
  endDate: string;

  // Core metrics
  totalRevenue: number;
  totalEnrollments: number;
  totalUsers: number;
  totalCourses: number;

  // Growth metrics
  revenueGrowth: number; // Percentage change from previous period
  enrollmentGrowth: number;
  userGrowth: number;
  courseGrowth: number;

  // Engagement metrics
  averageCompletionRate: number;
  averageRating: number;
  totalWatchTime: number; // in minutes
  activeUsers: number;
}

export interface CourseAnalytics {
  courseId: string;
  courseName: string;

  // Enrollment metrics
  totalEnrollments: number;
  newEnrollmentsThisPeriod: number;
  enrollmentTrend: DataPoint[];

  // Revenue metrics
  totalRevenue: number;
  revenueThisPeriod: number;
  revenueTrend: DataPoint[];

  // Engagement metrics
  completionRate: number;
  averageRating: number;
  totalReviews: number;
  averageWatchTime: number; // in minutes
  dropOffRate: number; // Percentage who don't complete

  // Popular content
  mostWatchedLectures: LectureAnalytics[];
  strugglingPoints: string[]; // Lectures with high drop-off

  // Geographic data
  enrollmentsByCountry: CountryData[];

  // Time-based data
  peakLearningHours: HourlyData[];
  learningDayPattern: DayData[];
}

export interface UserAnalytics {
  userId: string;
  userName: string;

  // Learning progress
  coursesEnrolled: number;
  coursesCompleted: number;
  currentlyLearning: number;
  certificatesEarned: number;

  // Engagement
  totalLearningTime: number; // in minutes
  averageSessionDuration: number; // in minutes
  streakDays: number; // Current learning streak
  lastActiveDate: string;

  // Performance
  averageQuizScore: number;
  averageCourseCompletion: number;
  favoriteCategories: string[];

  // Activity timeline
  recentActivity: ActivityEvent[];
}

export interface LectureAnalytics {
  lectureId: string;
  lectureTitle: string;
  moduleId: string;
  courseId: string;

  // View metrics
  totalViews: number;
  uniqueViews: number;
  averageWatchTime: number; // in seconds
  completionRate: number;

  // Engagement
  replayRate: number; // How often users rewatch
  skipRate: number; // How often users skip
  dropOffPoints: DropOffPoint[];

  // Feedback
  rating: number;
  comments: number;
}

export interface DataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface CountryData {
  country: string;
  countryCode: string;
  enrollments: number;
  revenue: number;
}

export interface HourlyData {
  hour: number; // 0-23
  learners: number;
  sessionsStarted: number;
}

export interface DayData {
  day: string; // Monday, Tuesday, etc.
  dayIndex: number; // 0-6
  learners: number;
  completions: number;
}

export interface DropOffPoint {
  timestamp: number; // seconds into video
  dropOffRate: number; // percentage of users who drop off at this point
}

export interface ActivityEvent {
  id: string;
  type:
    | 'enrollment'
    | 'completion'
    | 'quiz_passed'
    | 'certificate_earned'
    | 'review_left';
  description: string;
  courseId?: string;
  courseName?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  revenueByPeriod: DataPoint[];
  revenueByCategory: CategoryRevenue[];
  revenueByInstructor: InstructorRevenue[];

  // Payment methods
  paymentMethods: PaymentMethodData[];

  // Subscriptions vs one-time
  subscriptionRevenue: number;
  oneTimeRevenue: number;

  // Refunds and chargebacks
  refunds: number;
  chargebacks: number;
  netRevenue: number;
}

export interface CategoryRevenue {
  category: string;
  revenue: number;
  enrollments: number;
  averagePrice: number;
}

export interface InstructorRevenue {
  instructorId: string;
  instructorName: string;
  revenue: number;
  enrollments: number;
  courses: number;
  rating: number;
}

export interface PaymentMethodData {
  method: string; // 'credit_card', 'paypal', 'bank_transfer', etc.
  transactions: number;
  revenue: number;
  percentage: number;
}

export interface EngagementAnalytics {
  dailyActiveUsers: DataPoint[];
  weeklyActiveUsers: DataPoint[];
  monthlyActiveUsers: DataPoint[];

  sessionDuration: {
    average: number;
    median: number;
    distribution: SessionDurationBucket[];
  };

  learningStreak: {
    averageStreak: number;
    longestStreak: number;
    usersWithStreak: number;
  };

  contentConsumption: {
    videosWatched: number;
    quizzesTaken: number;
    downloadsMade: number;
    commentsPosted: number;
  };
}

export interface SessionDurationBucket {
  range: string; // e.g., "0-5 mins", "5-15 mins"
  count: number;
  percentage: number;
}

export interface DashboardMetrics {
  overview: AnalyticsOverview;
  recentActivity: ActivityEvent[];
  topCourses: CourseAnalytics[];
  topInstructors: InstructorRevenue[];
  alerts: AlertItem[];
}

export interface AlertItem {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}
