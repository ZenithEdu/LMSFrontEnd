import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import { Search, Filter, ChevronDown, UserPlus, Trash2, PenSquare } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  
  Employee,
  loadEmployeesFromStorage,
  saveEmployeesToStorage
} from '../../utils/storage';

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

const getAccessToken = () => {
  return localStorage.getItem('token') || '';
};

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'manager' as 'admin' | 'manager',
    gender: 'male' as 'male' | 'female' | 'other',
  });

  const [employees, setEmployees] = useState<Employee[]>(loadEmployeesFromStorage());
  const [errors, setErrors] = useState({
    email: '',
    phone: ''
  });

  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);

  // Add new fetch function
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/admin/allEmployee`, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to fetch employees');
    }
  };

  // Update useEffect to fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Update role filter handler
  const handleRoleFilter = (role: string) => {
    setRoleFilter(role);
  };

  // Filter employees based on search term and filters
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phone.includes(searchTerm);
    
    const matchesRole = 
      roleFilter === 'all' || 
      employee.role.toUpperCase() === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  // Handle employee deletion
  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      await axios.delete(`${config.API_BASE_URL}/admin/deleteEmployee/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });

      const updatedEmployees = employees.filter(employee => employee.id !== employeeId);
      setEmployees(updatedEmployees);
      saveEmployeesToStorage(updatedEmployees);
      toast.success('Employee deleted successfully');
    } catch (error) {
      toast.error('Error deleting employee. Please try again.');
    }

    setShowDeleteModal(null);
  };

  // Add before the return statement
  const handleEdit = (employee: Employee) => {
    setEditEmployee(employee);
    setNewEmployee({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      gender: employee.gender,
    });
    setShowAddModal(true);
  };

  // Replace the existing handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submission
    if (!isValidEmail(newEmployee.email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      return;
    }

    if (!isValidPhone(newEmployee.phone)) {
      setErrors(prev => ({ ...prev, phone: 'Please enter a 10-digit phone number' }));
      return;
    }

    if (editEmployee) {
      // Handle update
      const updatedEmployees = employees.map(emp =>
        emp.id === editEmployee.id
          ? {
              ...emp,
              name: newEmployee.name,
              email: newEmployee.email,
              phone: newEmployee.phone,
              role: newEmployee.role,
              gender: newEmployee.gender,
            }
          : emp
      );
      setEmployees(updatedEmployees);
      saveEmployeesToStorage(updatedEmployees);
      toast.success('Employee updated successfully');
    } else {
      // Handle new employee creation via API
      try {
        const payload = JSON.stringify({
          name: newEmployee.name,
          email: newEmployee.email,
          phone: newEmployee.phone,
          role: newEmployee.role.toUpperCase(), // Convert role to uppercase
          gender: newEmployee.gender.toUpperCase(), // Convert gender to uppercase
          type: 'EMPLOYEE', // Ensure the 'type' property is included
        });

        const response = await axios.post(
          `${config.API_BASE_URL}/auth/register/employee`,
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getAccessToken()}`,
            },
          }
        );

        const result = response.data;

        // Store the token for manager in local storage
        if (newEmployee.role.toUpperCase() === 'MANAGER') {
          localStorage.setItem('managerToken', 'f9f14151-7f91-4dcc-a2d0-aa1fad209127');
        }

        const newEmployeeData: Employee = {
          id: result.id, // Assuming the API returns the new employee's ID
          name: newEmployee.name,
          email: newEmployee.email,
          phone: newEmployee.phone,
          role: newEmployee.role,
          gender: newEmployee.gender,
          dateAdded: new Date().toISOString().split('T')[0],
        };

        const updatedEmployees = [...employees, newEmployeeData];
        setEmployees(updatedEmployees);
        saveEmployeesToStorage(updatedEmployees);
        toast.success(`${newEmployee.role === 'ADMIN' ? 'Admin' : 'Manager'} account created successfully`);
      } catch (error) {
        toast.error('Error adding employee. Please try again.');
      }
    }

    // Reset form and close modal
    setShowAddModal(false);
    setEditEmployee(null);
    setNewEmployee({
      name: '',
      email: '',
      phone: '',
      role: 'manager',
      gender: 'male',
    });
    setErrors({ email: '', phone: '' });
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="flex space-x-4">
        {/* Search Filter */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="focus:ring-blue-500 focus:border-blue-500 w-full pl-10 pr-3 py-2 text-base border-gray-300 rounded-md"
            placeholder="Search employees..."
          />
        </div>

        {/* Role Filter */}
        <div className="w-64 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => handleRoleFilter(e.target.value)}
            className="focus:ring-blue-500 focus:border-blue-500 w-full pl-10 pr-10 py-2 text-base border-gray-300 rounded-md appearance-none"
          >
            <option value="all">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Add Employee Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Add Employee
        </button>
      </div>

      {/* Employees Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          employee.role === 'manager' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        {/* <div className="text-sm text-gray-500">Added {formatDate(employee.dateAdded)}</div> */}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{employee.gender}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      employee.role === 'manager' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button 
                      onClick={() => handleEdit(employee)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <PenSquare className="h-5 w-5 inline" />
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(employee.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                    No employees found matching your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {editEmployee ? 'Edit Employee' : 'Add New Employee'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Fill in the details to create a new Employee account.
                    </p>
                  </div>

                  <div className="space-y-4">
                    

                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                        className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={newEmployee.email}
                        onChange={(e) => {
                          setNewEmployee({ ...newEmployee, email: e.target.value });
                          if (!isValidEmail(e.target.value)) {
                            setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
                          } else {
                            setErrors(prev => ({ ...prev, email: '' }));
                          }
                        }}
                        className={`mt-1 block w-full px-4 py-3 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                          errors.email ? 'border-red-500' : ''
                        }`}
                        required
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={newEmployee.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setNewEmployee({ ...newEmployee, phone: value });
                          if (!isValidPhone(value)) {
                            setErrors(prev => ({ ...prev, phone: 'Please enter a 10-digit phone number' }));
                          } else {
                            setErrors(prev => ({ ...prev, phone: '' }));
                          }
                        }}
                        className={`mt-1 block w-full px-4 py-3 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                          errors.phone ? 'border-red-500' : ''
                        }`}
                        required
                        maxLength={10}
                        pattern="\d{10}"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Role
                      </label>
                      <select
                        id="role"
                        value={newEmployee.role}
                        onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value as 'admin' | 'manager' })}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                        Gender
                      </label>
                      <select
                        id="gender"
                        value={newEmployee.gender}
                        onChange={(e) => setNewEmployee({ ...newEmployee, gender: e.target.value as 'male' | 'female' | 'other' })}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editEmployee ? 'Update Employee' : 'Add Employee'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditEmployee(null);
                      setNewEmployee({
                        name: '',
                        email: '',
                        phone: '',
                        role: 'manager',
                        gender: 'male',
                      });
                      setErrors({ email: '', phone: '' });
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Employee
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this employee? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => handleDeleteEmployee(showDeleteModal)}
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
        </div>
      )}
    </div>
  );
};

export default UserManagement;