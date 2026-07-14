import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './constants/routes';
import { Loader } from './components/ui/Loader';

// Layouts
import MainLayout from './layouts/MainLayout';

// Components
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Lazy-loaded Pages
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CreateExam = lazy(() => import('./pages/CreateExam'));
const Scanner = lazy(() => import('./pages/Scanner'));
const Results = lazy(() => import('./pages/Results'));
const StudentDetails = lazy(() => import('./pages/StudentDetails'));

// Global Fallback Loader
const PageLoader = () => (
  <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center">
    <div className="flex flex-col items-center">
      <Loader size="lg" className="text-primary mb-4" />
      <p className="text-sm font-medium text-gray-500">Loading module...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Route */}
          <Route path={ROUTES.HOME} element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={ROUTES.CREATE_EXAM} element={<CreateExam />} />
              <Route path={ROUTES.SCANNER} element={<Scanner />} />
              <Route path={ROUTES.RESULTS} element={<Results />} />
              <Route path={ROUTES.STUDENT_DETAILS()} element={<StudentDetails />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
