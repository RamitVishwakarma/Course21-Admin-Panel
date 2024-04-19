import loadable from '@loadable/component';

export const SignUp = loadable(() => import('../pages/Authentication/SignUp'));
export const SignIn = loadable(() => import('../pages/Authentication/SignIn'));
export const ProtectedRoute = loadable(() => import('./ProtectedRoute'));
export const CreateCourse = loadable(
  () => import('../pages/Course/CreateCourse'),
);
export const AllCourses = loadable(() => import('../pages/Course/AllCourses'));
