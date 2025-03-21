import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';

import {
  SignIn,
  ProtectedRoute,
  CourseDashboard,
  ViewCourse,
  ViewModule,
  ManageUser,
  ManageRole,
  QuizCreate,
} from './utils/Lazyloading';
import { Toaster } from './components/ui/toaster';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/signin" />} />
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin | Course21 " />
              <SignIn />
            </>
          }
        />

        <Route path="/admin/" element={<ProtectedRoute />}>
          <Route
            path="course-dashboard"
            element={
              <>
                <PageTitle title="Course | Dashboard " />
                <CourseDashboard />
              </>
            }
          />
          <Route
            path="view-course/:id"
            element={
              <>
                <PageTitle title="Course | View " />
                <ViewCourse />
              </>
            }
          />
          <Route
            path="view-course/:id/view-module/:id"
            element={
              <>
                <PageTitle title="Module | View " />
                <ViewModule />
              </>
            }
          />
          <Route
            path="view-course/:id/view-module/:id"
            element={
              <>
                <PageTitle title="User | Manage " />
                <ViewModule />
              </>
            }
          />
          <Route
            path="manage-user"
            element={
              <>
                <PageTitle title="User | Manage " />
                <ManageUser />
              </>
            }
          />
          <Route
            path="manage-role"
            element={
              <>
                <PageTitle title="Role | Manage " />
                <ManageRole />
              </>
            }
          />

          <Route
            path="dashboard"
            element={
              <>
                <PageTitle title="Course21 | Dashboard" />
                <Dashboard />
              </>
            }
          />
          <Route
            path="quiz-create"
            element={
              <>
                <PageTitle title="Course21 | Quiz-Create" />
                <QuizCreate />
              </>
            }
          />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
