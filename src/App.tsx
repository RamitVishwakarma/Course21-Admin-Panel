import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import Calendar from './pages/not using/Calendar';
import Chart from './pages/not using/Chart';
import ECommerce from './pages/not using/Dashboard/ECommerce';
import FormElements from './pages/not using/Form/FormElements';
import FormLayout from './pages/not using/Form/FormLayout';
import Profile from './pages/not using/Profile';
import Settings from './pages/not using/Settings';
import Tables from './pages/not using/Tables';
import Alerts from './pages/not using/UiElements/Alerts';
import Buttons from './pages/not using/UiElements/Buttons';

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
                <ECommerce />
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
