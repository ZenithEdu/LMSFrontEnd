import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/navigation/Sidebar';
import Header from '../components/navigation/Header';

interface DashboardLayoutProps {
  userRole: 'admin' | 'manager' | 'student';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ userRole }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define color scheme based on user role
  const roleColors = {
    admin: 'bg-blue-50 text-blue-800',
    manager: 'bg-green-50 text-green-800',
    student: 'bg-purple-50 text-purple-800',
  };

  // Define accent color based on user role
  const accentColor = {
    admin: 'bg-blue-600',
    manager: 'bg-green-600',
    student: 'bg-purple-600',
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={userRole} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          userName={user?.name || ''} 
          userRole={userRole} 
          onLogout={handleLogout} 
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;