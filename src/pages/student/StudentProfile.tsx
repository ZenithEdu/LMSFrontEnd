import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-400 px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-purple-600">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-purple-100">Student</p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information Section */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Contact Information
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-purple-600">Email</label>
                  <p className="mt-1 text-gray-900">{profile.email}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-purple-600">Phone Number</label>
                  <p className="mt-1 text-gray-900">{profile.phone}</p>
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Personal Information
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-purple-600">Gender</label>
                  <p className="mt-1 text-gray-900">
                    {profile.gender.charAt(0) + profile.gender.slice(1).toLowerCase()}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-purple-600">Batch</label>
                  <p className="mt-1 text-gray-900">{profile.batch?.name || 'Not assigned'}</p>
                </div>

                
              </div>
            </div>
          </div>

          {/* Additional Information Card */}
          <div className="mt-8 bg-purple-50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-purple-900">Current Batch</h3>
                <p className="text-purple-600">{profile.batch?.name || 'Not assigned'}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
