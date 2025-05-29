import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Calendar, Users, Clock, ArrowUpRight, BookOpen, Loader } from 'lucide-react';
import StudentRegistrationModal from './StudentRegistrationModal';

interface BatchCard {
  name: string;
  batchId: string;
  startDate: string;
  endDate: string;
  managerName: string;
  subjects: string[];
  numberOfStudents: number;
}

const ManagerDashboard: React.FC = () => {
  const [batches, setBatches] = useState<BatchCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (!userData) {
          throw new Error('User data not found');
        }

        const user = JSON.parse(userData);
        const managerId = user.id; // Use id from user object

        const response = await axios.get(
          `https://lmsbackend-3l0h.onrender.com/api/batches/manager/${managerId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        // Store batch data in localStorage
        localStorage.setItem('batchData', JSON.stringify(response.data));
        setBatches(response.data || []);
      } catch (error) {
        // Try to get data from localStorage if API fails
        const cachedData = localStorage.getItem('batchData');
        if (cachedData) {
          setBatches(JSON.parse(cachedData));
        }
        console.error('Error fetching batches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  // Format date to display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate days remaining
  const calculateDaysRemaining = (endDateString: string) => {
    const endDate = new Date(endDateString);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get card style based on batch status
  const getCardStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'border-green-200 bg-white';
      case 'expired':
        return 'border-red-200 bg-red-50';
      case 'expiring-soon':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader className="h-8 w-8 text-green-600 animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Assigned Batches</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add a Student
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.length > 0 ? (
              batches.map((batch) => (
                <Link 
                  key={batch.batchId}
                  to={`/manager/batch/${batch.batchId}`}
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('token');
                      // Fetch batch data
                      const batchResponse = await axios.get(
                        `https://lmsbackend-3l0h.onrender.com/api/batches/${batch.batchId}`,
                        {
                          headers: {
                            'Authorization': `Bearer ${token}`
                          }
                        }
                      );
                      
                      // Store batch response
                      localStorage.setItem('currentBatch', JSON.stringify(batchResponse.data));

                      // Get subject ID from batch response
                      const subjectIds = batchResponse.data.subjects.map((s: any) => s.subjectId);
                      
                      // Fetch topics for each subject
                      for (const subjectId of subjectIds) {
                        const topicsResponse = await axios.get(
                          `https://lmsbackend-3l0h.onrender.com/api/content/subject/${subjectId}/topic`,
                          {
                            headers: {
                              'Authorization': `Bearer ${token}`
                            }
                          }
                        );
                        
                        // Store topics in localStorage with subject ID as key
                        localStorage.setItem(`topics_${subjectId}`, JSON.stringify(topicsResponse.data));
                        console.log(`Topics for subject ${subjectId}:`, topicsResponse.data);
                      }

                    } catch (error) {
                      console.error('Error fetching data:', error);
                    }
                  }}
                  className="block rounded-lg border border-gray-200 bg-white shadow-sm transition transform hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-900">{batch.name}</h3>
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1.5 text-gray-500" />
                        <span>
                          {formatDate(batch.startDate)} - {formatDate(batch.endDate)}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-1.5 text-gray-500" />
                        <span>{batch.numberOfStudents} Students</span>
                      </div>

                      <div className="flex items-center text-sm">
                        <BookOpen className="h-4 w-4 mr-1.5 text-gray-500" />
                        <div className="flex flex-wrap gap-1">
                          {batch.subjects.map((subject, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center text-green-700 hover:text-green-800">
                      <span className="text-sm font-medium">Manage Batch</span>
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center py-8">
                No batches assigned yet.
              </p>
            )}
          </div>

          <StudentRegistrationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            batches={batches}
          />
        </>
      )}
    </div>
  );
};

export default ManagerDashboard;