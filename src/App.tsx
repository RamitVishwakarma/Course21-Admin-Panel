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
} from './utils/Lazyloading';
import { Toaster } from './components/ui/toaster';
import Dashboard from './pages/Dashboard/Dashboard';
import QuizCreationContainer from './components/quiz/QuizCreationContainer';
import QuizCreate from './components/quiz/Page';

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

        {/* <Route
          path="/sjske"
          element={
            <>
              <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <ECommerce />
            </>
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Calendar />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Profile />
            </>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <FormElements />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <FormLayout />
            </>
          }
        />

        <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Tables />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Settings />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Chart />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Alerts />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Buttons />
            </>
          }
        /> */}
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
