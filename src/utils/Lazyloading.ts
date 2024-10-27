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
