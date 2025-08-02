import  { useEffect, useState } from 'react';
import { Users, Layers, BookOpen, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { loadBatchesFromStorage, loadSubjectsFromStorage } from '../../utils/storage';
import axios from 'axios';
import config from '../../config';

export interface Batch {
  id: string;
  name: string;
  collegeName: string;
  startDate: string;
  endDate: string;
  managers: string[];
  students?: string[]; // Add this for student tracking
}

function AdminDashboard() {
  // Keep initial loading state
  const [stats, setStats] = useState([
    {
      id: 1,
      name: 'Total Batches',
      value: '0',
      icon: <Layers className="h-6 w-6 text-blue-600" />,
      change: 'Loading...',
      link: '/admin/batch/manage'
    },
    {
      id: 2,
      name: 'Active Students',
      value: '0',
      icon: <Users className="h-6 w-6 text-blue-600" />,
      change: 'Loading...',
      link: '/admin/users'
    },
    {
      id: 3,
      name: 'Subjects',
      value: '0',
      icon: <BookOpen className="h-6 w-6 text-blue-600" />,
      change: 'Loading...',
      link: '/admin/subjects'
    }
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const [batchCountResponse, studentCountResponse, subjectCountResponse] = await Promise.all([
          axios.get(`${config.API_BASE_URL}/admin/batchCount`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get(`${config.API_BASE_URL}/admin/studentCount`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get(`${config.API_BASE_URL}/admin/subjectCount`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        const batchCount = batchCountResponse.data;
        const studentCount = studentCountResponse.data;
        const subjectCount = subjectCountResponse.data;

        setStats(prevStats => prevStats.map(stat => {
          if (stat.name === 'Total Batches') {
            return {
              ...stat,
              value: batchCount.toString(),
              change: `${batchCount === 0 ? 'No batches yet' : 
                batchCount === 1 ? '1 active batch' : 
                `${batchCount} active batches`}`
            };
          }
          if (stat.name === 'Active Students') {
            return {
              ...stat,
              value: studentCount.toString(),
              change: studentCount === 0 ? 'No students yet' :
                `${studentCount === 1 ? '1 student' : `${studentCount} students`}`
            };
          }
          if (stat.name === 'Subjects') {
            return {
              ...stat,
              value: subjectCount.toString(),
              change: subjectCount === 0 ? 'No subjects yet' :
                `${subjectCount === 1 ? '1 subject' : `${subjectCount} subjects`}`
            };
          }
          return stat;
        }));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  // useEffect(() => {
  //   try {
  //     // Load data from localStorage with debug logs
  //     const batches = loadBatchesFromStorage();
  //     const subjects = loadSubjectsFromStorage();
      
  //     console.log('Raw batches:', batches); // Debug log

  //     // First validate batches
  //     const validBatches = batches.filter(batch => 
  //       batch && 
  //       typeof batch === 'object' &&
  //       batch.id &&
  //       batch.name &&
  //       batch.collegeName
  //     );

  //     console.log('Valid batches:', validBatches); // Debug log

  //     // Calculate students only from valid batches
  //     const totalStudents = validBatches.reduce((acc, batch) => {
  //       const studentCount = Array.isArray(batch.students) ? batch.students.length : 0;
  //       console.log(`Batch ${batch.name} students:`, studentCount); // Debug per batch
  //       return acc + studentCount; // This line was missing the return statement
  //     }, 0);

  //     console.log('Total students calculated:', totalStudents); // Debug log

  //     // Update stats with validated data
  //     setStats([
  //       {
  //         id: 1,
  //         name: 'Total Batches',
  //         value: validBatches.length.toString(),
  //         icon: <Layers className="h-6 w-6 text-blue-600" />,
  //         change: `${validBatches.length === 0 ? 'No batches yet' : 
  //           validBatches.length === 1 ? '1 active batch' : 
  //           `${validBatches.length} active batches`}`,
  //         link: '/admin/batch/manage'
  //       },
  //       {
  //         id: 2,
  //         name: 'Active Students',
  //         value: totalStudents.toString(),
  //         icon: <Users className="h-6 w-6 text-blue-600" />,
  //         change: totalStudents === 0 ? 'No students yet' :
  //           `Across ${validBatches.length} ${validBatches.length === 1 ? 'batch' : 'batches'}`,
  //         link: '/admin/users'
  //       },
  //       {
  //         id: 3,
  //         name: 'Subjects',
  //         value: (subjects?.length || 0).toString(),
  //         icon: <BookOpen className="h-6 w-6 text-blue-600" />,
  //         change: subjects.length === 0 ? 'No subjects yet' :
  //           `${subjects.length === 1 ? '1 subject' : `${subjects.length} subjects`}`,
  //         link: '/admin/subjects'
  //       }
  //     ]);

  //   } catch (error) {
  //     console.error('Error in dashboard:', error);
  //     // Keep the loading state in case of error
  //   }
  // }, []); // Empty dependency array for single load

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Action Points</h1>
        <div className="flex space-x-3">
          <Link
            to="/admin/batch/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create New Batch
          </Link>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className={`bg-white overflow-hidden shadow rounded-lg transition-all duration-200 hover:shadow-md`}
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {stat.icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                  </dd>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3 flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium text-gray-500">
                  {stat.change}
                </span>
              </div>
              <Link to={stat.link} className="text-blue-600 hover:text-blue-800 flex items-center">
                <span className="text-sm font-medium">View</span>
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          <Link to="/admin/batch/create" className="p-6 hover:bg-gray-50 transition-colors duration-150 flex flex-col items-center text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Create New Batch</h3>
            <p className="mt-2 text-sm text-gray-500">Set up a new batch with students and assign managers.</p>
          </Link>
          <Link to="/admin/users" className="p-6 hover:bg-gray-50 transition-colors duration-150 flex flex-col items-center text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Manage Employee</h3>
            <p className="mt-2 text-sm text-gray-500">Add or modify managers and view accounts.</p>
          </Link>
          <Link to="/admin/subjects" className="p-6 hover:bg-gray-50 transition-colors duration-150 flex flex-col items-center text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Edit Subjects</h3>
            <p className="mt-2 text-sm text-gray-500">Create and modify subjects, topics, and educational resources.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;