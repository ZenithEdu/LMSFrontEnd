import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import CreatePassword from './pages/auth/CreatePassword';
import AdminDashboard from './pages/admin/Dashboard';
import BatchCreation from './pages/admin/BatchCreation';
import BatchManagement from './pages/admin/BatchManagement';
import UserManagement from './pages/admin/UserManagement';
import SubjectEditor from './pages/admin/SubjectEditor';
import ManagerDashboard from './pages/manager/Dashboard';
import SubjectManagement from './pages/manager/SubjectManagement';
import ProgressTracking from './pages/manager/ProgressTracking';
import StudentDashboard from './pages/student/Dashboard';
import TopicExplorer from './pages/student/TopicExplorer';
import SubjectResources from './pages/student/SubjectResources';
import AdminProfile from './pages/admin/AdminProfile';
import ManagerProfile from './pages/manager/ManagerProfile';
import StudentProfile from './pages/student/StudentProfile';

import { RequireAuth } from './components/guards/RequireAuth';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/create-password" element={<CreatePassword />} />
          </Route>

          {/* Admin Routes */}
          <Route
            element={
              <RequireAuth allowedRoles={['admin']}>
                <DashboardLayout userRole="admin" />
              </RequireAuth>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/batch/create" element={<BatchCreation />} />
            <Route path="/admin/batch/manage" element={<BatchManagement />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/subjects" element={<SubjectEditor />} />
          </Route>

          {/* Manager Routes */}
          <Route
            element={
              <RequireAuth allowedRoles={['manager']}>
                <DashboardLayout userRole="manager" />
              </RequireAuth>
            }
          >
            <Route path="/manager" element={<ManagerDashboard />} />
            <Route path="/manager/profile" element={<ManagerProfile />} />
            <Route path="/manager/batch/:batchId" element={<SubjectManagement />} />
            <Route path="/manager/progress" element={<ProgressTracking />} />
          </Route>

          {/* Student Routes */}
          <Route
            element={
              <RequireAuth allowedRoles={['student']}>
                <DashboardLayout userRole="student" />
              </RequireAuth>
            }
          >
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/subject/:subjectId" element={<SubjectResources />} />
          </Route>

          {/* Redirect to login if not authenticated */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;