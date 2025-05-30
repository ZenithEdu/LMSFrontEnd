import React, { useState } from 'react';
import { Bell, User, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

interface HeaderProps {
  userName: string;
  userRole: 'admin' | 'manager' | 'student';
}

const Header: React.FC<HeaderProps> = ({ userName, userRole }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { logout } = useAuth();

  // Role-based colors
  const roleColors = {
    admin: 'bg-blue-600 hover:bg-blue-700',
    manager: 'bg-green-600 hover:bg-green-700',
    student: 'bg-purple-600 hover:bg-purple-700',
  };

  const buttonColor = roleColors[userRole];

  // Short form of the name for avatar
  const nameInitials = userName
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    await logout();
  };

  const getProfilePath = () => {
    switch (userRole) {
      case 'admin':
        return '/admin/profile';
      case 'manager':
        return '/manager/profile';
      case 'student':
        return '/student/profile';
      default:
        return '/';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          
          {/* Title */}
          <div className="md:flex-1 flex justify-start items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              {userRole === 'admin' ? 'Admin Dashboard' : 
               userRole === 'manager' ? 'Manager Dashboard' : 'Student Portal'}
            </h1>
          </div>
          
          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
            </button>
            
            {/* Profile dropdown */}
            <div className="relative">
              <button 
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className={`relative rounded-full w-8 h-8 flex items-center justify-center ${userRole === 'admin' ? 'bg-blue-100 text-blue-800' : userRole === 'manager' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                  <span>{nameInitials}</span>
                </div>
                <span className="hidden md:inline-block font-medium text-gray-700">{userName}</span>
              </button>
              
              {/* Dropdown menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                    <p className="font-medium">{userName}</p>
                  </div>
                  <Link 
                    to={getProfilePath()} 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Your Profile
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;