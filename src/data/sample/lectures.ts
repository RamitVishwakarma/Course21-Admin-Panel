import { Lecture } from '../../types';

// Sample lecture data with free video URLs for showcase
export const sampleLectures: Lecture[] = [
  // React Fundamentals Module Lectures
  {
    id: 'lecture-1',
    title: 'Introduction to React',
    description:
      "Learn what React is and why it's the most popular frontend library.",
    moduleId: 'module-1',
    courseId: 'course-1',
    order: 1,
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoDuration: 896, // 14:56
    videoThumbnail:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    videoQuality: ['480p', '720p', '1080p'],
    type: 'video',
    downloadableResources: [
      {
        id: 'resource-1',
        name: 'React Introduction Slides.pdf',
        type: 'pdf',
        url: 'https://example.com/react-intro-slides.pdf',
        size: 2048000,
      },
    ],
    isFree: true,
    isPublished: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-11-01T14:30:00Z',
    viewCount: 15234,
    completionRate: 89.5,
    averageWatchTime: 768,
    dropOffPoints: [120, 300, 600],
  },
  {
    id: 'lecture-2',
    title: 'Setting Up Your Development Environment',
    description:
      'Install Node.js, create-react-app, and set up your code editor for React development.',
    moduleId: 'module-1',
    courseId: 'course-1',
    order: 2,
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    videoDuration: 654,
    videoThumbnail:
      'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400',
    videoQuality: ['480p', '720p', '1080p'],
    type: 'video',
    downloadableResources: [
      {
        id: 'resource-2',
        name: 'Development Setup Guide.pdf',
        type: 'pdf',
        url: 'https://example.com/dev-setup-guide.pdf',
        size: 1536000,
      },
    ],
    isFree: true,
    isPublished: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-11-01T14:30:00Z',
    viewCount: 14892,
    completionRate: 92.3,
    averageWatchTime: 621,
    dropOffPoints: [180, 450],
  },
  {
    id: 'lecture-3',
    title: 'Your First React Component',
    description:
      'Create your first React functional component and understand JSX syntax.',
    moduleId: 'module-1',
    courseId: 'course-1',
    order: 3,
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoDuration: 923,
    videoThumbnail:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
    videoQuality: ['480p', '720p', '1080p'],
    type: 'video',
    downloadableResources: [
      {
        id: 'resource-3',
        name: 'First Component Code.zip',
        type: 'zip',
        url: 'https://example.com/first-component-code.zip',
        size: 512000,
      },
    ],
    isFree: false,
    isPublished: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-11-01T14:30:00Z',
    viewCount: 13567,
    completionRate: 85.7,
    averageWatchTime: 789,
    dropOffPoints: [240, 480, 720],
  },
  {
    id: 'lecture-4',
    title: 'Understanding JSX',
    description:
      'Deep dive into JSX syntax and how it differs from regular JavaScript.',
    moduleId: 'module-1',
    courseId: 'course-1',
    order: 4,
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    videoDuration: 734,
    videoThumbnail:
      'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400',
    videoQuality: ['480p', '720p', '1080p'],
    type: 'video',
    downloadableResources: [],
    isFree: false,
    isPublished: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-11-01T14:30:00Z',
    viewCount: 12890,
    completionRate: 88.2,
    averageWatchTime: 648,
    dropOffPoints: [200, 400, 600],
  },
  {
    id: 'lecture-5',
    title: 'Component Props and Composition',
    description:
      'Learn how to pass data between components using props and compose complex UIs.',
    moduleId: 'module-1',
    courseId: 'course-1',
    order: 5,
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    videoDuration: 1156,
    videoThumbnail:
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400',
    videoQuality: ['480p', '720p', '1080p'],
    type: 'video',
    downloadableResources: [
      {
        id: 'resource-4',
        name: 'Props Examples.zip',
        type: 'zip',
        url: 'https://example.com/props-examples.zip',
        size: 768000,
      },
    ],
    isFree: false,
    isPublished: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-11-01T14:30:00Z',
    viewCount: 11734,
    completionRate: 82.4,
    averageWatchTime: 952,
    dropOffPoints: [300, 600, 900],
  },

  // State Management & Hooks Module Lectures
  {
    id: 'lecture-6',
    title: 'Introduction to React Hooks',
    description:
      'Understand what React hooks are and why they revolutionized React development.',
    moduleId: 'module-2',
    courseId: 'course-1',
    order: 1,
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    videoDuration: 823,
    videoThumbnail:
      'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=400',
    videoQuality: ['480p', '720p', '1080p'],
    type: 'video',
    downloadableResources: [],
    isFree: false,
    isPublished: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-11-01T14:30:00Z',
    viewCount: 10892,
    completionRate: 86.8,
    averageWatchTime: 714,
    dropOffPoints: [180, 420, 660],
  },
  {
    id: 'lecture-7',
    title: 'useState Hook Deep Dive',
    description:
      'Master the useState hook for managing component state in functional components.',
    moduleId: 'module-2',
    courseId: 'course-1',
    order: 2,
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    videoDuration: 1045,
    videoThumbnail:
      'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400',
    videoQuality: ['480p', '720p', '1080p'],
    type: 'video',
    downloadableResources: [
      {
        id: 'resource-5',
        name: 'useState Examples.zip',
        type: 'zip',
        url: 'https://example.com/usestate-examples.zip',
        size: 1024000,
      },
    ],
    isFree: false,
    isPublished: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-11-01T14:30:00Z',
    viewCount: 10234,
    completionRate: 84.1,
    averageWatchTime: 879,
    dropOffPoints: [240, 520, 800],
  },

  // Python Data Science Module Lectures
  {
    id: 'lecture-26',
    title: 'Python Basics for Data Science',
    description:
      'Essential Python concepts you need for data science including variables, data types, and control structures.',
    moduleId: 'module-6',
    courseId: 'course-2',
    order: 1,
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    videoDuration: 888,
    videoThumbnail:
      'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400',
    videoQuality: ['480p', '720p', '1080p'],
    type: 'video',
    downloadableResources: [
      {
        id: 'resource-6',
        name: 'Python Basics Notebook.ipynb',
        type: 'code',
        url: 'https://example.com/python-basics.ipynb',
        size: 256000,
      },
    ],
    isFree: true,
    isPublished: true,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-11-15T16:45:00Z',
    viewCount: 9876,
    completionRate: 91.2,
    averageWatchTime: 810,
    dropOffPoints: [200, 500, 750],
  },
  {
    id: 'lecture-27',
    title: 'Working with Lists and Dictionaries',
    description:
      'Master Python data structures essential for data manipulation.',
    moduleId: 'module-6',
    courseId: 'course-2',
    order: 2,
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    videoDuration: 734,
    videoThumbnail:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400',
    videoQuality: ['480p', '720p', '1080p'],
    type: 'video',
    downloadableResources: [],
    isFree: false,
    isPublished: true,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-11-15T16:45:00Z',
    viewCount: 8934,
    completionRate: 87.6,
    averageWatchTime: 643,
    dropOffPoints: [150, 350, 550],
  },

  // AWS Course Lectures
  {
    id: 'lecture-46',
    title: 'Introduction to Cloud Computing',
    description:
      'Understand the fundamentals of cloud computing and why businesses are moving to the cloud.',
    moduleId: 'module-10',
    courseId: 'course-3',
    order: 1,
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    videoDuration: 905,
    videoThumbnail:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
    videoQuality: ['480p', '720p', '1080p'],
    type: 'video',
    downloadableResources: [
      {
        id: 'resource-7',
        name: 'Cloud Computing Basics.pdf',
        type: 'pdf',
        url: 'https://example.com/cloud-basics.pdf',
        size: 3072000,
      },
    ],
    isFree: true,
    isPublished: true,
    createdAt: '2024-02-01T09:30:00Z',
    updatedAt: '2024-12-10T11:20:00Z',
    viewCount: 7234,
    completionRate: 88.9,
    averageWatchTime: 805,
    dropOffPoints: [220, 450, 680],
  },
  {
    id: 'lecture-47',
    title: 'AWS Global Infrastructure',
    description:
      'Learn about AWS regions, availability zones, and edge locations.',
    moduleId: 'module-10',
    courseId: 'course-3',
    order: 2,
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    videoDuration: 692,
    videoThumbnail:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
    videoQuality: ['480p', '720p', '1080p'],
    type: 'video',
    downloadableResources: [],
    isFree: false,
    isPublished: true,
    createdAt: '2024-02-01T09:30:00Z',
    updatedAt: '2024-12-10T11:20:00Z',
    viewCount: 6892,
    completionRate: 85.4,
    averageWatchTime: 591,
    dropOffPoints: [180, 340, 520],
  },
];

export default sampleLectures;
