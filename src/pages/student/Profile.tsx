import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Building, GraduationCap, BookOpen, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: '+1234567890',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Mock progress data
  const progressData = {
    completedTopics: 45,
    totalTopics: 75,
    averageScore: 85,
    lastActive: '2024-02-15',
    subjects: [
      {
        name: 'Data Structures & Algorithms',
        progress: 75,
        lastAccessed: '2024-02-15'
      },
      {
        name: 'Database Management Systems',
        progress: 60,
        lastAccessed: '2024-02-14'
      },
      {
        name: 'Operating Systems',
        progress: 30,
        lastAccessed: '2024-02-13'
      }
    ]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    // In a real app, this would make an API call
    toast.success('Profile updated successfully');
    setIsEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        {/* Profile Information */}
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
            <p className="mt-1 text-sm text-gray-600">
              Your personal information and academic details.
            </p>
          </div>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                  <p className="text-sm text-gray-500">Student</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="h-5 w-5 mr-2" />
                    {user?.email}
                  </div>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="h-5 w-5 mr-2" />
                    +1234567890
                  </div>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Building className="h-5 w-5 mr-2" />
                    {user?.college}
                  </div>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-500">
                    <GraduationCap className="h-5 w-5 mr-2" />
                    {user?.branch}
                  </div>
                </div>
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-6">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Progress */}
      <div className="mt-10 md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Learning Progress</h3>
            <p className="mt-1 text-sm text-gray-600">
              Your overall progress and performance metrics.
            </p>
          </div>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {/* Progress Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Completed Topics</p>
                      <p className="mt-1 text-2xl font-semibold text-purple-900">
                        {progressData.completedTopics}/{progressData.totalTopics}
                      </p>
                    </div>
                    <BookOpen className="h-8 w-8 text-purple-500" />
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Average Score</p>
                      <p className="mt-1 text-2xl font-semibold text-green-900">
                        {progressData.averageScore}%
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Last Active</p>
                      <p className="mt-1 text-2xl font-semibold text-blue-900">
                        {new Date(progressData.lastActive).toLocaleDateString()}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
              </div>

              {/* Subject Progress */}
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Subject Progress</h4>
                <div className="space-y-4">
                  {progressData.subjects.map((subject, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-medium text-gray-900">{subject.name}</h5>
                        <span className="text-sm text-gray-500">
                          Last accessed: {new Date(subject.lastAccessed).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-purple-600">
                              Progress
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-purple-600">
                              {subject.progress}%
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                          <div
                            style={{ width: `${subject.progress}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;