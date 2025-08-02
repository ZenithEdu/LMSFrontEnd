import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trash2, Eye, Calendar, Users, Clock, ArrowUpRight, BookOpen, Loader, Search, Filter, ChevronDown, RotateCw } from 'lucide-react';
import axios from 'axios';
import config from '../../config';

interface Batch {
  id: string;
  name: string;
  college: string;
  managers: string[];
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'upcoming';
  studentCount: number;
  subjects: string[];
}

const calculateStatus = (startDate: string, endDate: string): 'active' | 'expired' | 'upcoming' => {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (today < start) {
    return 'upcoming';
  } else if (today > end) {
    return 'expired';
  } else {
    return 'active';
  }
};

const ManagerTags: React.FC<{ managers: string[] }> = ({ managers }) => {
  if (!managers || managers.length === 0) {
    return <span className="text-gray-400">No managers assigned</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {managers.map((manager, index) => (
        <span
          key={index}
          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
        >
          {manager}
        </span>
      ))}
    </div>
  );
};

const BatchManagement: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [batchList, setBatchList] = useState<Batch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showExtendModal, setShowExtendModal] = useState<string | null>(null);
  const [newEndDate, setNewEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCleanupLoading, setIsCleanupLoading] = useState(false);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${config.API_BASE_URL}/batches`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Updated transformation to handle managerName
        const transformedBatches = data.map((batch: any) => ({
          id: batch._id || batch.id,
          name: batch.name || 'Unnamed Batch',
          college: batch.college || 'Unknown College',
          managers: batch.managerName ? [batch.managerName] : [], // Convert managerName to array
          startDate: batch.startDate || new Date().toISOString(),
          endDate: batch.endDate || new Date().toISOString(),
          status: calculateStatus(batch.startDate, batch.endDate),
          studentCount: batch.numberOfStudents || 0,
          subjects: batch.subjects || []
        }));

        setBatchList(transformedBatches);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching batches:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch batches');
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  useEffect(() => {
    if (location.state?.newBatch) {
      setBatchList(prev => {
        const exists = prev.some(batch => batch.id === location.state.newBatch.id);
        if (!exists) {
          return [location.state.newBatch, ...prev];
        }
        return prev;
      });
      
      navigate('.', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const filteredBatches = batchList.filter((batch) => {
    if (!batch) return false;
    
    const batchName = batch.name?.toLowerCase() || '';
    const batchCollege = batch.college?.toLowerCase() || '';
    const batchId = batch.id?.toLowerCase() || '';
    const searchTermLower = searchTerm.toLowerCase();

    const matchesSearch = 
      batchName.includes(searchTermLower) || 
      batchCollege.includes(searchTermLower) || 
      batchId.includes(searchTermLower);
                          
    const matchesFilter = filterStatus === 'all' || batch.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDeleteBatch = async (batchId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${config.API_BASE_URL}/batches/${batchId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setBatchList(prev => prev.filter(batch => batch.id !== batchId));
      setShowDeleteModal(null);
    } catch (err) {
      console.error('Error deleting batch:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete batch');
    }
  };

  const handleExtendValidity = async (batchId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${config.API_BASE_URL}/batches/${batchId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          endDate: newEndDate
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setBatchList(prev => 
        prev.map(batch => 
          batch.id === batchId 
            ? { 
                ...batch, 
                endDate: newEndDate, 
                status: calculateStatus(batch.startDate, newEndDate) 
              }
            : batch
        )
      );
      setShowExtendModal(null);
      setNewEndDate('');
    } catch (err) {
      console.error('Error extending batch validity:', err);
      setError(err instanceof Error ? err.message : 'Failed to extend batch validity');
    }
  };

  const handleTriggerCleanup = async () => {
    try {
      setIsCleanupLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.post(
        `${config.API_BASE_URL}/batches/trigger-cleanup`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Fetch updated batch list after cleanup
      const response = await axios.get(
        `${config.API_BASE_URL}/batches`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const transformedBatches = response.data.map((batch: any) => ({
        id: batch._id || batch.id,
        name: batch.name || 'Unnamed Batch',
        college: batch.college || 'Unknown College',
        managers: batch.managerName ? [batch.managerName] : [],
        startDate: batch.startDate || new Date().toISOString(),
        endDate: batch.endDate || new Date().toISOString(),
        status: calculateStatus(batch.startDate, batch.endDate),
        studentCount: batch.numberOfStudents || 0,
        subjects: batch.subjects || []
      }));

      setBatchList(transformedBatches);
      alert('Cleanup triggered successfully');
    } catch (err) {
      console.error('Error triggering cleanup:', err);
      alert('Failed to trigger cleanup');
    } finally {
      setIsCleanupLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Batch Management</h1>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <div className="relative rounded-md shadow-sm flex-1 sm:flex-none sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search batches"
            />
          </div>
          
          <div className="relative inline-flex">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="focus:ring-blue-500 focus:border-blue-500 w-full pl-10 pr-10 py-2 text-base border-gray-300 rounded-md appearance-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="upcoming">Upcoming</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <button
            onClick={handleTriggerCleanup}
            disabled={isCleanupLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isCleanupLoading ? (
              <RotateCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RotateCw className="h-4 w-4 mr-2" />
            )}
            Batch Cleanup
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch ID
                </th> */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch Name
                </th>
                {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  College
                </th> */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Managers
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subjects
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Validity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {/* <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBatches.length > 0 ? (
                filteredBatches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-gray-50">
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {batch.id}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {batch.name}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {batch.college}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ManagerTags managers={batch.managers} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {batch.subjects.map((subject, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {batch.studentCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(batch.startDate)} - {formatDate(batch.endDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(batch.status)}`}>
                        {formatStatus(batch.status)}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        title="View Students"
                      >
                        <Eye className="h-5 w-5 inline" />
                      </button>
                      <button 
                        className="text-yellow-600 hover:text-yellow-900"
                        onClick={() => setShowExtendModal(batch.id)}
                        title="Extend Validity"
                      >
                        <Calendar className="h-5 w-5 inline" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => setShowDeleteModal(batch.id)}
                        title="Delete Batch"
                      >
                        <Trash2 className="h-5 w-5 inline" />
                      </button>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-sm text-gray-500">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'No batches found matching your search criteria'
                      : 'No batches created yet. Create a new batch to get started.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowDeleteModal(null)}></div>
          <div className="relative bg-white rounded-lg max-w-md w-full mx-auto shadow-xl overflow-hidden">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Batch</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this batch? This action cannot be undone and all associated data will be permanently removed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={() => handleDeleteBatch(showDeleteModal)}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(null)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extend Modal */}
      {showExtendModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowExtendModal(null)}></div>
          <div className="relative bg-white rounded-lg max-w-md w-full mx-auto shadow-xl overflow-hidden">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Extend Batch Validity</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-4">
                      Please select a new end date for this batch.
                    </p>
                    <div>
                      <label htmlFor="newEndDate" className="block text-sm font-medium text-gray-700">
                        New End Date
                      </label>
                      <input
                        type="date"
                        id="newEndDate"
                        value={newEndDate}
                        onChange={(e) => setNewEndDate(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={() => handleExtendValidity(showExtendModal)}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                disabled={!newEndDate}
              >
                Extend
              </button>
              <button
                type="button"
                onClick={() => setShowExtendModal(null)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchManagement;