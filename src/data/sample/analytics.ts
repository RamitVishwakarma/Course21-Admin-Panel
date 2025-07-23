import {
  AnalyticsOverview,
  CourseAnalytics,
  UserAnalytics,
  RevenueAnalytics,
  EngagementAnalytics,
  DashboardMetrics,
} from '../../types';

export const sampleAnalyticsOverview: AnalyticsOverview = {
  period: 'month',
  startDate: '2024-12-01T00:00:00Z',
  endDate: '2024-12-31T23:59:59Z',

  // Core metrics (all amounts in INR)
  totalRevenue: 493750000, // ₹49.37 crores
  totalEnrollments: 67234,
  totalUsers: 52891,
  totalCourses: 127,

  // Growth metrics (compared to previous month)
  revenueGrowth: 12.5,
  enrollmentGrowth: 8.3,
  userGrowth: 15.2,
  courseGrowth: 4.7,

  // Engagement metrics
  averageCompletionRate: 73.8,
  averageRating: 4.6,
  totalWatchTime: 2847392, // in minutes
  activeUsers: 34567,
};

export const sampleCourseAnalytics: CourseAnalytics[] = [
  {
    courseId: 'course-1',
    courseName: 'Complete React Development Masterclass',

    // Enrollment metrics
    totalEnrollments: 12750,
    newEnrollmentsThisPeriod: 1234,
    enrollmentTrend: [
      { date: '2024-12-01', value: 345 },
      { date: '2024-12-08', value: 423 },
      { date: '2024-12-15', value: 289 },
      { date: '2024-12-22', value: 177 },
    ],

    // Revenue metrics (INR)
    totalRevenue: 96125000, // ₹9.61 crores
    revenueThisPeriod: 9289000, // ₹92.89 lakhs
    revenueTrend: [
      { date: '2024-12-01', value: 2600000 }, // ₹26 lakhs
      { date: '2024-12-08', value: 3185000 }, // ₹31.85 lakhs
      { date: '2024-12-15', value: 2175000 }, // ₹21.75 lakhs
      { date: '2024-12-22', value: 1329000 }, // ₹13.29 lakhs
    ],

    // Engagement metrics
    completionRate: 78.5,
    averageRating: 4.8,
    totalReviews: 2341,
    averageWatchTime: 1152,
    dropOffRate: 21.5,

    // Popular content
    mostWatchedLectures: [],
    strugglingPoints: ['Redux implementation', 'Context API'],

    // Geographic data
    enrollmentsByCountry: [
      {
        country: 'United States',
        countryCode: 'US',
        enrollments: 4523,
        revenue: 407070,
      },
      {
        country: 'India',
        countryCode: 'IN',
        enrollments: 2341,
        revenue: 210690,
      },
      {
        country: 'United Kingdom',
        countryCode: 'GB',
        enrollments: 1876,
        revenue: 168840,
      },
      {
        country: 'Canada',
        countryCode: 'CA',
        enrollments: 1234,
        revenue: 111060,
      },
      {
        country: 'Germany',
        countryCode: 'DE',
        enrollments: 987,
        revenue: 88830,
      },
    ],

    // Time-based data
    peakLearningHours: [
      { hour: 9, learners: 234, sessionsStarted: 345 },
      { hour: 14, learners: 456, sessionsStarted: 567 },
      { hour: 19, learners: 789, sessionsStarted: 892 },
      { hour: 21, learners: 567, sessionsStarted: 678 },
    ],

    learningDayPattern: [
      { day: 'Monday', dayIndex: 1, learners: 1234, completions: 234 },
      { day: 'Tuesday', dayIndex: 2, learners: 1456, completions: 345 },
      { day: 'Wednesday', dayIndex: 3, learners: 1567, completions: 456 },
      { day: 'Thursday', dayIndex: 4, learners: 1345, completions: 234 },
      { day: 'Friday', dayIndex: 5, learners: 1123, completions: 123 },
      { day: 'Saturday', dayIndex: 6, learners: 2345, completions: 567 },
      { day: 'Sunday', dayIndex: 0, learners: 2789, completions: 678 },
    ],
  },
];

export const sampleRevenueAnalytics: RevenueAnalytics = {
  totalRevenue: 493750000, // ₹49.37 crores (INR)
  revenueByPeriod: [
    { date: '2024-01', value: 19625000 }, // ₹1.96 crores
    { date: '2024-02', value: 28975000 }, // ₹2.89 crores
    { date: '2024-03', value: 38250000 }, // ₹3.82 crores
    { date: '2024-04', value: 47575000 }, // ₹4.75 crores
    { date: '2024-05', value: 56900000 }, // ₹5.69 crores
    { date: '2024-06', value: 66125000 }, // ₹6.61 crores
    { date: '2024-07', value: 47575000 }, // ₹4.75 crores
    { date: '2024-08', value: 56900000 }, // ₹5.69 crores
    { date: '2024-09', value: 66125000 }, // ₹6.61 crores
    { date: '2024-10', value: 47575000 }, // ₹4.75 crores
    { date: '2024-11', value: 56900000 }, // ₹5.69 crores
    { date: '2024-12', value: 44560000 }, // ₹4.45 crores
  ],
  revenueByCategory: [
    {
      category: 'Web Development',
      revenue: 2345678,
      enrollments: 23456,
      averagePrice: 99.99,
    },
    {
      category: 'Data Science',
      revenue: 195900000, // ₹19.59 crores
      enrollments: 12345,
      averagePrice: 8999, // INR
    },
    {
      category: 'Cloud Computing',
      revenue: 103250000, // ₹10.32 crores
      enrollments: 8234,
      averagePrice: 11999, // INR
    },
    {
      category: 'Mobile Development',
      revenue: 47500000, // ₹4.75 crores
      enrollments: 5678,
      averagePrice: 7999, // INR
    },
    {
      category: 'Marketing',
      revenue: 14750000, // ₹1.47 crores
      enrollments: 2206,
      averagePrice: 5999, // INR
    },
  ],
  revenueByInstructor: [
    {
      instructorId: 'instructor-1',
      instructorName: 'Rahul Gupta',
      revenue: 216500000, // ₹21.65 crores
      enrollments: 25847,
      courses: 3,
      rating: 4.8,
    },
    {
      instructorId: 'instructor-2',
      instructorName: 'Dr. Vikram Singh',
      revenue: 157000000, // ₹15.7 crores
      enrollments: 15678,
      courses: 2,
      rating: 4.7,
    },
    {
      instructorId: 'instructor-3',
      instructorName: 'Arjun Malhotra',
      revenue: 104250000, // ₹10.42 crores
      enrollments: 8934,
      courses: 1,
      rating: 4.9,
    },
  ],
  paymentMethods: [
    {
      method: 'UPI',
      transactions: 45678,
      revenue: 382250000, // ₹38.22 crores
      percentage: 45.2,
    },
    {
      method: 'Credit/Debit Card',
      transactions: 28234,
      revenue: 189850000, // ₹18.98 crores
      percentage: 32.8,
    },
    {
      method: 'Net Banking',
      transactions: 12456,
      revenue: 95750000, // ₹9.57 crores
      percentage: 16.3,
    },
    {
      method: 'Digital Wallet (Paytm/PhonePe)',
      transactions: 6234,
      revenue: 41650000, // ₹4.16 crores
      percentage: 5.7,
    },
  ],
  subscriptionRevenue: 289000000, // ₹28.9 crores
  oneTimeRevenue: 204750000, // ₹20.47 crores
  refunds: 10325000, // ₹1.03 crores
  chargebacks: 1962500, // ₹19.62 lakhs
  netRevenue: 481462500, // ₹48.14 crores
};

