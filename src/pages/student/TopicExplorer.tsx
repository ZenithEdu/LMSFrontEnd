import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Video, Link as LinkIcon, Calendar, Download, Play, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';

interface Resource {
  exercise?: string;
  solution?: string;
  classVideo?: string;
  additionalPractice?: string;
}

interface Subtopic {
  id: string;
  name: string;
  classDate: string;
  resources: Resource;
}

interface Topic {
  id: string;
  name: string;
  classDate: string;
  resources: Resource;
  subtopics: Subtopic[];
}

const TopicExplorer: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  // Mock data
  const topics: Topic[] = [
    {
      id: '1',
      name: 'Number System 1',
      classDate: '29-May-24',
      resources: {
        exercise: 'https://example.com/exercise1.pdf',
        solution: 'https://example.com/solution1.pdf',
        classVideo: 'https://example.com/video1',
        additionalPractice: 'https://example.com/practice1'
      },
      subtopics: [
        {
          id: '1-1',
          name: 'Natural Numbers',
          classDate: '29-May-24',
          resources: {
            exercise: 'https://example.com/natural-exercise.pdf',
            solution: 'https://example.com/natural-solution.pdf',
            classVideo: 'https://example.com/natural-video',
            additionalPractice: 'https://example.com/natural-practice'
          }
        },
        {
          id: '1-2',
          name: 'Whole Numbers',
          classDate: '29-May-24',
          resources: {
            exercise: 'https://example.com/whole-exercise.pdf',
            solution: 'https://example.com/whole-solution.pdf',
            classVideo: 'https://example.com/whole-video',
            additionalPractice: 'https://example.com/whole-practice'
          }
        }
      ]
    },
    {
      id: '2',
      name: 'Number System 2',
      classDate: '30-May-24',
      resources: {
        exercise: 'https://example.com/exercise2.pdf',
        solution: 'https://example.com/solution2.pdf',
        classVideo: 'https://example.com/video2',
        additionalPractice: 'https://example.com/practice2'
      },
      subtopics: [
        {
          id: '2-1',
          name: 'Integers',
          classDate: '30-May-24',
          resources: {
            exercise: 'https://example.com/integers-exercise.pdf',
            solution: 'https://example.com/integers-solution.pdf',
            classVideo: 'https://example.com/integers-video',
            additionalPractice: 'https://example.com/integers-practice'
          }
        }
      ]
    }
  ];

  const ResourceLink = ({ type, url, label, icon: Icon }: { type: string; url: string; label: string; icon: React.ElementType }) => (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
        type === 'link' ? 'text-blue-700 bg-blue-50 hover:bg-blue-100' : 'text-red-700 bg-red-50 hover:bg-red-100'
      }`}
    >
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </a>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Mathematics</h1>
          <p className="mt-2 text-gray-600">Access your course materials and resources</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Topic
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exercise
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Solution
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class Video
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Additional Practice
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topics.map((topic) => (
                <React.Fragment key={topic.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleTopic(topic.id)}
                        className="flex items-center text-sm font-medium text-gray-900"
                      >
                        {expandedTopics.includes(topic.id) ? (
                          <ChevronDown className="h-4 w-4 mr-2" />
                        ) : (
                          <ChevronRight className="h-4 w-4 mr-2" />
                        )}
                        {topic.name}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {topic.classDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {topic.resources.exercise && (
                        <ResourceLink type="pdf" url={topic.resources.exercise} label="PDF" icon={FileText} />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {topic.resources.solution && (
                        <ResourceLink type="pdf" url={topic.resources.solution} label="PDF" icon={FileText} />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {topic.resources.classVideo && (
                        <ResourceLink type="video" url={topic.resources.classVideo} label="Watch" icon={Play} />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {topic.resources.additionalPractice && (
                        <ResourceLink type="link" url={topic.resources.additionalPractice} label="Link" icon={LinkIcon} />
                      )}
                    </td>
                  </tr>
                  {expandedTopics.includes(topic.id) && topic.subtopics.map(subtopic => (
                    <tr key={subtopic.id} className="bg-gray-50 hover:bg-gray-100">
                      <td className="px-6 py-4 whitespace-nowrap pl-12">
                        <div className="text-sm font-medium text-gray-900">{subtopic.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          {subtopic.classDate}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {subtopic.resources.exercise && (
                          <ResourceLink type="pdf" url={subtopic.resources.exercise} label="PDF" icon={FileText} />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {subtopic.resources.solution && (
                          <ResourceLink type="pdf" url={subtopic.resources.solution} label="PDF" icon={FileText} />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {subtopic.resources.classVideo && (
                          <ResourceLink type="video" url={subtopic.resources.classVideo} label="Watch" icon={Play} />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {subtopic.resources.additionalPractice && (
                          <ResourceLink type="link" url={subtopic.resources.additionalPractice} label="Link" icon={LinkIcon} />
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {topics.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No topics available</h3>
            <p className="mt-1 text-sm text-gray-500">
              Topics will be added as they become available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicExplorer;