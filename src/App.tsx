import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Loader from './components/ui/loader';

import {
  SignIn,
  ProtectedRoute,
  CourseDashboard,
  ViewCourse,
  ViewModule,
  ManageUser,
  ManageRole,
  QuizCreate,
  LectureList,
  StreamLecture,
  UserDashboard,
  QuizTakeTest,
  AdvancedAnalytics,
  Dashboard,
  DataManagement,
  GlobalSearch,
  PageTitle,
  QuickActionsMenu,
} from './utils/Lazyloading';

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
            path="view-course/:courseId/view-module/:moduleId"
            element={
              <>
                <PageTitle title="Module | View " />
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
          <Route
            path="course/:courseId/module/:moduleId/lectures"
            element={
              <>
                <PageTitle title="Lectures | Management" />
                <LectureList />
              </>
            }
          />
          <Route
            path="course/:courseId/module/:moduleId/lecture/:lectureId/stream"
            element={
              <>
                <PageTitle title="Lecture | Stream" />
                <StreamLecture />
              </>
            }
          />
          <Route
            path="users/:userId"
            element={
              <>
                <PageTitle title="User | Dashboard" />
                <UserDashboard />
              </>
            }
          />
          <Route
            path="quiz/:quizId/take"
            element={
              <>
                <PageTitle title="Quiz | Take Test" />
                <QuizTakeTest />
              </>
            }
          />
          <Route
            path="analytics"
            element={
              <>
                <PageTitle title="Advanced | Analytics" />
                <AdvancedAnalytics />
              </>
            }
          />
          <Route
            path="data-management"
            element={
              <>
                <PageTitle title="Data | Management" />
                <DataManagement />
              </>
            }
          />
          <Route
            path="global-search"
            element={
              <>
                <PageTitle title="Global | Search" />
                <GlobalSearch />
              </>
            }
          />
        </Route>
        {/* Quick Actions Menu - shows on all protected routes */}
        <Route path="/admin/*" element={<QuickActionsMenu />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
