import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Filter, ChevronDown, FileText, Video, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

interface Subject {
  subjectId: string;
  subjectName: string;
  topics: Array<{
    topicResponseDTO: {
      id: string;
      name: string;
      resourceResponseDTO: {
        exerciseUrl: string;
        solutionUrl: string;
        video: string;
        classPPTUrl: string;
        article: string;
      };
    };
    selectedDate: string;
    selected: boolean;
  }>;
}

const ResourcesTable: React.FC<{ resources: any[] }> = ({ resources }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exercise</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solution</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class PPT</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {resources.map((topic, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">{topic.topicResponseDTO.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {topic.topicResponseDTO.resourceResponseDTO?.exerciseUrl ? (
                  <button onClick={() => window.open(topic.topicResponseDTO.resourceResponseDTO.exerciseUrl, '_blank')} className="text-orange-500 hover:text-orange-700">
                    <FileText className="h-5 w-5 inline" />
                  </button>
                ) : <span className="text-gray-400">-</span>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {topic.topicResponseDTO.resourceResponseDTO?.solutionUrl ? (
                  <button onClick={() => window.open(topic.topicResponseDTO.resourceResponseDTO.solutionUrl, '_blank')} className="text-green-600 hover:text-green-800">
                    <FileText className="h-5 w-5 inline" />
                  </button>
                ) : <span className="text-gray-400">-</span>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {topic.topicResponseDTO.resourceResponseDTO?.video ? (
                  <a href={topic.topicResponseDTO.resourceResponseDTO.video} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    <Video className="h-5 w-5 inline" />
                  </a>
                ) : <span className="text-gray-400">-</span>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {topic.topicResponseDTO.resourceResponseDTO?.article ? (
                  <a href={topic.topicResponseDTO.resourceResponseDTO.article} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                    <ExternalLink className="h-5 w-5 inline" />
                  </a>
                ) : <span className="text-gray-400">-</span>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {topic.topicResponseDTO.resourceResponseDTO?.classPPTUrl ? (
                  <button onClick={() => window.open(topic.topicResponseDTO.resourceResponseDTO.classPPTUrl, '_blank')} className="text-purple-600 hover:text-purple-800">
                    <FileText className="h-5 w-5 inline" />
                  </button>
                ) : <span className="text-gray-400">-</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        // Get student profile to get batchId
        const profileResponse = await axios.get(
          `https://lmsbackend-3l0h.onrender.com/api/student/${user.id}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );

        const batchId = profileResponse.data.batchId;

        // Fetch curriculum using batchId
        const curriculumResponse = await axios.get(
          `https://lmsbackend-3l0h.onrender.com/api/batches/${batchId}/curriculum`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );

        console.log('Curriculum:', curriculumResponse.data);
        setSubjects(curriculumResponse.data);

      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubjectClick = (subject: Subject) => {
    // Store the subject data in localStorage for the resource page to use
    localStorage.setItem('selectedSubject', JSON.stringify(subject));
    // Navigate to the subject resources page
    window.location.href = `/student/subject/${subject.subjectId}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          {/* Branch Filter - removed as per simplification */}
          
          {/* Difficulty Filter - removed as per simplification */}
        </div>
      </div>

      {/* Welcome banner */}
      <div className="bg-purple-50 border border-purple-100 rounded-lg p-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h2 className="text-xl font-semibold text-purple-900">
              Welcome back, {user?.name || 'Student'}!
            </h2>
            <p className="mt-1 text-purple-700">
              You're enrolled in batch <span className="font-semibold">{user?.batchId || 'BATCH2023'}</span> at {user?.college || 'Example University'}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link 
              to="/student/profile" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <div
            key={subject.subjectId}
            onClick={() => handleSubjectClick(subject)}
            className="cursor-pointer block bg-white rounded-lg border border-gray-200 shadow-sm hover:-translate-y-1 hover:shadow-md"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">{subject.subjectName}</h3>
              <div className="mt-4 flex items-center text-sm">
                <BookOpen className="h-4 w-4 mr-1.5 text-gray-500" />
                <span>{subject.topics.length} Topics</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {subjects.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No subjects found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No subjects are currently available.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;