export const sampleEngagementAnalytics: EngagementAnalytics = {
  dailyActiveUsers: [
    { date: '2024-12-01', value: 3456 },
    { date: '2024-12-02', value: 3789 },
    { date: '2024-12-03', value: 4123 },
    { date: '2024-12-04', value: 3876 },
    { date: '2024-12-05', value: 3654 },
    { date: '2024-12-06', value: 4234 },
    { date: '2024-12-07', value: 4567 },
  ],
  weeklyActiveUsers: [
    { date: '2024-W48', value: 23456 },
    { date: '2024-W49', value: 25678 },
    { date: '2024-W50', value: 27890 },
    { date: '2024-W51', value: 26543 },
  ],
  monthlyActiveUsers: [
    { date: '2024-01', value: 89012 },
    { date: '2024-02', value: 92345 },
    { date: '2024-03', value: 95678 },
    { date: '2024-04', value: 98901 },
    { date: '2024-05', value: 102234 },
    { date: '2024-06', value: 105567 },
    { date: '2024-07', value: 108890 },
    { date: '2024-08', value: 112223 },
    { date: '2024-09', value: 115556 },
    { date: '2024-10', value: 118889 },
    { date: '2024-11', value: 122222 },
    { date: '2024-12', value: 125555 },
  ],
  sessionDuration: {
    average: 47, // minutes
    median: 32,
    distribution: [
      { range: '0-5 mins', count: 5678, percentage: 15.2 },
      { range: '5-15 mins', count: 8901, percentage: 23.8 },
      { range: '15-30 mins', count: 12345, percentage: 33.0 },
      { range: '30-60 mins', count: 7890, percentage: 21.1 },
      { range: '60+ mins', count: 2567, percentage: 6.9 },
    ],
  },
  learningStreak: {
    averageStreak: 12.5,
    longestStreak: 89,
    usersWithStreak: 15678,
  },
  contentConsumption: {
    videosWatched: 234567,
    quizzesTaken: 45678,
    downloadsMade: 12345,
    commentsPosted: 8901,
  },
};

export const sampleDashboardMetrics: DashboardMetrics = {
  overview: sampleAnalyticsOverview,
  recentActivity: [
    {
      id: 'activity-1',
      type: 'enrollment',
      description: 'New enrollment in Complete React Development Masterclass',
      courseId: 'course-1',
      courseName: 'Complete React Development Masterclass',
      timestamp: '2024-12-15T14:30:00Z',
    },
    {
      id: 'activity-2',
      type: 'completion',
      description: 'Course completed: Python for Data Science',
      courseId: 'course-2',
      courseName: 'Python for Data Science and Machine Learning',
      timestamp: '2024-12-15T13:45:00Z',
    },
    {
      id: 'activity-3',
      type: 'quiz_passed',
      description: 'Quiz passed: React Fundamentals Assessment',
      courseId: 'course-1',
      courseName: 'Complete React Development Masterclass',
      timestamp: '2024-12-15T12:15:00Z',
    },
    {
      id: 'activity-4',
      type: 'certificate_earned',
      description: 'Certificate earned for AWS Cloud Solutions Architect',
      courseId: 'course-3',
      courseName: 'AWS Cloud Solutions Architect',
      timestamp: '2024-12-15T11:20:00Z',
    },
    {
      id: 'activity-5',
      type: 'review_left',
      description: 'New 5-star review for React course',
      courseId: 'course-1',
      courseName: 'Complete React Development Masterclass',
      timestamp: '2024-12-15T10:45:00Z',
    },
  ],
  topCourses: sampleCourseAnalytics,
  topInstructors: sampleRevenueAnalytics.revenueByInstructor,
  alerts: [
    {
      id: 'alert-1',
      type: 'success',
      title: 'Revenue Milestone',
      message: 'Monthly revenue target exceeded by 15%!',
      timestamp: '2024-12-15T09:00:00Z',
      isRead: false,
    },
    {
      id: 'alert-2',
      type: 'warning',
      title: 'Low Completion Rate',
      message: 'Mobile Development course has completion rate below 60%',
      timestamp: '2024-12-14T16:30:00Z',
      isRead: false,
      actionUrl: '/admin/courses/course-4',
    },
    {
      id: 'alert-3',
      type: 'info',
      title: 'New Instructor Application',
      message: '3 new instructor applications pending review',
      timestamp: '2024-12-14T14:20:00Z',
      isRead: true,
    },
  ],
};

export { sampleAnalyticsOverview as default };
