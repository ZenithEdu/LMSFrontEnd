import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  college: string;
  branch: string | null;
  registrationNumber: string;
  contactNumber: string;
  phone: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  batch: {
    id: string;
    name: string;
  };
}

const StudentProfile: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!user.id) {
          throw new Error('User ID not found');
        }

        const response = await axios.get(
          `https://lmsbackend-3l0h.onrender.com/api/student/${user.id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        setProfile(response.data);
        // Store the profile data in localStorage for future use
        localStorage.setItem('studentProfile', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching student profile:', error);
        toast.error('Failed to load student profile');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/auth/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load profile information</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Profile Header with Gradient */}
          <div className="h-48 bg-gradient-to-r from-purple-600 to-purple-800 relative">
            <div className="absolute bottom-0 left-0 right-0 px-8 pb-8 flex justify-between items-end">
              <div className="flex items-end">
                <div className="ml-6 mb-2">
                  <h1 className="text-2xl font-bold text-white">{profile?.name}</h1>
                  <p className="text-purple-100">Student</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="text-white hover:text-purple-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{profile?.email}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{profile?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Academic Information</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Registration Number</p>
                    <p className="font-medium">{profile?.registrationNumber}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Batch</p>
                    <p className="font-medium">{profile?.batch?.name || 'Not assigned'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
