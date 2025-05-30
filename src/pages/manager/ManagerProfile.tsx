import React, { useState, useEffect } from 'react';
import { Mail, Phone, Shield } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface ManagerProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
}

const ManagerProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ManagerProfile>({
    name: '',
    email: '',
    phone: '',
    role: 'MANAGER'
  });

  useEffect(() => {
    const userDataString = localStorage.getItem('user');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setProfile({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        role: userData.role || 'MANAGER'
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Profile Header with Gradient */}
          <div className="h-48 bg-gradient-to-r from-green-600 to-green-800 relative">
            <div className="absolute bottom-0 left-0 right-0 px-8 pb-8 flex justify-between items-end">
              <div className="flex items-end">
                <div className="ml-6 mb-2">
                  <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                  <p className="text-green-100 flex items-center">
                    <Shield size={14} className="mr-1" />
                    {profile.role}
                  </p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="text-white hover:text-green-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-2">
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <Mail className="text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{profile.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <Phone className="text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{profile.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    Change Password
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    Security Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerProfilePage;
