import React, { useState } from 'react';
import axios from 'axios';

interface StudentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  batches: Array<{ batchId: string; name: string }>;
}

const StudentRegistrationModal: React.FC<StudentRegistrationModalProps> = ({ isOpen, onClose, batches }) => {
  const [formData, setFormData] = useState({
    uniId: '',
    name: '',
    email: '',
    batchId: '',
    branch: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const requestBody = {
        type: "STUDENT",
        ...formData,
        role: 'ADMIN'
      };

      await axios.post(
        'https://lmsbackend-3l0h.onrender.com/api/auth/register/student',
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      onClose();
      alert('Student registered successfully!');
    } catch (error) {
      console.error('Error registering student:', error);
      alert('Failed to register student');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Register New Student</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">University ID</label>
            <input
              type="text"
              required
              className="w-full border rounded-md p-2"
              value={formData.uniId}
              onChange={(e) => setFormData({...formData, uniId: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              required
              className="w-full border rounded-md p-2"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full border rounded-md p-2"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Branch</label>
            <input
              type="text"
              required
              className="w-full border rounded-md p-2"
              value={formData.branch}
              onChange={(e) => setFormData({...formData, branch: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Batch</label>
            <select
              required
              className="w-full border rounded-md p-2"
              value={formData.batchId}
              onChange={(e) => setFormData({...formData, batchId: e.target.value})}
            >
              <option value="">Select Batch</option>
              {batches.map((batch) => (
                <option key={batch.batchId} value={batch.batchId}>
                  {batch.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentRegistrationModal;
