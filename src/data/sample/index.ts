// Export all sample data for the Course21 Admin Panel showcase
export { default as sampleCourses } from './courses';
export { default as sampleModules } from './modules';
export { default as sampleLectures } from './lectures';
export { default as sampleUsers } from './users';
export { sampleRoles, samplePermissions } from './roles';
export { default as sampleQuizzes, sampleQuizQuestions } from './quizzes';
export {
  default as sampleAnalyticsOverview,
  sampleCourseAnalytics,
  sampleRevenueAnalytics,
  sampleEngagementAnalytics,
  sampleDashboardMetrics,
} from './analytics';

// Import for default export
import sampleCoursesData from './courses';
import sampleModulesData from './modules';
import sampleLecturesData from './lectures';
import sampleUsersData from './users';
import {
  sampleRoles as sampleRolesData,
  samplePermissions as samplePermissionsData,
} from './roles';
import sampleQuizzesData, {
  sampleQuizQuestions as sampleQuizQuestionsData,
} from './quizzes';
import sampleAnalyticsOverviewData, {
  sampleCourseAnalytics as sampleCourseAnalyticsData,
  sampleRevenueAnalytics as sampleRevenueAnalyticsData,
  sampleEngagementAnalytics as sampleEngagementAnalyticsData,
  sampleDashboardMetrics as sampleDashboardMetricsData,
} from './analytics';

// Helper functions for generating additional sample data
export const generateVideoUrls = () => {
  const sampleVideos = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
  ];

  return sampleVideos;
};

export const generateSampleThumbnails = (category: string) => {
  const thumbnailsByCategory = {
    'Web Development': [
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
      'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
      'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400',
    ],
    'Data Science': [
      'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400',
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    ],
    'Cloud Computing': [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
    ],
    'Mobile Development': [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400',
    ],
    Marketing: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
      'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400',
    ],
  };

  return (
    thumbnailsByCategory[category as keyof typeof thumbnailsByCategory] ||
    thumbnailsByCategory['Web Development']
  );
};

// Sample instructor avatars
export const sampleInstructorAvatars = [
  'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
];

// Sample user avatars
export const sampleUserAvatars = [
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
];

// Course categories
export const courseCategories = [
  'Web Development',
  'Data Science',
  'Cloud Computing',
  'Mobile Development',
  'Marketing',
  'Design',
  'Business',
  'Programming',
  'DevOps',
  'Cybersecurity',
];

// Programming languages and technologies
export const technologies = [
  'React',
  'JavaScript',
  'TypeScript',
  'Node.js',
  'Python',
  'Django',
  'Flask',
  'AWS',
  'Docker',
  'Kubernetes',
  'Git',
  'MongoDB',
  'PostgreSQL',
  'MySQL',
  'HTML',
  'CSS',
  'Vue.js',
  'Angular',
  'Express.js',
  'GraphQL',
  'REST API',
  'Machine Learning',
  'TensorFlow',
  'PyTorch',
  'Pandas',
  'NumPy',
  'Matplotlib',
  'Redux',
  'Next.js',
  'React Native',
  'Flutter',
  'Swift',
  'Kotlin',
  'Java',
  'C#',
  '.NET',
  'PHP',
  'Laravel',
  'Ruby',
  'Rails',
  'Go',
  'Rust',
];

export default {
  courses: sampleCoursesData,
  modules: sampleModulesData,
  lectures: sampleLecturesData,
  users: sampleUsersData,
  roles: sampleRolesData,
  permissions: samplePermissionsData,
  quizzes: sampleQuizzesData,
  quizQuestions: sampleQuizQuestionsData,
  analytics: {
    overview: sampleAnalyticsOverviewData,
    courseAnalytics: sampleCourseAnalyticsData,
    revenue: sampleRevenueAnalyticsData,
    engagement: sampleEngagementAnalyticsData,
    dashboard: sampleDashboardMetricsData,
  },
};
