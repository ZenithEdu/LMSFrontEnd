import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen, ChevronDown, ChevronRight, FileText, Video, ExternalLink, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Subject {
  id: string;
  name: string;
  description: string;
  topics: Topic[];
  isEnabled: boolean;
}

interface Topic {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  subtopics: Subtopic[];
  isEnabled: boolean;
}

interface Subtopic {
  id: string;
  name: string;
  description: string;
  resources: Resource[];
}

interface Resource {
  id: string;
  type: 'pdf' | 'video' | 'link';
  title: string;
  url: string;
}

interface ResourceTableItem {
  id: string;
  subtopicId: string;
  status: boolean;
  articleTitle: string;
  articleLink: string;
  videoTitle: string;
  videoLink: string;
  exerciseTitle: string;
  exerciseLink: string;
  solutionTitle: string;
  solutionLink: string;
  practiceTitle: string;
  practiceLink: string;
  difficulty: string;
  solutionPdfFile?: string;
  exercisePdfFile?: string;
  classPptFile?: string;
  classPptTitle?: string;
}

const ResourcesTable: React.FC<{ 
  resources: ResourceTableItem[];
  subtopicId: string;
}> = ({ resources, subtopicId }) => {
  const subtopicResources = resources.filter(resource => resource.subtopicId === subtopicId);

  return (
    <div className="overflow-x-auto">
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
          {subtopicResources.map((resource, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">{resource.articleTitle || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {resource.classPptFile ? (
                  <button onClick={() => window.open(resource.classPptFile, '_blank')} className="text-purple-600 hover:text-purple-800">
                    <FileText className="h-5 w-5 inline" />
                  </button>
                ) : <span className="text-gray-400">-</span>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {resource.exercisePdfFile ? (
                  <button onClick={() => window.open(resource.exercisePdfFile, '_blank')} className="text-orange-500 hover:text-orange-700">
                    <FileText className="h-5 w-5 inline" />
                  </button>
                ) : <span className="text-gray-400">-</span>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {resource.solutionPdfFile ? (
                  <button onClick={() => window.open(resource.solutionPdfFile, '_blank')} className="text-green-600 hover:text-green-800">
                    <FileText className="h-5 w-5 inline" />
                  </button>
                ) : <span className="text-gray-400">-</span>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {resource.videoLink ? (
                  <a href={resource.videoLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    <Video className="h-5 w-5 inline" />
                  </a>
                ) : <span className="text-gray-400">-</span>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {resource.articleLink ? (
                  <a 
                    href={resource.articleLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-indigo-600 hover:text-indigo-800"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(resource.articleLink, '_blank');
                    }}
                  >
                    <ExternalLink className="h-5 w-5 inline" />
                  </a>
                ) : <span className="text-gray-400">-</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SubjectManagement: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
  const [expandedSubtopics, setExpandedSubtopics] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [resourceTableData, setResourceTableData] = useState<ResourceTableItem[]>([]);

  useEffect(() => {
    const fetchSubjectsAndTopics = async () => {
      try {
        const token = localStorage.getItem('token');
        const currentBatch = JSON.parse(localStorage.getItem('currentBatch') || '{}');
        const batchSubjects = currentBatch.subjects || [];
        
        const allResources: ResourceTableItem[] = [];
        const fetchedSubjects: Subject[] = [];

        for (const batchSubject of batchSubjects) {
          const subjectId = batchSubject.subjectId;
          const selectedTopics = batchSubject.selectedTopics || [];

          // Get subject details
          const subjectResponse = await axios.get(
            `https://lmsbackend-3l0h.onrender.com/api/content/subject/${subjectId}`,
            {
              headers: { 'Authorization': `Bearer ${token}` }
            }
          );

          // Get topics for this subject
          const topicsResponse = await axios.get(
            `https://lmsbackend-3l0h.onrender.com/api/content/subject/${subjectId}/topic`,
            {
              headers: { 'Authorization': `Bearer ${token}` }
            }
          );

          // All topics should start as disabled
          const resources = topicsResponse.data.map((topic: any) => ({
            ...topic,
            status: false, // Initialize all topics as disabled
          }));

          // Add subject details
          fetchedSubjects.push({
            id: subjectId,
            name: subjectResponse.data.name || 'Subject',
            description: subjectResponse.data.description || '',
            topics: topicsResponse.data || [],
            isEnabled: true
          });

          // Map topics to resources with saved enabled state
          if (topicsResponse.data) {
            const resources = topicsResponse.data.map((topic: any) => ({
              id: topic.id,
              subtopicId: subjectId,
              status: selectedTopics.some((st: any) => st.topicId === topic.id),
              articleTitle: topic.name || 'Untitled',
              articleLink: topic.resourceResponseDTO?.test || '',  // Changed from article to test
              videoLink: topic.resourceResponseDTO?.video || '',
              exerciseTitle: 'Exercise',
              exerciseLink: topic.resourceResponseDTO?.exerciseUrl || '',
              solutionTitle: 'Solution',
              solutionLink: topic.resourceResponseDTO?.solutionUrl || '',
              exercisePdfFile: topic.resourceResponseDTO?.exerciseUrl || '',
              solutionPdfFile: topic.resourceResponseDTO?.solutionUrl || '',
              classPptFile: topic.resourceResponseDTO?.classPPTUrl || '',
              classPptTitle: 'Class PPT',
              videoTitle: '',
              practiceTitle: '',
              practiceLink: '',
              difficulty: topic.difficulty || 'beginner'
            }));
            allResources.push(...resources);
          }
        }

        setSubjects(fetchedSubjects);
        setResourceTableData(allResources);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchSubjectsAndTopics();
  }, [batchId]);

  // Toggle topic expansion
  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  // Toggle subtopic expansion
  const toggleSubtopic = (subtopicId: string) => {
    setExpandedSubtopics(prev =>
      prev.includes(subtopicId)
        ? prev.filter(id => id !== subtopicId)
        : [...prev, subtopicId]
    );
  };

  // Toggle subject enablement
  const toggleSubject = (subjectId: string) => {
    setSubjects(prev =>
      prev.map(subject =>
        subject.id === subjectId
          ? { ...subject, isEnabled: !subject.isEnabled }
          : subject
      )
    );
  };

  // Toggle topic enablement
  const toggleTopicEnabled = (subjectId: string, topicId: string) => {
    setSubjects(prev =>
      prev.map(subject =>
        subject.id === subjectId
          ? {
              ...subject,
              topics: subject.topics.map(topic =>
                topic.id === topicId
                  ? { ...topic, isEnabled: !topic.isEnabled }
                  : topic
              )
            }
          : subject
      )
    );
  };

  const handleToggleTopic = async (topicId: string, isEnabled: boolean) => {
    try {
      // Get current batch data from localStorage
      const currentBatch = JSON.parse(localStorage.getItem('currentBatch') || '{}');
      const token = localStorage.getItem('token');
      const resource = resourceTableData.find(r => r.id === topicId);
      
      if (!resource) return;

      // Find the subject in the batch data
      const subject = currentBatch.subjects?.find(
        (s: any) => s.subjectId === resource.subtopicId
      );

      // Check if topic is already selected in the subject's selectedTopics array
      const isAlreadySelected = subject?.selectedTopics?.some(
        (t: any) => t.topicId === topicId
      );

      // If topic is already selected, use that state instead of the new state
      const finalEnabledState = isAlreadySelected || isEnabled;

      // Update the resource table data
      setResourceTableData(prev => 
        prev.map(resource => 
          resource.id === topicId 
            ? { ...resource, status: finalEnabledState }
            : resource
        )
      );

      const payload = {
        topicUpdates: [{
          topicId: topicId,
          selected: finalEnabledState
        }]
      };

      // Make API call
      await axios.patch(
        `https://lmsbackend-3l0h.onrender.com/api/batches/${currentBatch.id}/subjects/${resource.subtopicId}/selections`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update localStorage with new state
      const enabledTopics = resourceTableData
        .filter(r => r.status || (r.id === topicId && finalEnabledState))
        .map(r => r.id);
      localStorage.setItem(`enabledTopics_${currentBatch.id}`, JSON.stringify(enabledTopics));

      toast.success('Topic updated successfully');
    } catch (error) {
      console.error('Error toggling topic:', error);
      toast.error('Failed to update topic status');
    }
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      const currentBatch = JSON.parse(localStorage.getItem('currentBatch') || '{}');
      
      const topicsBySubject = resourceTableData.reduce((acc: { [key: string]: any[] }, resource) => {
        if (!acc[resource.subtopicId]) {
          acc[resource.subtopicId] = [];
        }
        acc[resource.subtopicId].push({
          topicId: resource.id,
          isEnabled: resource.status
        });
        return acc;
      }, {});

      console.log('Bulk Update Payloads:', Object.entries(topicsBySubject).map(([subjectId, topics]) => ({
        url: `https://lmsbackend-3l0h.onrender.com/api/batches/${currentBatch.id}/subjects/${subjectId}/selections`,
        payload: { topicUpdates: topics }
      })));

      const updatePromises = Object.entries(topicsBySubject).map(([subjectId, topics]) =>
        axios.patch(
          `https://lmsbackend-3l0h.onrender.com/api/batches/${currentBatch.id}/subjects/${subjectId}/selections`,
          { topicUpdates: topics },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )
      );

      await Promise.all(updatePromises);

      // Update localStorage
      const enabledTopics = resourceTableData
        .filter(r => r.status)
        .map(r => r.id);
      localStorage.setItem(`enabledTopics_${currentBatch.id}`, JSON.stringify(enabledTopics));

      toast.success('All topics updated successfully');
    } catch (error) {
      console.error('Error saving topic selections:', error);
      toast.error('Failed to save topic selections');
    }
  };

  const handleSaveSubject = async (subjectId: string) => {
    try {
      const token = localStorage.getItem('token');
      const currentBatch = JSON.parse(localStorage.getItem('currentBatch') || '{}');
      
      const topicsForSubject = resourceTableData
        .filter(r => r.subtopicId === subjectId)
        .map(resource => ({
          topicId: resource.id,
          selected: resource.status  // Changed from isEnabled to selected
        }));

      const payload = {
        topicUpdates: topicsForSubject
      };

      console.log('Subject Update Payload:', {
        url: `https://lmsbackend-3l0h.onrender.com/api/batches/${currentBatch.id}/subjects/${subjectId}/selections`,
        payload
      });

      await axios.patch(
        `https://lmsbackend-3l0h.onrender.com/api/batches/${currentBatch.id}/subjects/${subjectId}/selections`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update localStorage
      const enabledTopics = resourceTableData
        .filter(r => r.status)
        .map(r => r.id);
      localStorage.setItem(`enabledTopics_${currentBatch.id}`, JSON.stringify(enabledTopics));

      toast.success(`${subjects.find(s => s.id === subjectId)?.name} updated successfully`);
    } catch (error) {
      console.error('Error saving subject:', error);
      toast.error('Failed to save subject');
    }
  };

  // Get difficulty badge style
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get resource icon
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'link':
        return <ExternalLink className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 relative pb-16">
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
        </div>
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Subject Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage subjects and topics for batch {batchId}
            </p>
          </div>

          <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
            {subjects.map(subject => (
              <div key={subject.id} className="p-6">
                {/* Subject header with Save button */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <span className="text-xl font-semibold text-gray-900">
                        {subject.name}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSubject(subject.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Save Changes
                  </button>
                </div>

                {/* Resources Table */}
                <div className="mt-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class PPT</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exercise</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solution</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Video</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enable</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {resourceTableData
                          .filter(r => r.subtopicId === subject.id)
                          .map((resource, index) => (
                            <tr key={index}>
                              
                              <td className="px-6 py-4 whitespace-nowrap">{resource.articleTitle || '-'}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {resource.classPptFile ? (
                                  <button onClick={() => window.open(resource.classPptFile, '_blank')} className="text-purple-600 hover:text-purple-800">
                                    <FileText className="h-5 w-5 inline" />
                                  </button>
                                ) : <span className="text-gray-400">-</span>}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {resource.exercisePdfFile ? (
                                  <button onClick={() => window.open(resource.exercisePdfFile, '_blank')} className="text-orange-500 hover:text-orange-700">
                                    <FileText className="h-5 w-5 inline" />
                                  </button>
                                ) : <span className="text-gray-400">-</span>}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {resource.solutionPdfFile ? (
                                  <button onClick={() => window.open(resource.solutionPdfFile, '_blank')} className="text-green-600 hover:text-green-800">
                                    <FileText className="h-5 w-5 inline" />
                                  </button>
                                ) : <span className="text-gray-400">-</span>}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {resource.videoLink ? (
                                  <a href={resource.videoLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                    <Video className="h-5 w-5 inline" />
                                  </a>
                                ) : <span className="text-gray-400">-</span>}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {resource.articleLink ? (
                                  <a 
                                    href={resource.articleLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-indigo-600 hover:text-indigo-800"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      window.open(resource.articleLink, '_blank');
                                    }}
                                  >
                                    <ExternalLink className="h-5 w-5 inline" />
                                  </a>
                                ) : <span className="text-gray-400">-</span>}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <label className="inline-flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={resource.status}
                                    onChange={(e) => handleToggleTopic(resource.id, e.target.checked)}
                                    className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">Enable</span>
                                </label>
                              </td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>


        </>
      )}
    </div>
  );
};

export default SubjectManagement;