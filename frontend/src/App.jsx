import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TaskBrowsingPage from './pages/TaskBrowsingPage';
import StudentDashboard from './pages/StudentDashboard';
import MSMEDashboard from './pages/MSMEDashboard';
import MyWorkPage from './pages/MyWorkPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import ApplicationsPage from './pages/ApplicationsPage';
import TaskApplicantsPage from './pages/TaskApplicantsPage';
import { NotificationProvider } from './contexts/NotificationContext';
import { SocketProvider } from './contexts/SocketContext';
import Layout from './components/Layout';

import CreateTaskPage from './pages/CreateTaskPage';

// Layout wrapper for authenticated routes
const AuthenticatedLayout = ({ children }) => (
  <Layout>{children}</Layout>
);

// Animated Routes Component
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route path="/tasks" element={<AuthenticatedLayout><TaskBrowsingPage /></AuthenticatedLayout>} />
        <Route path="/tasks/new" element={<AuthenticatedLayout><CreateTaskPage /></AuthenticatedLayout>} />
        <Route path="/dashboard/student" element={<AuthenticatedLayout><StudentDashboard /></AuthenticatedLayout>} />
        <Route path="/dashboard/msme" element={<AuthenticatedLayout><MSMEDashboard /></AuthenticatedLayout>} />
        <Route path="/my-work" element={<AuthenticatedLayout><MyWorkPage /></AuthenticatedLayout>} />
        <Route path="/messages" element={<AuthenticatedLayout><MessagesPage /></AuthenticatedLayout>} />
        <Route path="/profile" element={<AuthenticatedLayout><ProfilePage /></AuthenticatedLayout>} />
        <Route path="/applications" element={<AuthenticatedLayout><ApplicationsPage /></AuthenticatedLayout>} />
        <Route path="/tasks/:id/applicants" element={<AuthenticatedLayout><TaskApplicantsPage /></AuthenticatedLayout>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <Router>
            <AnimatedRoutes />
          </Router>
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
