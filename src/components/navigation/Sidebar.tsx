import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  FolderPlus, 
  ListChecks,
  UserPlus,
  Home,
  BookMarked,
  User
} from 'lucide-react';

interface SidebarProps {
  userRole: 'admin' | 'manager' | 'student';
}

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const [collapsed, setCollapsed] = useState(false);

  // Define color scheme based on role
  const roleColors = {
    admin: {
      bg: 'bg-blue-700',
      text: 'text-blue-100',
      hover: 'hover:bg-blue-600',
      active: 'bg-blue-800'
    },
    manager: {
      bg: 'bg-green-700',
      text: 'text-green-100',
      hover: 'hover:bg-green-600',
      active: 'bg-green-800'
    },
    student: {
      bg: 'bg-purple-700',
      text: 'text-purple-100',
      hover: 'hover:bg-purple-600',
      active: 'bg-purple-800'
    }
  };

  const colors = roleColors[userRole];

  // Get navigation items based on user role
  const getNavItems = () => {
    switch (userRole) {
      case 'admin':
        return [
          { to: '/admin', icon: <Home size={20} />, text: 'Dashboard' },
          { to: '/admin/batch/create', icon: <FolderPlus size={20} />, text: 'Create Batch' },
          { to: '/admin/batch/manage', icon: <ListChecks size={20} />, text: 'Manage Batches' },
          { to: '/admin/users', icon: <UserPlus size={20} />, text: 'Employee Management' },
          { to: '/admin/subjects', icon: <BookOpen size={20} />, text: 'Subject Editor' },
        ];
      case 'manager':
        return [
          { to: '/manager', icon: <Home size={20} />, text: 'Dashboard' },
          // { to: '/manager/progress', icon: <BarChart3 size={20} />, text: 'Progress Tracking' },
        ];
      case 'student':
        return [
          { to: '/student', icon: <Home size={20} />, text: 'Dashboard' },
          { to: '/student/profile', icon: <User size={20} />, text: 'My Profile' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside 
      className={`${colors.bg} ${
        collapsed ? 'w-16' : 'w-64'
      } transition-all duration-300 ease-in-out flex flex-col h-full`}
    >
      {/* Logo */}
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'px-6'} h-16`}>
        <GraduationCap className="text-white h-8 w-8" />
        {!collapsed && (
          <span className="ml-2 text-xl font-semibold text-white">Mini-LMS</span>
        )}
      </div>

      {/* Role badge */}
      <div className={`${collapsed ? 'mx-auto' : 'mx-6'} mb-6`}>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-white ${
          userRole === 'admin' ? 'text-blue-800' : 
          userRole === 'manager' ? 'text-green-800' : 'text-purple-800'
        }`}>
          {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `flex items-center ${
                collapsed ? 'justify-center' : 'px-4'
              } py-3 rounded-md ${colors.text} ${
                isActive ? colors.active : colors.hover
              } transition-colors duration-200`
            }
          >
            {item.icon}
            {!collapsed && <span className="ml-3">{item.text}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Toggle button */}
      <div className="p-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center justify-center p-2 rounded-md ${colors.text} ${colors.hover} transition-colors duration-200`}
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;