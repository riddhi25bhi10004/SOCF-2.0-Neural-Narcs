import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Layout from './components/Layout/layout';
import Scheduler from './pages/scheduler/scheduler';
import Water from './pages/water/water';
import GridMonitor from './pages/grid/GridMonitor';
import Hardware from './pages/hardware/hardware';
import EcoScore from './pages/ecoscore/ecoscore';
import Reports from './pages/reports/reports';

const Landing = lazy(() => import('./pages/landing/Landing'));
const Login = lazy(() => import('./pages/login/Login'));
const DataCenterPage = lazy(() => import('./pages/datacenter/DataCenterPage'));
const DataCenterDashboard = lazy(() => import('./pages/datacenter/DataCenterDashboard'));

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" /></div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/datacenter/:slug" element={<DataCenterPage />} />

          {/* Protected Routes */}
          <Route path="/scheduler" element={
            <ProtectedRoute>
              <Layout><Scheduler /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/:slug" element={
            <ProtectedRoute>
              <Layout><DataCenterDashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/water" element={
            <ProtectedRoute>
              <Layout><Water /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/grid" element={
            <ProtectedRoute>
              <Layout><GridMonitor /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/hardware" element={
            <ProtectedRoute>
              <Layout><Hardware /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/ecoscore" element={
            <ProtectedRoute>
              <Layout><EcoScore /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <Layout><Reports /></Layout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;