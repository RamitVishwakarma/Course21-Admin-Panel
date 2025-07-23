import loadable from '@loadable/component';

export const SignIn = loadable(() => import('../pages/Authentication/SignIn'));
export const ProtectedRoute = loadable(() => import('./ProtectedRoute'));
export const CourseDashboard = loadable(
  () => import('../pages/Course/CourseDashboard'),
);
export const ViewCourse = loadable(
  () => import('../pages/Course/ViewCourse/ViewCourse'),
);
export const ViewModule = loadable(() => import('../pages/Modules/ViewModule'));
export const ManageUser = loadable(
  () => import('../pages/User Management/ManageUser'),
);
export const ManageRole = loadable(
  () => import('../pages/Role Manager/ManageRole'),
);
export const QuizCreate = loadable(() => import('../pages/Quiz/Page'));

// Phase 3 & 4 - Lecture Management
export const LectureList = loadable(
  () => import('../pages/Lectures/LectureList'),
);
export const StreamLecture = loadable(
  () => import('../pages/Lectures/StreamLecture'),
);

// Phase 4 - User Management
export const UserDashboard = loadable(
  () => import('../pages/User Management/UserDashboard'),
);

// Phase 5 - Quiz System
export const QuizTakeTest = loadable(
  () => import('../pages/Quiz/QuizTakeTest'),
);

// Phase 6 - Analytics & Dashboard
export const AdvancedAnalytics = loadable(
  () => import('../pages/Analytics/AdvancedAnalytics'),
);
export const Dashboard = loadable(() => import('../pages/Dashboard/Dashboard'));

// Phase 8 - Data Management & Search
export const DataManagement = loadable(
  () => import('../pages/Admin/DataManagement'),
);
export const GlobalSearch = loadable(
  () => import('../pages/Search/GlobalSearch'),
);

// Phase 9 - Demo & Showcase
export const DemoShowcase = loadable(
  () => import('../pages/Demo/DemoShowcase'),
);

// Common Components (already loaded, but for consistency)
export const PageTitle = loadable(() => import('../components/PageTitle'));
export const QuickActionsMenu = loadable(
  () => import('../components/QuickActionsMenu'),
);
