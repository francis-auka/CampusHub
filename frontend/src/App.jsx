import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import Layout from './components/Layout';

import CreateTaskPage from './pages/CreateTaskPage';

// Layout wrapper for authenticated routes
const AuthenticatedLayout = ({ children }) => (
  <Layout>{children}</Layout>
);

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
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
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
