import React, { useState, useEffect } from 'react';
import { Upload, AlertCircle, Check, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import axios from 'axios';
import config from '../../config';

interface Manager {
  id: string;
  name: string;
  email: string;
}

interface Subject {
  id: string;
  name: string;
}

interface BatchData {
  id: string;
  name: string;
  college: string;
  startDate: string;
  endDate: string;
  status: string;
  managers: string[];
  studentCount: number;
  subjects: string[];
}

const readExcelFile = async (file: File | null): Promise<any[]> => {
  if (!file) return [];
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

const BatchCreation: React.FC = () => {
  const navigate = useNavigate();

  // State for form fields
  const [batchName, setBatchName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedManagers, setSelectedManagers] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createdBatchId, setCreatedBatchId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [isSubjectsOpen, setIsSubjectsOpen] = useState(false);
  const [isManagersOpen, setIsManagersOpen] = useState(false);
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/admin/allEmployee`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`
          }
        });
        
        // Filter managers from all employees
        const managersData = response.data
          .filter((employee: any) => employee.role === 'MANAGER')
          .map((manager: any) => ({
            id: manager.id,
            name: manager.name,
            email: manager.email
          }));
        
        setManagers(managersData);
      } catch (error) {
        console.error('Error fetching managers:', error);
        toast.error('Failed to fetch managers list');
      }
    };

    fetchManagers();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/content/subject`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`
          }
        });
        setAvailableSubjects(response.data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        toast.error('Failed to fetch subjects. Please try again.');
      }
    };

    fetchSubjects();
  }, []);

  // Handle file input change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCsvFile(file);
      const data = await readExcelFile(file);
      setExcelData(data);
    }
  };

  // Handle drag and drop events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.csv')) {
        setCsvFile(file);
      } else {
        toast.error('Please upload a CSV file');
      }
    }
  };

  // Handle manager selection
  const toggleManager = (managerId: string) => {
    setSelectedManagers(prevSelected => 
      prevSelected.includes(managerId)
        ? prevSelected.filter(id => id !== managerId)
        : [...prevSelected, managerId]
    );
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!batchName.trim()) newErrors.batchName = 'Batch name is required';
    if (!collegeName.trim()) newErrors.collegeName = 'College name is required';
    if (!startDate) newErrors.startDate = 'Start date is required';
    if (!endDate) newErrors.endDate = 'End date is required';
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (!csvFile) newErrors.csvFile = 'Student data Excel is required';
    if (selectedManagers.length === 0) newErrors.managers = 'At least one manager must be selected';
    if (subjects.length === 0) newErrors.subjects = 'At least one subject must be selected';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();

      // Create the batchCreationRequestDTO
      const batchDTO = {
        name: batchName,
        startDate: startDate,
        endDate: endDate,
        managerId: selectedManagers[0],
        subjectIds: subjects.map(subjectName => 
          availableSubjects.find(s => s.name === subjectName)?.id
        ).filter(id => id)
      };

      // Add the DTO as a JSON string
      formData.append('batchCreationRequestDTO', 
        new Blob([JSON.stringify(batchDTO)], { type: 'application/json' })
      );

      // Add student file separately
      if (csvFile) {
        formData.append('studentFile', csvFile);
      }

      const response = await axios.post(
        `${config.API_BASE_URL}/batches`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      toast.success('Batch created successfully!');
      setCreatedBatchId(response.data.id);
      
      navigate('/admin/batch/manage', {
        state: { newBatch: response.data },
        replace: true
      });
    } catch (error: any) {
      console.error('Error creating batch:', error);
      toast.error(error.response?.data?.message || 'Failed to create batch. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Batch</h1>
      </div>

      {createdBatchId && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Batch created successfully!</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Batch ID: <span className="font-mono font-bold">{createdBatchId}</span></p>
                <p className="mt-1">Students have been enrolled and notifications have been sent.</p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-md text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={() => {
                      setBatchName('');
                      setCollegeName('');
                      setStartDate('');
                      setEndDate('');
                      setCsvFile(null);
                      setSelectedManagers([]);
                      setSubjects([]);
                      setCreatedBatchId(null);
                    }}
                  >
                    Create Another Batch
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!createdBatchId && (
        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Batch Information</h2>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="batchName" className="block text-sm font-medium text-gray-700">
                    Batch Name*
                  </label>
                  <input
                    type="text"
                    id="batchName"
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                    className={`mt-1 block w-full border ${
                      errors.batchName ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="e.g., CSE 2023-24"
                  />
                  {errors.batchName && (
                    <p className="mt-1 text-sm text-red-600">{errors.batchName}</p>
                  )}
                </div>
                

                <div>
                  <label htmlFor="collegeName" className="block text-sm font-medium text-gray-700">
                    College Name*
                  </label>
                  <input
                    type="text"
                    id="collegeName"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className={`mt-1 block w-full border ${
                      errors.collegeName ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="e.g., Example University"
                  />
                  {errors.collegeName && (
                    <p className="mt-1 text-sm text-red-600">{errors.collegeName}</p>
                  )}
                </div>
                

                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date*
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`mt-1 block w-full border ${
                      errors.startDate ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date*
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`mt-1 block w-full border ${
                      errors.endDate ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Subject and Manager Selection</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subjects*
                  </label>
                  <div className="relative">
                    <div
                      className={`cursor-pointer mt-1 block w-full border ${
                        errors.subjects ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      onClick={() => setIsSubjectsOpen(!isSubjectsOpen)}
                    >
                      <div className="flex flex-wrap gap-1">
                        {subjects.length > 0 ? (
                          subjects.map((subject) => (
                            <span
                              key={subject}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {subject}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400">Select subjects...</span>
                        )}
                      </div>
                    </div>
                    {isSubjectsOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        {availableSubjects.length > 0 ? (
                          availableSubjects.map((subjectOption) => (
                            <div
                              key={subjectOption.id}
                              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 ${
                                subjects.includes(subjectOption.name) ? 'bg-blue-50' : ''
                              }`}
                              onClick={() => {
                                setSubjects(prev =>
                                  prev.includes(subjectOption.name)
                                    ? prev.filter(s => s !== subjectOption.name)
                                    : [...prev, subjectOption.name]
                                );
                              }}
                            >
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={subjects.includes(subjectOption.name)}
                                  onChange={() => {}}
                                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                                <span className="ml-3 block font-normal truncate">
                                  {subjectOption.name}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-2 px-3 text-sm text-gray-500">
                            No subjects available. Please add subjects in Subject Editor first.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {errors.subjects && (
                    <p className="mt-1 text-sm text-red-600">{errors.subjects}</p>
                  )}
                  {availableSubjects.length === 0 && (
                    <p className="mt-2 text-sm text-gray-500">
                      No subjects available. Please add subjects in the Subject Editor first.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Managers*
                  </label>
                  <div className="relative">
                    <div
                      className={`cursor-pointer mt-1 block w-full border ${
                        errors.managers ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      onClick={() => setIsManagersOpen(!isManagersOpen)}
                    >
                      <div className="flex flex-wrap gap-1">
                        {selectedManagers.length > 0 ? (
                          selectedManagers.map((managerId) => {
                            const manager = managers.find(m => m.id === managerId);
                            return manager ? (
                              <span
                                key={managerId}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {manager.name}
                              </span>
                            ) : null;
                          })
                        ) : (
                          <span className="text-gray-400">Select managers...</span>
                        )}
                      </div>
                    </div>
                    {isManagersOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        {managers.map((manager) => (
                          <div
                            key={manager.id}
                            className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 ${
                              selectedManagers.includes(manager.id) ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => toggleManager(manager.id)}
                          >
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedManagers.includes(manager.id)}
                                onChange={() => {}}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                              />
                              <span className="ml-3 block font-normal truncate">
                                {manager.name} ({manager.email})
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.managers && (
                    <p className="mt-1 text-sm text-red-600">{errors.managers}</p>
                  )}
                  {managers.length === 0 && (
                    <div className="mt-2 text-sm text-gray-500">
                      No managers available. Please add managers in Employee Management.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Student Data Upload</h2>
              <div
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                  isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                } ${errors.csvFile ? 'border-red-300' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>Upload a Excel file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept=".xlsx"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">Excel with student data (name, email, phone, branch)</p>
                  {csvFile && (
                    <div className="mt-2 flex items-center justify-center text-sm text-gray-700">
                      <Check className="h-4 w-4 text-green-500 mr-1" />
                      {csvFile.name}
                      <button
                        type="button"
                        className="ml-2 text-red-600 hover:text-red-800"
                        onClick={() => setCsvFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {errors.csvFile && (
                <p className="mt-1 text-sm text-red-600">{errors.csvFile}</p>
              )}
              
              {csvFile && excelData.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Preview Student Data</h3>
                  <div className="max-h-60 overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {Object.keys(excelData[0]).map((header) => (
                            <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {excelData.map((row, index) => (
                          <tr key={index}>
                            {Object.values(row).map((value: any, i) => (
                              <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Total Students: {excelData.length}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end space-x-3">
            <button
              type="button"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : 'Create Batch'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BatchCreation;