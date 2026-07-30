import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/dashboard/Dashboard';
import Advisor from './pages/advisor/Advisor';
import Scheduler from './pages/scheduler/Scheduler';
import Water from './pages/water/Water';
import GridMonitor from './pages/grid/GridMonitor';
import Hardware from './pages/hardware/Hardware';
import EcoScore from './pages/ecoscore/EcoScore';
import Reports from './pages/reports/Reports';

const Landing = lazy(() => import('./pages/landing/Landing'));

function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" /></div>}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/advisor" element={<Layout><Advisor /></Layout>} />
        <Route path="/scheduler" element={<Layout><Scheduler /></Layout>} />
        <Route path="/water" element={<Layout><Water /></Layout>} />
        <Route path="/grid" element={<Layout><GridMonitor /></Layout>} />
        <Route path="/hardware" element={<Layout><Hardware /></Layout>} />
        <Route path="/ecoscore" element={<Layout><EcoScore /></Layout>} />
        <Route path="/reports" element={<Layout><Reports /></Layout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;