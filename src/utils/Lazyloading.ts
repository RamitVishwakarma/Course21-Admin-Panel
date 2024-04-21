import loadable from '@loadable/component';

export const SignUp = loadable(() => import('../pages/Authentication/SignUp'));
export const SignIn = loadable(() => import('../pages/Authentication/SignIn'));
export const ProtectedRoute = loadable(() => import('./ProtectedRoute'));
export const CreateCourse = loadable(
  () => import('../pages/Course/CreateCourse'),
);
export const CourseDashboard = loadable(
  () => import('../pages/Course/CourseDashboard'),
);
export const UpdateCourse = loadable(
  () => import('../pages/Course/UpdateCourse'),
);

export const ViewCourse = loadable(() => import('../pages/Course/ViewCourse'));
