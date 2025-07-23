import { Course } from '../../types';

export const sampleCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Complete React Development Masterclass',
    description:
      'Master React from the ground up! Learn React fundamentals, hooks, context, Redux, and build real-world projects. Perfect for beginners and intermediate developers.',
    shortDescription:
      'Comprehensive React course covering hooks, Redux, and real-world projects',
    thumbnail:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    category: 'Web Development',
    tags: ['React', 'JavaScript', 'Frontend', 'Web Development', 'Redux'],
    price: 6999, // INR
    currency: 'INR',
    level: 'intermediate',
    language: 'English',
    duration: 1440, // 24 hours
    enrollmentCount: 12750,
    rating: 4.8,
    reviewCount: 2341,
    isPublished: true,
    isFeatured: true,

    instructorId: 'user-2',
    instructorName: 'Rahul Gupta',
    instructorAvatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100',

    modules: ['module-1', 'module-2', 'module-3', 'module-4', 'module-5'],
    moduleCount: 5,
    lectureCount: 89,

    learningOutcomes: [
      'Build modern React applications from scratch',
      'Master React hooks and functional components',
      'Implement state management with Redux',
      'Create responsive and interactive user interfaces',
      'Deploy React applications to production',
    ],
    prerequisites: ['Basic JavaScript knowledge', 'HTML & CSS fundamentals'],

    slug: 'complete-react-development-masterclass',
    metaDescription:
      'Learn React development with this comprehensive masterclass course',
    keywords: ['react', 'javascript', 'web development', 'frontend'],

    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-12-01T14:30:00Z',
    publishedAt: '2024-02-01T09:00:00Z',

    totalEnrollments: 12750,
    completionRate: 78.5,
    averageRating: 4.8,
    totalRevenue: 1147575,
  },
  {
    id: 'course-2',
    title: 'Python for Data Science and Machine Learning',
    description:
      'Dive deep into Python programming for data science. Learn pandas, numpy, matplotlib, scikit-learn and build machine learning models that solve real problems.',
    shortDescription:
      'Complete Python data science course with hands-on machine learning projects',
    thumbnail:
      'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400',
    category: 'Data Science',
    tags: ['Python', 'Data Science', 'Machine Learning', 'Pandas', 'NumPy'],
    price: 9999, // INR
    currency: 'INR',
    level: 'intermediate',
    language: 'English',
    duration: 1800, // 30 hours
    enrollmentCount: 8942,
    rating: 4.7,
    reviewCount: 1876,
    isPublished: true,
    isFeatured: true,

    instructorId: 'user-4',
    instructorName: 'Dr. Vikram Singh',
    instructorAvatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',

    modules: ['module-6', 'module-7', 'module-8', 'module-9'],
    moduleCount: 4,
    lectureCount: 67,

    learningOutcomes: [
      'Master Python programming for data analysis',
      'Work with pandas and numpy for data manipulation',
      'Create stunning data visualizations',
      'Build and deploy machine learning models',
      'Understand statistical concepts for data science',
    ],
    prerequisites: ['Basic programming knowledge', 'High school mathematics'],

    slug: 'python-data-science-machine-learning',
    metaDescription:
      'Master Python for data science and machine learning with hands-on projects',
    keywords: ['python', 'data science', 'machine learning', 'pandas', 'numpy'],

    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-11-15T16:45:00Z',
    publishedAt: '2024-01-25T10:00:00Z',

    totalEnrollments: 8942,
    completionRate: 72.3,
    averageRating: 4.7,
    totalRevenue: 1162143,
  },
  {
    id: 'course-3',
    title: 'AWS Cloud Solutions Architect',
    description:
      'Become an AWS Certified Solutions Architect! Learn to design and deploy scalable, fault-tolerant systems on Amazon Web Services.',
    shortDescription:
      'Complete AWS certification prep with hands-on cloud architecture projects',
    thumbnail:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
    category: 'Cloud Computing',
    tags: ['AWS', 'Cloud Computing', 'DevOps', 'Architecture', 'Certification'],
    price: 11999, // INR
    currency: 'INR',
    level: 'advanced',
    language: 'English',
    duration: 2160, // 36 hours
    enrollmentCount: 6234,
    rating: 4.9,
    reviewCount: 1542,
    isPublished: true,
    isFeatured: true,

    instructorId: 'user-8',
    instructorName: 'Arjun Malhotra',
    instructorAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',

    modules: ['module-10', 'module-11', 'module-12', 'module-13', 'module-14'],
    moduleCount: 5,
    lectureCount: 98,

    learningOutcomes: [
      'Design scalable and fault-tolerant AWS architectures',
      'Master core AWS services (EC2, S3, RDS, VPC)',
      'Implement security best practices',
      'Pass the AWS Solutions Architect certification',
      'Deploy real-world cloud applications',
    ],
    prerequisites: [
      'Basic networking knowledge',
      'Linux fundamentals',
      '1+ years IT experience',
    ],

    slug: 'aws-cloud-solutions-architect',
    metaDescription:
      'Master AWS cloud architecture and pass the Solutions Architect certification',
    keywords: [
      'aws',
      'cloud computing',
      'solutions architect',
      'certification',
    ],

    createdAt: '2024-02-01T09:30:00Z',
    updatedAt: '2024-12-10T11:20:00Z',
    publishedAt: '2024-02-15T12:00:00Z',

    totalEnrollments: 6234,
    completionRate: 68.9,
    averageRating: 4.9,
    totalRevenue: 935093,
  },
  {
    id: 'course-4',
    title: 'Mobile App Development with React Native',
    description:
      'Build cross-platform mobile apps with React Native. Learn navigation, state management, API integration, and publish to both iOS and Android stores.',
    shortDescription:
      'Complete React Native course for iOS and Android app development',
    thumbnail:
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
    category: 'Mobile Development',
    tags: [
      'React Native',
      'Mobile Development',
      'iOS',
      'Android',
      'JavaScript',
    ],
    price: 7999, // INR
    currency: 'INR',
    level: 'intermediate',
    language: 'English',
    duration: 1620, // 27 hours
    enrollmentCount: 4567,
    rating: 4.6,
    reviewCount: 892,
    isPublished: true,
    isFeatured: false,

    instructorId: 'user-12',
    instructorName: 'Suresh Pillai',
    instructorAvatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',

    modules: ['module-15', 'module-16', 'module-17', 'module-18'],
    moduleCount: 4,
    lectureCount: 73,

    learningOutcomes: [
      'Build native mobile apps for iOS and Android',
      'Master React Native navigation and components',
      'Integrate with REST APIs and databases',
      'Implement push notifications and device features',
      'Publish apps to App Store and Google Play',
    ],
    prerequisites: [
      'React knowledge',
      'JavaScript fundamentals',
      'Basic mobile development concepts',
    ],

    slug: 'mobile-app-development-react-native',
    metaDescription:
      'Learn React Native mobile development for iOS and Android',
    keywords: ['react native', 'mobile development', 'ios', 'android'],

    createdAt: '2024-03-01T14:00:00Z',
    updatedAt: '2024-11-30T09:15:00Z',
    publishedAt: '2024-03-15T10:30:00Z',

    totalEnrollments: 4567,
    completionRate: 74.2,
    averageRating: 4.6,
    totalRevenue: 456533,
  },
  {
    id: 'course-5',
    title: 'Digital Marketing Mastery 2024',
    description:
      'Master digital marketing strategies including SEO, social media marketing, Google Ads, content marketing, and analytics to grow any business online.',
    shortDescription:
      'Complete digital marketing course covering SEO, social media, and paid advertising',
    thumbnail:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    category: 'Marketing',
    tags: [
      'Digital Marketing',
      'SEO',
      'Social Media',
      'Google Ads',
      'Content Marketing',
    ],
    price: 5999, // INR
    currency: 'INR',
    level: 'beginner',
    language: 'English',
    duration: 1080, // 18 hours
    enrollmentCount: 9876,
    rating: 4.5,
    reviewCount: 2134,
    isPublished: true,
    isFeatured: false,

    instructorId: 'user-2',
    instructorName: 'Suresh Pillai',
    instructorAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',

    modules: ['module-19', 'module-20', 'module-21', 'module-22'],
    moduleCount: 4,
    lectureCount: 56,

    learningOutcomes: [
      'Create comprehensive digital marketing strategies',
      'Master SEO and content marketing techniques',
      'Run effective social media campaigns',
      'Set up and optimize Google Ads campaigns',
      'Analyze and improve marketing performance',
    ],
    prerequisites: ['Basic computer skills', 'Interest in marketing'],

    slug: 'digital-marketing-mastery-2024',
    metaDescription:
      'Master digital marketing with SEO, social media, and Google Ads strategies',
    keywords: ['digital marketing', 'seo', 'social media', 'google ads'],

    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-12-05T13:45:00Z',
    publishedAt: '2024-02-05T15:00:00Z',

    totalEnrollments: 9876,
    completionRate: 81.3,
    averageRating: 4.5,
    totalRevenue: 789924,
  },
];

export default sampleCourses;
