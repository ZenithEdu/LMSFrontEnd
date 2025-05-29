import React from 'react';
import { BarChart3, Users, BookOpen, TrendingUp } from 'lucide-react';

interface BatchProgress {
  batchId: string;
  college: string;
  subjects: SubjectProgress[];
  totalStudents: number;
  averageProgress: number;
}

interface SubjectProgress {
  id: string;
  name: string;
  topicsCompleted: number;
  totalTopics: number;
  studentProgress: {
    completed: number;
    inProgress: number;
    notStarted: number;
  };
}

const ProgressTracking: React.FC = () => {
  // Mock data
  const batchProgress: BatchProgress[] = [
    {
      batchId: 'BATCH2023',
      college: 'Example University',
      totalStudents: 120,
      averageProgress: 65,
      subjects: [
        {
          id: '1',
          name: 'Data Structures & Algorithms',
          topicsCompleted: 8,
          totalTopics: 12,
          studentProgress: {
            completed: 45,
            inProgress: 60,
            notStarted: 15
          }
        },
        {
          id: '2',
          name: 'Database Management Systems',
          topicsCompleted: 6,
          totalTopics: 10,
          studentProgress: {
            completed: 55,
            inProgress: 40,
            notStarted: 25
          }
        }
      ]
    },
    {
      batchId: 'BATCH2024',
      college: 'Tech Institute',
      totalStudents: 85,
      averageProgress: 45,
      subjects: [
        {
          id: '1',
          name: 'Data Structures & Algorithms',
          topicsCompleted: 5,
          totalTopics: 12,
          studentProgress: {
            completed: 30,
            inProgress: 40,
            notStarted: 15
          }
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Progress Tracking</h1>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {batchProgress.reduce((sum, batch) => sum + batch.totalStudents, 0)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Batches</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {batchProgress.length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Average Progress</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {Math.round(
                        batchProgress.reduce((sum, batch) => sum + batch.averageProgress, 0) /
                        batchProgress.length
                      )}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Batch Progress */}
      {batchProgress.map((batch) => (
        <div key={batch.batchId} className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{batch.batchId}</h2>
                <p className="mt-1 text-sm text-gray-500">{batch.college}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500">Students</p>
                  <p className="text-lg font-semibold text-gray-900">{batch.totalStudents}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500">Average Progress</p>
                  <p className="text-lg font-semibold text-gray-900">{batch.averageProgress}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 divide-y divide-gray-200">
            {batch.subjects.map((subject) => (
              <div key={subject.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{subject.name}</h3>
                  <div className="text-sm text-gray-500">
                    {subject.topicsCompleted} of {subject.totalTopics} topics completed
                  </div>
                </div>

                {/* Topic Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: `${(subject.topicsCompleted / subject.totalTopics) * 100}%` }}
                  ></div>
                </div>

                {/* Student Progress Distribution */}
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-green-500"
                        style={{ width: `${(subject.studentProgress.completed / batch.totalStudents) * 100}%` }}
                      ></div>
                      <div
                        className="bg-yellow-500"
                        style={{ width: `${(subject.studentProgress.inProgress / batch.totalStudents) * 100}%` }}
                      ></div>
                      <div
                        className="bg-gray-300"
                        style={{ width: `${(subject.studentProgress.notStarted / batch.totalStudents) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                      <span>{subject.studentProgress.completed} Completed</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                      <span>{subject.studentProgress.inProgress} In Progress</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-300 rounded-full mr-1"></div>
                      <span>{subject.studentProgress.notStarted} Not Started</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressTracking;