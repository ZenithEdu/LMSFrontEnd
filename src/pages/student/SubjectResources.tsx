import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, Video, ExternalLink } from 'lucide-react';

const SubjectResources: React.FC = () => {
  const navigate = useNavigate();
  const subject = JSON.parse(localStorage.getItem('selectedSubject') || '{}');

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">{subject.subjectName}</h1>
          <p className="mt-1 text-sm text-gray-500">{subject.topics.length} Topics</p>
        </div>

        <div className="p-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class PPT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exercise</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solution</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Video</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subject.topics?.map((topic: any, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{topic.topicResponseDTO.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {topic.topicResponseDTO.resourceResponseDTO?.classPPTUrl ? (
                      <button onClick={() => window.open(topic.topicResponseDTO.resourceResponseDTO.classPPTUrl, '_blank')} className="text-purple-600 hover:text-purple-800">
                        <FileText className="h-5 w-5 inline" />
                      </button>
                    ) : <span className="text-gray-400">-</span>}
                  </td>
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
                    {topic.topicResponseDTO.resourceResponseDTO?.test ? (
                      <a href={topic.topicResponseDTO.resourceResponseDTO.test} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                        <ExternalLink className="h-5 w-5 inline" />
                      </a>
                    ) : <span className="text-gray-400">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubjectResources;
