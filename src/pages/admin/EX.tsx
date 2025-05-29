// import React, { useState, useEffect } from 'react';
// import { Plus, Trash2, Upload, ChevronDown, ChevronRight, ExternalLink, FileText, Video, Edit2 } from 'lucide-react';
// import { toast } from 'react-toastify';
// import { saveResourceTableToStorage, loadResourceTableFromStorage } from '../../utils/storage';
// import axios from 'axios';
// import config from '../../config';
// import api from '../../services/api';

// export interface Subject {
//   id: string;
//   name: string;
//   description: string;
//   topics: Topic[];
//   resources: Resource[];
// }

// export interface Resource {
//   id: string;
//   dateAdded: string;
//   articleLink?: string;
//   articleTitle?: string;
//   videoLink?: string;
//   videoTitle?: string;
//   pdfLink?: string;
//   pdfTitle?: string;
//   exerciseLink?: string;
//   exerciseTitle?: string;
//   solutionLink?: string;
//   solutionTitle?: string;
//   practiceLink?: string;
//   practiceTitle?: string;
//   solutionPdfFile?: string; // Base64 encoded PDF data
//   exercisePdfFile?: string; // Base64 encoded PDF data
//   classPptFile?: string;
//   classPptTitle?: string; // Added missing interface field
// }

// interface ResourceTableItem {
//   id: string;
//   subtopicId: string;
//   status: boolean;
//   articleTitle: string;
//   articleLink: string;
//   videoTitle: string;
//   videoLink: string;
//   exerciseTitle: string;
//   exerciseLink: string;
//   solutionTitle: string;
//   solutionLink: string;
//   practiceTitle: string;
//   practiceLink: string;
//   difficulty: string;
//   solutionPdfFile?: string;
//   exercisePdfFile?: string;
//   classPptFile?: string;
//   classPptTitle?: string; // Added missing interface field
// }

// interface Subtopic {
//   id: string;
//   name: string;
//   description: string;
//   resources: Resource[];
// }

// export interface Topic {
//   id: string;
//   name: string;
//   subtopics: Subtopic[];
//   resources: Resource[];
// }

// export const storePdf = async (file: File): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       const base64String = reader.result as string;
//       resolve(base64String);
//     };
//     reader.onerror = reject;
//     reader.readAsDataURL(file);
//   });
// };

// // Add this helper function to convert base64 to File object
// const base64ToFile = (base64String: string, filename: string): File => {
//   const arr = base64String.split(',');
//   const mime = arr[0].match(/:(.*?);/)?.[1];
//   const bstr = atob(arr[1]);
//   let n = bstr.length;
//   const u8arr = new Uint8Array(n);
//   while (n--) {
//     u8arr[n] = bstr.charCodeAt(n);
//   }
//   return new File([u8arr], filename, { type: mime });
// };

// const PdfViewer: React.FC<{ pdfData: string; title: string }> = ({ pdfData, title }) => {
//   return (
//     <div className="fixed inset-0 z-50 overflow-hidden bg-gray-800 bg-opacity-75">
//       <div className="flex items-center justify-center min-h-screen p-4">
//         <div className="bg-white w-full max-w-6xl rounded-lg shadow-xl">
//           <div className="flex justify-between items-center p-4 border-b">
//             <h3 className="text-lg font-medium">{title}</h3>
//             <button
//               onClick={() => window.close()}
//               className="text-gray-400 hover:text-gray-500"
//             >
//               <span className="sr-only">Close</span>
//               ×
//             </button>
//           </div>
//           <div className="h-[80vh]">
//             <embed
//               src={pdfData}
//               type="application/pdf"
//               width="100%"
//               height="100%"
//               className="border-none"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ResourcesTable: React.FC<{ 
//   resources: ResourceTableItem[];
//   subtopicId: string;
//   onEdit: (resource: ResourceTableItem) => void;
//   onDelete: (resource: ResourceTableItem) => void;
// }> = ({ resources, subtopicId, onEdit, onDelete }) => {
//   const subtopicResources = resources.filter(resource => resource.subtopicId === subtopicId);

//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Name 
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Exercise
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Solution
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Video
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Article
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Class PPT
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {subtopicResources.map((resource, index) => (
//             <tr key={index}>
//               <td className="px-6 py-4 whitespace-nowrap">{resource.articleTitle || '-'}</td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 {resource.exercisePdfFile ? (
//                   <button
//                     onClick={() => {
//                       const newWindow = window.open('', '_blank');
//                       if (newWindow) {
//                         newWindow.document.write(`
//                           <html>
//                             <head>
//                               <title>${resource.exerciseTitle || 'Exercise'}</title>
//                             </head>
//                             <body style="margin:0;padding:0;">
//                               <embed 
//                                 src="${resource.exercisePdfFile}" 
//                                 type="application/pdf" 
//                                 width="100%" 
//                                 height="100%"
//                                 style="position:absolute;top:0;left:0;right:0;bottom:0;"
//                               />
//                             </body>
//                           </html>
//                         `);
//                       }
//                     }}
//                     className="text-orange-500 hover:text-orange-700"
//                   >
//                     <FileText className="h-5 w-5 inline" />
//                   </button>
//                 ) : (
//                   <span className="text-gray-400">-</span>
//                 )}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 {resource.solutionPdfFile ? (
//                   <button
//                     onClick={() => {
//                       const newWindow = window.open('', '_blank');
//                       if (newWindow) {
//                         newWindow.document.write(`
//                           <html>
//                             <head>
//                               <title>${resource.solutionTitle || 'Solution'}</title>
//                             </head>
//                             <body style="margin:0;padding:0;">
//                               <embed 
//                                 src="${resource.solutionPdfFile}" 
//                                 type="application/pdf" 
//                                 width="100%" 
//                                 height="100%"
//                                 style="position:absolute;top:0;left:0;right:0;bottom:0;"
//                               />
//                             </body>
//                           </html>
//                         `);
//                       }
//                     }}
//                     className="text-green-600 hover:text-green-800"
//                   >
//                     <FileText className="h-5 w-5 inline" />
//                   </button>
//                 ) : (
//                   <span className="text-gray-400">-</span>
//                 )}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 {resource.videoLink ? (
//                   <a
//                     href={resource.videoLink}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:text-blue-800"
//                   >
//                     <Video className="h-5 w-5 inline" />
//                   </a>
//                 ) : (
//                   <span className="text-gray-400">-</span>
//                 )}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 {resource.articleLink ? (
//                   <a
//                     href={resource.articleLink}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-indigo-600 hover:text-indigo-800"
//                   >
//                     <ExternalLink className="h-5 w-5 inline" />
//                   </a>
//                 ) : (
//                   <span className="text-gray-400">-</span>
//                 )}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 {resource.classPptFile ? (
//                   <button
//                     onClick={() => {
//                       const newWindow = window.open('', '_blank');
//                       if (newWindow) {
//                         newWindow.document.write(`
//                           <html>
//                             <head>
//                               <title>${resource.classPptTitle || 'Class PPT'}</title>
//                             </head>
//                             <body style="margin:0;padding:0;">
//                               <embed 
//                                 src="${resource.classPptFile}" 
//                                 type="application/pdf" 
//                                 width="100%" 
//                                 height="100%"
//                                 style="position:absolute;top:0;left:0;right:0;bottom:0;"
//                               />
//                             </body>
//                           </html>
//                         `);
//                       }
//                     }}
//                     className="text-purple-600 hover:text-purple-800"
//                   >
//                     <FileText className="h-5 w-5 inline" />
//                   </button>
//                 ) : (
//                   <span className="text-gray-400">-</span>
//                 )}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => onEdit(resource)}
//                     className="text-indigo-600 hover:text-indigo-900"
//                   >
//                     <Edit2 className="h-5 w-5" />
//                   </button>
//                   <button
//                     onClick={() => onDelete(resource)}
//                     className="text-red-600 hover:text-red-900"
//                   >
//                     <Trash2 className="h-5 w-5" />
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// const getAccessToken = () => {
//   return localStorage.getItem('token') || '';
// };

// // Add this interface after other interfaces
// interface ResourceResponse {
//   id: string;
//   name: string;
//   resourceResponseDTO: {
//     exerciseUrl: string;
//     solutionUrl: string;
//     video: string;
//     classPPTUrl: string;
//     article: string;
//   };
// }

// // Update fetchResources function
// const fetchResources = async (subjectId: string) => {
//   try {
//     const response = await axios.get(
//       `https://lmsbackend-3l0h.onrender.com/api/content/subject/${subjectId}/topic`,
//       {
//         headers: {
//           Authorization: `Bearer ${getAccessToken()}`
//         }
//       }
//     );

//     // Transform API response to ResourceTableItem format
//     const transformedResources: ResourceTableItem[] = response.data.map((item: ResourceResponse) => ({
//       id: item.id,
//       subtopicId: subjectId,
//       status: true,
//       articleTitle: item.name || 'Untitled',
//       articleLink: item.resourceResponseDTO.article || '',
//       videoTitle: '',
//       videoLink: item.resourceResponseDTO.video || '',
//       exerciseTitle: 'Exercise',
//       exerciseLink: item.resourceResponseDTO.exerciseUrl || '',
//       solutionTitle: 'Solution',
//       solutionLink: item.resourceResponseDTO.solutionUrl || '',
//       practiceTitle: '',
//       practiceLink: '',
//       difficulty: 'Easy',
//       exercisePdfFile: item.resourceResponseDTO.exerciseUrl || '',
//       solutionPdfFile: item.resourceResponseDTO.solutionUrl || '',
//       classPptFile: item.resourceResponseDTO.classPPTUrl || '',
//       classPptTitle: 'Class PPT'
//     }));

//     return transformedResources;
//   } catch (error) {
//     console.error('Error fetching resources:', error);
//     toast.error('Failed to fetch resources.');
//     throw error;
//   }
// };

// const fetchSubjectById = async (id: string) => {
//   try {
//     const response = await axios.get(`https://lmsbackend-3l0h.onrender.com/api/content/subject/${id}`, {
//       headers: {
//         Authorization: `Bearer ${getAccessToken()}`
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching subject by ID:', error);
//     toast.error('Failed to fetch subject details.');
//     throw error;
//   }
// };

// const updateSubjectById = async (id: string, updatedData: Partial<Subject>) => {
//   try {
//     const response = await axios.put(
//       `https://lmsbackend-3l0h.onrender.com/api/content/subject/${id}`,
//       updatedData,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${getAccessToken()}`
//         }
//       }
//     );
//     toast.success('Subject updated successfully.');
//     return response.data;
//   } catch (error) {
//     console.error('Error updating subject:', error);
//     toast.error('Failed to update subject.');
//     throw error;
//   }
// };

// const deleteSubjectById = async (id: string) => {
//   try {
//     await axios.delete(`https://lmsbackend-3l0h.onrender.com/api/content/subject/${id}`, {
//       headers: {
//         Authorization: `Bearer ${getAccessToken()}`
//       }
//     });
//     toast.success('Subject deleted successfully.');
//   } catch (error) {
//     console.error('Error deleting subject:', error);
//     toast.error('Failed to delete subject.');
//     throw error;
//   }
// };

// const createResource = async (subjectId: string, resourceData: Resource) => {
//   try {
//     const formData = new FormData();
//     formData.append('name', resourceData.articleTitle || resourceData.videoTitle || "Untitled Resource");
    
//     // Append video and article links
//     if (resourceData.videoLink) {
//       formData.append('video', resourceData.videoLink);
//     }
//     if (resourceData.articleLink) {
//       formData.append('article', resourceData.articleLink);
//     }

//     // Convert base64 PDFs to File objects and append them
//     if (resourceData.exercisePdfFile) {
//       const exerciseFile = base64ToFile(resourceData.exercisePdfFile, resourceData.exerciseTitle || 'exercise.pdf');
//       formData.append('exercise', exerciseFile);
//     }

//     if (resourceData.solutionPdfFile) {
//       const solutionFile = base64ToFile(resourceData.solutionPdfFile, resourceData.solutionTitle || 'solution.pdf');
//       formData.append('solution', solutionFile);
//     }

//     if (resourceData.classPptFile) {
//       const classPPTFile = base64ToFile(resourceData.classPptFile, resourceData.classPptTitle || 'classPPT.pdf');
//       formData.append('classPPT', classPPTFile);
//     }

//     const response = await axios.post(
//       `https://lmsbackend-3l0h.onrender.com/api/content/subject/${subjectId}/topic`,
//       formData,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${getAccessToken()}`
//         }
//       }
//     );
//     toast.success('Resource created successfully.');
//     return response.data;
//   } catch (error) {
//     console.error('Error creating resource:', error);
//     toast.error('Failed to create resource.');
//     throw error;
//   }
// };

// const updateResource = async (subjectId: string, resourceId: string, updatedData: Partial<Resource>) => {
//   try {
//     const formData = new FormData();
//     formData.append('name', updatedData.articleTitle || updatedData.videoTitle || "Untitled Resource");
    
//     // Append video and article links
//     if (updatedData.videoLink) {
//       formData.append('video', updatedData.videoLink);
//     }
//     if (updatedData.articleLink) {
//       formData.append('article', updatedData.articleLink);
//     }

//     // Convert base64 PDFs to File objects and append them
//     if (updatedData.exercisePdfFile) {
//       const exerciseFile = base64ToFile(updatedData.exercisePdfFile, updatedData.exerciseTitle || 'exercise.pdf');
//       formData.append('exercise', exerciseFile);
//     }

//     if (updatedData.solutionPdfFile) {
//       const solutionFile = base64ToFile(updatedData.solutionPdfFile, updatedData.solutionTitle || 'solution.pdf');
//       formData.append('solution', solutionFile);
//     }

//     if (updatedData.classPptFile) {
//       const classPPTFile = base64ToFile(updatedData.classPptFile, updatedData.classPptTitle || 'classPPT.pdf');
//       formData.append('classPPT', classPPTFile);
//     }

//     const response = await axios.put(
//       `https://lmsbackend-3l0h.onrender.com/api/content/subject/${subjectId}/topic/${resourceId}`,
//       formData,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${getAccessToken()}`
//         }
//       }
//     );
//     toast.success('Resource updated successfully.');
//     return response.data;
//   } catch (error) {
//     console.error('Error updating resource:', error);
//     toast.error('Failed to update resource.');
//     throw error;
//   }
// };

// const deleteResource = async (subjectId: string, resourceId: string) => {
//   try {
//     await axios.delete(
//       `https://lmsbackend-3l0h.onrender.com/api/content/subject/${subjectId}/topic/${resourceId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${getAccessToken()}`
//         }
//       }
//     );
//     toast.success('Resource deleted successfully.');
//   } catch (error) {
//     console.error('Error deleting resource:', error);
//     toast.error('Failed to delete resource.');
//     throw error;
//   }
// };

// const saveTopicsToStorage = (subjectId: string, topics: Topic[]) => {
//   const storedData = JSON.parse(localStorage.getItem('topics') || '{}');
//   storedData[subjectId] = topics;
//   localStorage.setItem('topics', JSON.stringify(storedData));
// };

// const loadTopicsFromStorage = (subjectId: string): Topic[] => {
//   const storedData = JSON.parse(localStorage.getItem('topics') || '{}');
//   return storedData[subjectId] || [];
// };

// const SubjectEditor: React.FC = () => {
//   const [subjects, setSubjects] = useState<Subject[]>([]);
//   const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
//   const [expandedSubtopics, setExpandedSubtopics] = useState<string[]>([]);
//   const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
//   const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
//   const [selectedSubtopicId, setSelectedSubtopicId] = useState<string | null>(null);
//   const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
//   const [showAddTopicModal, setShowAddTopicModal] = useState(false);
//   const [showAddSubtopicModal, setShowAddSubtopicModal] = useState(false);
//   const [showAddResourceModal, setShowAddResourceModal] = useState(false);
//   const [resourceTableData, setResourceTableData] = useState<ResourceTableItem[]>([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingResourceId, setEditingResourceId] = useState<string | null>(null);

//   const [newSubject, setNewSubject] = useState({
//     name: '',
//     description: ''
//   });

//   const [newTopic, setNewTopic] = useState({
//     name: ''
//   });

//   const [newSubtopic, setNewSubtopic] = useState({
//     name: '',
//     description: ''
//   });

//   const [newResource, setNewResource] = useState({
//     articleLink: '',
//     articleTitle: '',
//     videoLink: '',
//     videoTitle: '',
//     pdfLink: '',
//     pdfTitle: '',
//     exerciseLink: '',
//     exerciseTitle: '',
//     solutionLink: '',
//     solutionTitle: '',
//     practiceLink: '',
//     practiceTitle: '',
//     solutionPdfFile: '',
//     exercisePdfFile: '',
//     classPptFile: '',
//     classPptTitle: ''
//   });

//   useEffect(() => {
//     const fetchSubjectsAndTopics = async () => {
//       try {
//         const response = await axios.get('https://lmsbackend-3l0h.onrender.com/api/content/subject', {
//           headers: {
//             Authorization: `Bearer ${getAccessToken()}`
//           }
//         });

//         const subjectsWithTopics = await Promise.all(
//           response.data.map(async (subject: Subject) => {
//             const topics = loadTopicsFromStorage(subject.id);
//             return { ...subject, topics };
//           })
//         );

//         setSubjects(subjectsWithTopics);
//       } catch (error) {
//         console.error('Error fetching subjects and topics:', error);
//         toast.error('Failed to fetch subjects and topics from server');
//       }
//     };

//     fetchSubjectsAndTopics();
//   }, []);

//   // Add this effect to load resources when component mounts
//   useEffect(() => {
//     const loadAllResources = async () => {
//       try {
//         if (subjects.length > 0) {
//           const allResources = await Promise.all(
//             subjects.map(async (subject) => {
//               const resources = await fetchResources(subject.id);
//               return resources;
//             })
//           );
          
//           // Flatten all resources into a single array
//           const flattenedResources = allResources.flat();
//           setResourceTableData(flattenedResources);
          
//           // Update subjects with their resources
//           const updatedSubjects = subjects.map((subject) => ({
//             ...subject,
//             resources: flattenedResources.filter(r => r.subtopicId === subject.id)
//           }));
//           setSubjects(updatedSubjects);
//         }
//       } catch (error) {
//         console.error('Error loading all resources:', error);
//       }
//     };

//     loadAllResources();
//   }, [subjects.length]);

//   const toggleTopic = (topicId: string) => {
//     setExpandedTopics(prev =>
//       prev.includes(topicId)
//         ? prev.filter(id => id !== topicId)
//         : [...prev, topicId]
//     );
//   };

//   const toggleSubtopic = (subtopicId: string) => {
//     setExpandedSubtopics(prev =>
//       prev.includes(subtopicId)
//         ? prev.filter(id => id !== subtopicId)
//         : [...prev, subtopicId]
//     );
//   };

//   const handleCreateSubject = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (newSubject.name.length < 2 || newSubject.name.length > 100) {
//       toast.error('Subject name must be between 2 and 100 characters.');
//       return;
//     }
//     if (newSubject.description.length < 10 || newSubject.description.length > 500) {
//       toast.error('Subject description must be between 10 and 500 characters.');
//       return;
//     }

//     try {
//       const newSubjectData = {
//         name: newSubject.name,
//         description: newSubject.description
//       };

//       const response = await axios.post(
//         'https://lmsbackend-3l0h.onrender.com/api/content/subject',
//         newSubjectData,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${getAccessToken()}`
//           }
//         }
//       );

//       if (response.status === 201 || response.status === 200) {
//         const createdSubject = {
//           id: response.data.id,
//           name: response.data.name,
//           description: response.data.description,
//           topics: [],
//           resources: []
//         };
//         setSubjects(prevSubjects => [...prevSubjects, createdSubject]);
//         setShowAddSubjectModal(false);
//         setNewSubject({ name: '', description: '' });
//         toast.success('Subject created successfully');
//       } else {
//         throw new Error('Unexpected error occurred while creating the subject.');
//       }
//     } catch (error: any) {
//       console.error('Error details:', error);
//       if (error.response) {
//         console.error('Response data:', error.response.data);
//         if (error.response.status === 409) {
//           toast.error('Subject with the same name already exists.');
//         } else {
//           toast.error(`Error: ${error.response.data.message || 'Failed to create subject'}`);
//         }
//       } else if (error.request) {
//         console.error('Request details:', error.request);
//         toast.error('No response received from the server. Please try again later.');
//       } else {
//         toast.error('An unexpected error occurred. Please try again.');
//       }
//     }
//   };

//   const handleRenameSubject = async (subjectId: string, newName: string) => {
//     try {
//       const updatedData = { name: newName };
//       const updatedSubject = await updateSubjectById(subjectId, updatedData);
//       setSubjects(prevSubjects =>
//         prevSubjects.map(subject =>
//           subject.id === subjectId ? { ...subject, name: updatedSubject.name } : subject
//         )
//       );
//       toast.success('Subject renamed successfully.');
//     } catch (error) {
//       console.error('Error renaming subject:', error);
//       toast.error('Failed to rename subject.');
//     }
//   };

//   const handleCreateTopic = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedSubjectId) {
//       toast.error('Please select a subject first');
//       return;
//     }

//     const newTopicData: Topic = {
//       id: Date.now().toString(),
//       name: newTopic.name,
//       subtopics: [],
//       resources: []
//     };

//     const updatedSubjects = subjects.map(subject =>
//       subject.id === selectedSubjectId
//         ? { ...subject, topics: [...subject.topics, newTopicData] }
//         : subject
//     );

//     setSubjects(updatedSubjects);
//     saveTopicsToStorage(selectedSubjectId, updatedSubjects.find(subject => subject.id === selectedSubjectId)?.topics || []);
//     setShowAddTopicModal(false);
//     setNewTopic({ name: '' });
//     toast.success('Topic added successfully');
//   };

//   const handleCreateSubtopic = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedSubjectId || !selectedTopicId) {
//       toast.error('Please select a topic first');
//       return;
//     }

//     const newSubtopicData: Subtopic = {
//       id: Date.now().toString(),
//       name: newSubtopic.name,
//       description: newSubtopic.description,
//       resources: []
//     };

//     const updatedSubjects = subjects.map(subject =>
//       subject.id === selectedSubjectId
//         ? {
//             ...subject,
//             topics: subject.topics.map(topic =>
//               topic.id === selectedTopicId
//                 ? { ...topic, subtopics: [...topic.subtopics, newSubtopicData] }
//                 : topic
//             )
//           }
//         : subject
//     );

//     setSubjects(updatedSubjects);
//     setShowAddSubtopicModal(false);
//     setNewSubtopic({ name: '', description: '' });
//     toast.success('Subtopic added successfully');
//   };

//   const handleCreateResource = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const resourceId = editingResourceId || Date.now().toString();
//       const newResourceData: Resource = {
//         id: resourceId,
//         dateAdded: new Date().toISOString(),
//         articleLink: newResource.articleLink || '',
//         articleTitle: newResource.articleTitle || '',
//         videoLink: newResource.videoLink || '',
//         videoTitle: newResource.videoTitle || '',
//         exerciseLink: newResource.exerciseLink || '',
//         exerciseTitle: newResource.exerciseTitle || '',
//         solutionLink: newResource.solutionLink || '',
//         solutionTitle: newResource.solutionTitle || '',
//         practiceLink: newResource.practiceLink || '',
//         practiceTitle: newResource.practiceTitle || '',
//         solutionPdfFile: newResource.solutionPdfFile || '',
//         exercisePdfFile: newResource.exercisePdfFile || '',
//         classPptFile: newResource.classPptFile || '',
//         classPptTitle: newResource.classPptTitle || ''
//       };

//       if (isEditing) {
//         await updateResource(selectedSubjectId!, editingResourceId!, newResourceData);
//       } else {
//         await createResource(selectedSubjectId!, newResourceData);
//       }

//       // Refresh resources after API call
//       const updatedResources = await fetchResources(selectedSubjectId!);
//       setResourceTableData(updatedResources);

//       setShowAddResourceModal(false);
//       setIsEditing(false);
//       setEditingResourceId(null);
//       setNewResource({
//         articleLink: '',
//         articleTitle: '',
//         videoLink: '',
//         videoTitle: '',
//         pdfLink: '',
//         pdfTitle: '',
//         exerciseLink: '',
//         exerciseTitle: '',
//         solutionLink: '',
//         solutionTitle: '',
//         practiceLink: '',
//         practiceTitle: '',
//         solutionPdfFile: '',
//         exercisePdfFile: '',
//         classPptFile: '',
//         classPptTitle: ''
//       });

//       toast.success(isEditing ? 'Resource updated successfully' : 'Resource added successfully');
//     } catch (error) {
//       console.error('Error saving resources:', error);
//       toast.error('Failed to save resources');
//     }
//   };

//   const handleSolutionPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       try {
//         const base64String = await storePdf(file);
//         setNewResource(prev => ({
//           ...prev,
//           solutionPdfFile: base64String,
//           solutionTitle: file.name
//         }));
//         toast.success('PDF uploaded successfully');
//       } catch (error) {
//         console.error('Error uploading PDF:', error);
//         toast.error('Failed to upload PDF');
//       }
//     }
//   };

//   const handleExercisePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       try {
//         const base64String = await storePdf(file);
//         setNewResource(prev => ({
//           ...prev,
//           exercisePdfFile: base64String,
//           exerciseTitle: file.name
//         }));
//         toast.success('Exercise PDF uploaded successfully');
//       } catch (error) {
//         console.error('Error uploading exercise PDF:', error);
//         toast.error('Failed to upload exercise PDF');
//       }
//     }
//   };

//   const handleClassPptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       try {
//         const base64String = await storePdf(file);
//         setNewResource(prev => ({
//           ...prev,
//           classPptFile: base64String,
//           classPptTitle: file.name
//         }));
//         toast.success('Class PPT uploaded successfully');
//       } catch (error) {
//         console.error('Error uploading Class PPT:', error);
//         toast.error('Failed to upload Class PPT');
//       }
//     }
//   };

//   const handleEditResource = (resource: ResourceTableItem) => {
//     setIsEditing(true);
//     setEditingResourceId(resource.id);
//     setNewResource({
//       articleTitle: resource.articleTitle,
//       articleLink: resource.articleLink,
//       videoTitle: resource.videoTitle,
//       videoLink: resource.videoLink,
//       pdfTitle: '',
//       pdfLink: '',
//       exerciseTitle: resource.exerciseTitle,
//       exerciseLink: resource.exerciseLink,
//       solutionTitle: resource.solutionTitle,
//       solutionLink: resource.solutionLink,
//       practiceTitle: resource.practiceTitle,
//       practiceLink: resource.practiceLink,
//       solutionPdfFile: resource.solutionPdfFile || '',
//       exercisePdfFile: resource.exercisePdfFile || '',
//       classPptFile: resource.classPptFile || '',
//       classPptTitle: resource.classPptTitle || ''
//     });
//     setShowAddResourceModal(true);
//   };

//   const handleDeleteResource = async (resource: ResourceTableItem) => {
//     if (confirm('Delete Resource\n\nAre you sure you want to delete this resource? This action cannot be undone.')) {
//       try {
//         await deleteResource(selectedSubjectId!, resource.id);
//         const updatedResources = await fetchResources(selectedSubjectId!);
//         setResourceTableData(updatedResources);
//       } catch (error) {
//         console.error('Error deleting resource:', error);
//       }
//     }
//   };

//   const handleDeleteSubject = async (subjectId: string) => {
//     if (confirm('Delete Subject\n\nAre you sure you want to delete this subject? This action cannot be undone and all associated data will be permanently removed.')) {
//       try {
//         await deleteSubjectById(subjectId);
//         setSubjects(prevSubjects => prevSubjects.filter(subject => subject.id !== subjectId));
//       } catch (error) {
//         console.error('Error deleting subject:', error);
//       }
//     }
//   };

//   const handleEditSubject = async (subjectId: string) => {
//     try {
//       const subjectDetails = await fetchSubjectById(subjectId);
//       setNewSubject({ name: subjectDetails.name, description: subjectDetails.description });
//       setShowAddSubjectModal(true);

//       const updatedSubject = { ...subjectDetails, name: newSubject.name, description: newSubject.description };
//       await updateSubjectById(subjectId, updatedSubject);
//       setSubjects(prevSubjects =>
//         prevSubjects.map(subject => (subject.id === subjectId ? updatedSubject : subject))
//       );
//     } catch (error) {
//       console.error('Error editing subject:', error);
//     }
//   };

//   const handleDeleteTopic = (subjectId: string, topicId: string) => {
//     if (confirm('Delete Topic\n\nAre you sure you want to delete this topic? This action cannot be undone and all associated data will be permanently removed.')) {
//       const updatedSubjects = subjects.map(subject =>
//         subject.id === subjectId
//           ? { ...subject, topics: subject.topics.filter(topic => topic.id !== topicId) }
//           : subject
//       );
//       setSubjects(updatedSubjects);
//       toast.success('Topic deleted successfully');
//     }
//   };

//   const handleDeleteSubtopic = (subjectId: string, topicId: string, subtopicId: string) => {
//     if (confirm('Delete Subtopic\n\nAre you sure you want to delete this subtopic? This action cannot be undone and all associated data will be permanently removed.')) {
//       const updatedSubjects = subjects.map(subject =>
//         subject.id === subjectId
//           ? {
//               ...subject,
//               topics: subject.topics.map(topic =>
//                 topic.id === topicId
//                   ? { ...topic, subtopics: topic.subtopics.filter(subtopic => subtopic.id !== subtopicId) }
//                   : topic
//               )
//             }
//           : subject
//       );
//       setSubjects(updatedSubjects);
//       toast.success('Subtopic deleted successfully');
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-gray-900">Subject Editor</h1>
//         <button
//           onClick={() => setShowAddSubjectModal(true)}
//           className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//         >
//           <Plus className="h-5 w-5 mr-2" />
//           Add New Subject
//         </button>
//       </div>

//       {/* Subjects List */}
//       <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
//         {subjects.map(subject => (
//           <div key={subject.id} className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-900">{subject.name}</h2>
//                 <p className="mt-1 text-sm text-gray-500">{subject.description}</p>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => {
//                     const newName = prompt('Enter new subject name:', subject.name);
//                     if (newName && newName.trim() !== '' && newName !== subject.name) {
//                       handleRenameSubject(subject.id, newName.trim());
//                     }
//                   }}
//                   className="text-green-600 hover:text-green-800"
//                 >
//                   <Edit2 className="h-5 w-5" />
//                 </button>
//                 <button 
//                   onClick={() => {
//                     setSelectedSubjectId(subject.id);
//                     setShowAddResourceModal(true);
//                   }}
//                   className="text-blue-600 hover:text-blue-800"
//                 >
//                   <Upload className="h-5 w-5" />
//                 </button>
//                 <button 
//                   onClick={() => handleDeleteSubject(subject.id)}
//                   className="text-red-600 hover:text-red-800"
//                 >
//                   <Trash2 className="h-5 w-5" />
//                 </button>
//               </div>
//             </div>

//             {/* Resources Table */}
//             <div className="mt-6">
//               {resourceTableData.length > 0 ? (
//                 <ResourcesTable
//                   resources={resourceTableData.filter(r => r.subtopicId === subject.id)}
//                   subtopicId={subject.id}
//                   onEdit={handleEditResource}
//                   onDelete={handleDeleteResource}
//                 />
//               ) : (
//                 <p className="text-sm text-gray-500 text-center">No resources added yet.</p>
//               )}
//             </div>

//             {/* Topics */}
//             {subject.topics && subject.topics.length > 0 && (
//               <div className="mt-6 space-y-4">
//                 {subject.topics.map(topic => (
//                   <div key={topic.id} className="border rounded-lg">
//                     <button
//                       onClick={() => toggleTopic(topic.id)}
//                       className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
//                     >
//                       <div className="flex items-center space-x-3">
//                         {expandedTopics.includes(topic.id) ? (
//                           <ChevronDown className="h-5 w-5 text-gray-400" />
//                         ) : (
//                           <ChevronRight className="h-5 w-5 text-gray-400" />
//                         )}
//                         <span className="font-medium text-gray-900">{topic.name}</span>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <button 
//                           onClick={(e) => {
//                             e.preventDefault();
//                             e.stopPropagation();
//                             setSelectedSubjectId(subject.id);
//                             setSelectedTopicId(topic.id);
//                             setSelectedSubtopicId(null);
//                             setShowAddResourceModal(true);
//                           }}
//                           className="text-blue-600 hover:text-blue-800"
//                         >
//                           <Upload className="h-4 w-4" />
//                         </button>
//                         <button 
//                           onClick={(e) => {
//                             e.preventDefault();
//                             e.stopPropagation();
//                             handleDeleteTopic(subject.id, topic.id);
//                           }}
//                           className="text-red-600 hover:text-red-800"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </div>
//                     </button>

//                     {/* Topic Resources */}
//                     {expandedTopics.includes(topic.id) && (
//                       <div className="border-t border-gray-200">
//                         <div className="px-6 py-4">
//                           {topic.resources && topic.resources.length > 0 ? (
//                             <ResourcesTable 
//                               resources={resourceTableData.filter(r => r.subtopicId === topic.id)}
//                               subtopicId={topic.id}
//                               onEdit={handleEditResource}
//                               onDelete={handleDeleteResource}
//                             />
//                           ) : (
//                             <p className="text-sm text-gray-500 text-center">
//                               No resources added to this topic yet.
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     )}

//                     {/* Subtopics */}
//                     {expandedTopics.includes(topic.id) && (
//                       <div className="border-t divide-y divide-gray-200">
//                         {topic.subtopics.map(subtopic => (
//                           <div key={subtopic.id} className="bg-gray-50">
//                             <button
//                               onClick={() => toggleSubtopic(subtopic.id)}
//                               className="w-full flex items-center justify-between p-4 hover:bg-gray-100"
//                             >
//                               <div className="flex items-center space-x-3 ml-6">
//                                 {expandedSubtopics.includes(subtopic.id) ? (
//                                   <ChevronDown className="h-4 w-4 text-gray-400" />
//                                 ) : (
//                                   <ChevronRight className="h-4 w-4 text-gray-400" />
//                                 )}
//                                 <span className="text-sm font-medium text-gray-900">{subtopic.name}</span>
//                               </div>
//                               <div className="flex items-center space-x-2">
//                                 <button 
//                                   onClick={(e) => {
//                                     e.preventDefault();
//                                     e.stopPropagation();
//                                     setSelectedSubjectId(subject.id);
//                                     setSelectedTopicId(topic.id);
//                                     setSelectedSubtopicId(subtopic.id);
//                                     setShowAddResourceModal(true);
//                                   }}
//                                   className="text-blue-600 hover:text-blue-800"
//                                 >
//                                   <Upload className="h-4 w-4" />
//                                 </button>
//                                 <button 
//                                   onClick={(e) => {
//                                     e.preventDefault();
//                                     e.stopPropagation();
//                                     handleDeleteSubtopic(subject.id, topic.id, subtopic.id);
//                                   }}
//                                   className="text-red-600 hover:text-red-800"
//                                 >
//                                   <Trash2 className="h-4 w-4" />
//                                 </button>
//                               </div>
//                             </button>

//                             {/* Resources */}
//                             {expandedSubtopics.includes(subtopic.id) && (
//                               <div className="px-14 pb-4">
//                                 {subtopic.resources.length > 0 ? (
//                                   <ResourcesTable 
//                                     resources={resourceTableData}
//                                     subtopicId={subtopic.id}
//                                     onEdit={handleEditResource}
//                                     onDelete={handleDeleteResource}
//                                   />
//                                 ) : (
//                                   <p className="text-sm text-gray-500 text-center">
//                                     No resources added yet.
//                                   </p>
//                                 )}
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//                 <button 
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setSelectedSubjectId(subject.id);
//                     setShowAddTopicModal(true);
//                   }}
//                   className="w-full text-left p-4 text-sm text-blue-600 hover:text-blue-800 border rounded-lg hover:bg-gray-50"
//                 >
//                   <Plus className="h-4 w-4 inline mr-1" />
//                   Add Topic
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Add Subject Modal */}
//       {showAddSubjectModal && (
//         <div className="fixed inset-0 overflow-y-auto z-50">
//           <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
//             <div className="fixed inset-0 transition-opacity">
//               <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//             </div>

//             <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//               <form onSubmit={handleCreateSubject}>
//                 <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                   <h3 className="text-lg font-medium text-gray-900">Add New Subject</h3>
//                   <div className="mt-4">
//                     <div>
//                       <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                         Subject Name
//                       </label>
//                       <input
//                         type="text"
//                         id="name"
//                         value={newSubject.name}
//                         onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
//                         className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
//                         Subject Description
//                       </label>
//                       <textarea
//                         id="description"
//                         value={newSubject.description}
//                         onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
//                         className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         required
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//                   <button
//                     type="submit"
//                     className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
//                   >
//                     Create Subject
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setShowAddSubjectModal(false)}
//                     className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Topic Modal */}
//       {showAddTopicModal && (
//         <div className="fixed inset-0 overflow-y-auto z-50">
//           <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
//             <div className="fixed inset-0 transition-opacity">
//               <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//             </div>

//             <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//               <form onSubmit={handleCreateTopic}>
//                 <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                   <h3 className="text-lg font-medium text-gray-900">Add New Topic</h3>
//                   <div className="mt-4 space-y-6">
//                     <div>
//                       <label htmlFor="topicName" className="block text-sm font-medium text-gray-700 mb-2">
//                         Topic Name
//                       </label>
//                       <input
//                         type="text"
//                         id="topicName"
//                         value={newTopic.name}
//                         onChange={(e) => setNewTopic({ name: e.target.value })}
//                         className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//                         required
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//                   <button
//                     type="submit"
//                     className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
//                   >
//                     Add Topic
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setShowAddTopicModal(false)}
//                     className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Subtopic Modal */}
//       {showAddSubtopicModal && (
//         <div className="fixed inset-0 overflow-y-auto z-50">
//           <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
//             <div className="fixed inset-0 transition-opacity">
//               <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//             </div>

//             <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//               <form onSubmit={handleCreateSubtopic}>
//                 <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                   <h3 className="text-lg font-medium text-gray-900">Add New Subtopic</h3>
//                   <div className="mt-4">
//                     <div>
//                       <label htmlFor="subtopicName" className="block text-sm font-medium text-gray-700 mb-1">
//                         Subtopic Name
//                       </label>
//                       <input
//                         type="text"
//                         id="subtopicName"
//                         value={newSubtopic.name}
//                         onChange={(e) => setNewSubtopic({ ...newSubtopic, name: e.target.value })}
//                         className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//                         required
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//                   <button
//                     type="submit"
//                     className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
//                   >
//                     Add Subtopic
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setShowAddSubtopicModal(false)}
//                     className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Resource Modal */}
// {showAddResourceModal && (
//   <div className="fixed inset-0 overflow-y-auto z-50">
//     <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
//       <div className="fixed inset-0 transition-opacity">
//         <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//       </div>

//       <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
//         <form onSubmit={handleCreateResource}>
//           <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//             <h3 className="text-lg font-medium text-gray-900">Add Resources</h3>
//             <div className="mt-4 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Article Section */}
//                 <div className="border rounded-lg p-4">
//                   <h4 className="font-medium text-gray-900 mb-3">Topic Name </h4>
//                   <div className="space-y-4">
//                     <div>
//                       <label htmlFor="articleTitle" className="block text-sm font-medium text-gray-700 mb-1">
//                         Name 
//                       </label>
//                       <input
//                         type="text"
//                         id="articleTitle"
//                         value={newResource.articleTitle}
//                         onChange={(e) => setNewResource({...newResource, articleTitle: e.target.value})}
//                         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         placeholder="Enter Topic Name"
//                       />
//                     </div>
                    
//                   </div>
//                 </div>



//                 {/* PDF Section */}
//                 {/* <div className="border rounded-lg p-4">
//                   <h4 className="font-medium text-gray-900 mb-3">Additional Resources (PDF)</h4>
//                   <div className="space-y-4">
//                     <div>
//                       <label htmlFor="pdfLink" className="block text-sm font-medium text-gray-700 mb-1">
//                         Link
//                       </label>
//                       <input
//                         type="url"
//                         id="pdfLink"
//                         value={newResource.pdfLink}
//                         onChange={(e) => setNewResource({...newResource, pdfLink: e.target.value})}
//                         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         placeholder="https://"
//                       />
//                     </div>
//                   </div>
//                 </div> */}

//                 {/* Exercise Section */}
//                 <div className="border rounded-lg p-4">
//                   <h4 className="font-medium text-gray-900 mb-3">Exercise </h4>
//                   <div className="space-y-4">
//                     <div>
//                       <label htmlFor="exercisePdf" className="block text-sm font-medium text-gray-700 mb-1">
//                         Upload Exercise PDF
//                       </label>
//                       <input
//                         type="file"
//                         id="exercisePdf"
//                         accept=".pdf"
//                         onChange={handleExercisePdfUpload}
//                         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       />
//                     </div>
//                     {newResource.exercisePdfFile && (
//                       <div className="mt-2">
//                         <p className="text-sm text-gray-500">PDF uploaded: {newResource.exerciseTitle}</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Solution Section */}
//                 <div className="border rounded-lg p-4">
//                   <h4 className="font-medium text-gray-900 mb-3">Solution</h4>
//                   <div className="space-y-4">
//                     <div>
//                       <label htmlFor="solutionPdf" className="block text-sm font-medium text-gray-700 mb-1">
//                         Upload PDF
//                       </label>
//                       <input
//                         type="file"
//                         id="solutionPdf"
//                         accept=".pdf"
//                         onChange={handleSolutionPdfUpload}
//                         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       />
//                     </div>
//                     {newResource.solutionPdfFile && (
//                       <div className="mt-2">
//                         <p className="text-sm text-gray-500">PDF uploaded: {newResource.solutionTitle}</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Video Section */}
//                 <div className="border rounded-lg p-4">
//                   <h4 className="font-medium text-gray-900 mb-3">Video</h4>
//                   <div className="space-y-4">
//                     <div>
//                       <label htmlFor="videoLink" className="block text-sm font-medium text-gray-700 mb-1">
//                         Link
//                       </label>
//                       <input
//                         type="url"
//                         id="videoLink"
//                         value={newResource.videoLink}
//                         onChange={(e) => setNewResource({...newResource, videoLink: e.target.value})}
//                         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         placeholder="https://"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Class PPT */}
//                 <div className="border rounded-lg p-4">
//                   <h4 className="font-medium text-gray-900 mb-3">Class PPT</h4>
//                   <div className="space-y-4">
//                     <div>
//                       <label htmlFor="classPpt" className="block text-sm font-medium text-gray-700 mb-1">
//                         Upload Class PPT (PDF)
//                       </label>
//                       <input
//                         type="file"
//                         id="classPpt"
//                         accept=".pdf"
//                         onChange={handleClassPptUpload}
//                         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       />
//                     </div>
//                     {newResource.classPptFile && (
//                       <div className="mt-2">
//                         <p className="text-sm text-gray-500">PDF uploaded: {newResource.classPptTitle}</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Article Section */}
//                 <div className="border rounded-lg p-4">
//                   <h4 className="font-medium text-gray-900 mb-3">Resources</h4>
//                   <div className="space-y-4">
                    
//                     <div>
//                       <label htmlFor="articleLink" className="block text-sm font-medium text-gray-700 mb-1">
//                         Link
//                       </label>
//                       <input
//                         type="url"
//                         id="articleLink"
//                         value={newResource.articleLink}
//                         onChange={(e) => setNewResource({...newResource, articleLink: e.target.value})}
//                         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         placeholder="https://"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//             <button
//               type="submit"
//               className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
//             >
//               Add Resources
//             </button>
//             <button
//               type="button"
//               onClick={() => setShowAddResourceModal(false)}
//               className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   </div>
// )}
//     </div>
//   );
// };

// export default SubjectEditor;
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, ChevronDown, ChevronRight, ExternalLink, FileText, Video, Edit2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { saveResourceTableToStorage, loadResourceTableFromStorage } from '../../utils/storage';
import axios from 'axios';
import config from '../../config';
import api from '../../services/api';

export interface Subject {
  id: string;
  name: string;
  description: string;
  topics: Topic[];
  resources: Resource[];
}

export interface Resource {
  id: string;
  dateAdded: string;
  articleLink?: string;
  articleTitle?: string;
  videoLink?: string;
  videoTitle?: string;
  pdfLink?: string;
  pdfTitle?: string;
  exerciseLink?: string;
  exerciseTitle?: string;
  solutionLink?: string;
  solutionTitle?: string;
  practiceLink?: string;
  practiceTitle?: string;
  solutionPdfFile?: string; // Base64 encoded PDF data
  exercisePdfFile?: string; // Base64 encoded PDF data
  classPptFile?: string;
  classPptTitle?: string; // Added missing interface field
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
  classPptTitle?: string; // Added missing interface field
}

interface Subtopic {
  id: string;
  name: string;
  description: string;
  resources: Resource[];
}

export interface Topic {
  id: string;
  name: string;
  subtopics: Subtopic[];
  resources: Resource[];
}

export const storePdf = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Add this helper function to convert base64 to File object
const base64ToFile = (base64String: string, filename: string): File => {
  const arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const PdfViewer: React.FC<{ pdfData: string; title: string }> = ({ pdfData, title }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gray-800 bg-opacity-75">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white w-full max-w-6xl rounded-lg shadow-xl">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-medium">{title}</h3>
            <button
              onClick={() => window.close()}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              ×
            </button>
          </div>
          <div className="h-[80vh]">
            <embed
              src={pdfData}
              type="application/pdf"
              width="100%"
              height="100%"
              className="border-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ResourcesTable: React.FC<{ 
  resources: ResourceTableItem[];
  subtopicId: string;
  onEdit: (resource: ResourceTableItem) => void;
  onDelete: (resource: ResourceTableItem) => void;
}> = ({ resources, subtopicId, onEdit, onDelete }) => {
  const subtopicResources = resources.filter(resource => resource.subtopicId === subtopicId);

  return (
    <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/4">
              Name
            </th>
            {["Exercise", "Solution", "Video", "Article", "Class PPT", "Actions"].map((header) => (
              <th 
                key={header}
                scope="col" 
                className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {subtopicResources.map((resource, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {resource.articleTitle || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {resource.exercisePdfFile ? (
                  <button
                    onClick={() => window.open(resource.exercisePdfFile, '_blank')}
                    className="inline-flex items-center justify-center p-2 rounded-full hover:bg-orange-50 transition-colors duration-200"
                  >
                    <FileText className="h-5 w-5 text-orange-500" />
                  </button>
                ) : <span className="text-gray-400">-</span>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {resource.solutionPdfFile ? (
                  <button
                    onClick={() => window.open(resource.solutionPdfFile, '_blank')}
                    className="inline-flex items-center justify-center p-2 rounded-full hover:bg-green-50 transition-colors duration-200"
                  >
                    <FileText className="h-5 w-5 text-green-500" />
                  </button>
                ) : <span className="text-gray-400">-</span>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {resource.videoLink ? (
                  <a
                    href={resource.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center p-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
                  >
                    <Video className="h-5 w-5 text-blue-500" />
                  </a>
                ) : <span className="text-gray-400">-</span>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {resource.articleLink ? (
                  <a
                    href={resource.articleLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center p-2 rounded-full hover:bg-indigo-50 transition-colors duration-200"
                  >
                    <ExternalLink className="h-5 w-5 text-indigo-500" />
                  </a>
                ) : <span className="text-gray-400">-</span>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {resource.classPptFile ? (
                  <button
                    onClick={() => window.open(resource.classPptFile, '_blank')}
                    className="inline-flex items-center justify-center p-2 rounded-full hover:bg-purple-50 transition-colors duration-200"
                  >
                    <FileText className="h-5 w-5 text-purple-500" />
                  </button>
                ) : <span className="text-gray-400">-</span>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex items-center justify-center space-x-3">
                  <button
                    onClick={() => onEdit(resource)}
                    className="p-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
                    title="Edit"
                  >
                    <Edit2 className="h-5 w-5 text-blue-500" />
                  </button>
                  <button
                    onClick={() => onDelete(resource)}
                    className="p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {subtopicResources.length === 0 && (
        <div className="text-center py-4 text-sm text-gray-500">
          No resources available
        </div>
      )}
    </div>
  );
};

const getAccessToken = () => {
  return localStorage.getItem('token') || '';
};

// Add this interface after other interfaces
interface ResourceResponse {
  id: string;
  name: string;
  resourceResponseDTO: {
    exerciseUrl: string;
    solutionUrl: string;
    video: string;
    classPPTUrl: string;
    article: string;
  };
}

// Update fetchResources function
const fetchResources = async (subjectId: string) => {
  try {
    const response = await axios.get(
      `https://lmsbackend-3l0h.onrender.com/api/content/subject/${subjectId}/topic`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      }
    );

    // Transform API response to ResourceTableItem format
    const transformedResources: ResourceTableItem[] = response.data.map((item: ResourceResponse) => ({
      id: item.id,
      subtopicId: subjectId,
      status: true,
      articleTitle: item.name || 'Untitled',
      articleLink: item.resourceResponseDTO.article || '',
      videoTitle: '',
      videoLink: item.resourceResponseDTO.video || '',
      exerciseTitle: 'Exercise',
      exerciseLink: item.resourceResponseDTO.exerciseUrl || '',
      solutionTitle: 'Solution',
      solutionLink: item.resourceResponseDTO.solutionUrl || '',
      practiceTitle: '',
      practiceLink: '',
      difficulty: 'Easy',
      exercisePdfFile: item.resourceResponseDTO.exerciseUrl || '',
      solutionPdfFile: item.resourceResponseDTO.solutionUrl || '',
      classPptFile: item.resourceResponseDTO.classPPTUrl || '',
      classPptTitle: 'Class PPT'
    }));

    return transformedResources;
  } catch (error) {
    console.error('Error fetching resources:', error);
    toast.error('Failed to fetch resources.');
    throw error;
  }
};

const fetchSubjectById = async (id: string) => {
  try {
    const response = await axios.get(`https://lmsbackend-3l0h.onrender.com/api/content/subject/${id}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching subject by ID:', error);
    toast.error('Failed to fetch subject details.');
    throw error;
  }
};

const updateSubjectById = async (id: string, updatedData: Partial<Subject>) => {
  try {
    const response = await axios.put(
      `https://lmsbackend-3l0h.onrender.com/api/content/subject/${id}`,
      updatedData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAccessToken()}`
        }
      }
    );
    toast.success('Subject updated successfully.');
    return response.data;
  } catch (error) {
    console.error('Error updating subject:', error);
    toast.error('Failed to update subject.');
    throw error;
  }
};

const deleteSubjectById = async (id: string) => {
  try {
    await axios.delete(`https://lmsbackend-3l0h.onrender.com/api/content/subject/${id}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    });
    toast.success('Subject deleted successfully.');
  } catch (error) {
    console.error('Error deleting subject:', error);
    toast.error('Failed to delete subject.');
    throw error;
  }
};

const createResource = async (subjectId: string, resourceData: Resource) => {
  try {
    const formData = new FormData();
    formData.append('name', resourceData.articleTitle || resourceData.videoTitle || "Untitled Resource");
    
    // Append video and article links
    if (resourceData.videoLink) {
      formData.append('video', resourceData.videoLink);
    }
    if (resourceData.articleLink) {
      formData.append('article', resourceData.articleLink);
    }

    // Convert base64 PDFs to File objects and append them
    if (resourceData.exercisePdfFile) {
      const exerciseFile = base64ToFile(resourceData.exercisePdfFile, resourceData.exerciseTitle || 'exercise.pdf');
      formData.append('exercise', exerciseFile);
    }

    if (resourceData.solutionPdfFile) {
      const solutionFile = base64ToFile(resourceData.solutionPdfFile, resourceData.solutionTitle || 'solution.pdf');
      formData.append('solution', solutionFile);
    }

    if (resourceData.classPptFile) {
      const classPPTFile = base64ToFile(resourceData.classPptFile, resourceData.classPptTitle || 'classPPT.pdf');
      formData.append('classPPT', classPPTFile);
    }

    const response = await axios.post(
      `https://lmsbackend-3l0h.onrender.com/api/content/subject/${subjectId}/topic`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${getAccessToken()}`
        }
      }
    );
    toast.success('Resource created successfully.');
    return response.data;
  } catch (error) {
    console.error('Error creating resource:', error);
    toast.error('Failed to create resource.');
    throw error;
  }
};

const updateResource = async (subjectId: string, resourceId: string, updatedData: Partial<Resource>) => {
  try {
    const formData = new FormData();
    formData.append('name', updatedData.articleTitle || updatedData.videoTitle || "Untitled Resource");
    
    // Append video and article links
    if (updatedData.videoLink) {
      formData.append('video', updatedData.videoLink);
    }
    if (updatedData.articleLink) {
      formData.append('article', updatedData.articleLink);
    }

    // Convert base64 PDFs to File objects and append them
    if (updatedData.exercisePdfFile) {
      const exerciseFile = base64ToFile(updatedData.exercisePdfFile, updatedData.exerciseTitle || 'exercise.pdf');
      formData.append('exercise', exerciseFile);
    }

    if (updatedData.solutionPdfFile) {
      const solutionFile = base64ToFile(updatedData.solutionPdfFile, updatedData.solutionTitle || 'solution.pdf');
      formData.append('solution', solutionFile);
    }

    if (updatedData.classPptFile) {
      const classPPTFile = base64ToFile(updatedData.classPptFile, updatedData.classPptTitle || 'classPPT.pdf');
      formData.append('classPPT', classPPTFile);
    }

    const response = await axios.put(
      `https://lmsbackend-3l0h.onrender.com/api/content/subject/${subjectId}/topic/${resourceId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${getAccessToken()}`
        }
      }
    );
    toast.success('Resource updated successfully.');
    return response.data;
  } catch (error) {
    console.error('Error updating resource:', error);
    toast.error('Failed to update resource.');
    throw error;
  }
};

const deleteResource = async (subjectId: string, resourceId: string) => {
  try {
    await axios.delete(
      `https://lmsbackend-3l0h.onrender.com/api/content/subject/${subjectId}/topic/${resourceId}`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      }
    );
    toast.success('Resource deleted successfully.');
  } catch (error) {
    console.error('Error deleting resource:', error);
    toast.error('Failed to delete resource.');
    throw error;
  }
};

const saveTopicsToStorage = (subjectId: string, topics: Topic[]) => {
  const storedData = JSON.parse(localStorage.getItem('topics') || '{}');
  storedData[subjectId] = topics;
  localStorage.setItem('topics', JSON.stringify(storedData));
};

const loadTopicsFromStorage = (subjectId: string): Topic[] => {
  const storedData = JSON.parse(localStorage.getItem('topics') || '{}');
  return storedData[subjectId] || [];
};

const SubjectEditor: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
  const [expandedSubtopics, setExpandedSubtopics] = useState<string[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string | null>(null);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);
  const [showAddSubtopicModal, setShowAddSubtopicModal] = useState(false);
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [resourceTableData, setResourceTableData] = useState<ResourceTableItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);

  const [newSubject, setNewSubject] = useState({
    name: '',
    description: ''
  });

  const [newTopic, setNewTopic] = useState({
    name: ''
  });

  const [newSubtopic, setNewSubtopic] = useState({
    name: '',
    description: ''
  });

  const [newResource, setNewResource] = useState({
    articleLink: '',
    articleTitle: '',
    videoLink: '',
    videoTitle: '',
    pdfLink: '',
    pdfTitle: '',
    exerciseLink: '',
    exerciseTitle: '',
    solutionLink: '',
    solutionTitle: '',
    practiceLink: '',
    practiceTitle: '',
    solutionPdfFile: '',
    exercisePdfFile: '',
    classPptFile: '',
    classPptTitle: ''
  });

  useEffect(() => {
    const fetchSubjectsAndTopics = async () => {
      try {
        const response = await axios.get('https://lmsbackend-3l0h.onrender.com/api/content/subject', {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`
          }
        });

        const subjectsWithTopics = await Promise.all(
          response.data.map(async (subject: Subject) => {
            const topics = loadTopicsFromStorage(subject.id);
            return { ...subject, topics };
          })
        );

        setSubjects(subjectsWithTopics);
      } catch (error) {
        console.error('Error fetching subjects and topics:', error);
        toast.error('Failed to fetch subjects and topics from server');
      }
    };

    fetchSubjectsAndTopics();
  }, []);

  // Add this effect to load resources when component mounts
  useEffect(() => {
    const loadAllResources = async () => {
      try {
        if (subjects.length > 0) {
          const allResources = await Promise.all(
            subjects.map(async (subject) => {
              const resources = await fetchResources(subject.id);
              return resources;
            })
          );
          
          // Flatten all resources into a single array
          const flattenedResources = allResources.flat();
          setResourceTableData(flattenedResources);
          
          // Update subjects with their resources
          const updatedSubjects = subjects.map((subject) => ({
            ...subject,
            resources: flattenedResources.filter(r => r.subtopicId === subject.id)
          }));
          setSubjects(updatedSubjects);
        }
      } catch (error) {
        console.error('Error loading all resources:', error);
      }
    };

    loadAllResources();
  }, [subjects.length]);

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const toggleSubtopic = (subtopicId: string) => {
    setExpandedSubtopics(prev =>
      prev.includes(subtopicId)
        ? prev.filter(id => id !== subtopicId)
        : [...prev, subtopicId]
    );
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newSubject.name.length < 2 || newSubject.name.length > 100) {
      toast.error('Subject name must be between 2 and 100 characters.');
      return;
    }
    if (newSubject.description.length < 10 || newSubject.description.length > 500) {
      toast.error('Subject description must be between 10 and 500 characters.');
      return;
    }

    try {
      const newSubjectData = {
        name: newSubject.name,
        description: newSubject.description
      };

      const response = await axios.post(
        'https://lmsbackend-3l0h.onrender.com/api/content/subject',
        newSubjectData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAccessToken()}`
          }
        }
      );

      if (response.status === 201 || response.status === 200) {
        const createdSubject = {
          id: response.data.id,
          name: response.data.name,
          description: response.data.description,
          topics: [],
          resources: []
        };
        setSubjects(prevSubjects => [...prevSubjects, createdSubject]);
        setShowAddSubjectModal(false);
        setNewSubject({ name: '', description: '' });
        toast.success('Subject created successfully');
      } else {
        throw new Error('Unexpected error occurred while creating the subject.');
      }
    } catch (error: any) {
      console.error('Error details:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        if (error.response.status === 409) {
          toast.error('Subject with the same name already exists.');
        } else {
          toast.error(`Error: ${error.response.data.message || 'Failed to create subject'}`);
        }
      } else if (error.request) {
        console.error('Request details:', error.request);
        toast.error('No response received from the server. Please try again later.');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleRenameSubject = async (subjectId: string, newName: string) => {
    try {
      const updatedData = { name: newName };
      const updatedSubject = await updateSubjectById(subjectId, updatedData);
      setSubjects(prevSubjects =>
        prevSubjects.map(subject =>
          subject.id === subjectId ? { ...subject, name: updatedSubject.name } : subject
        )
      );
      toast.success('Subject renamed successfully.');
    } catch (error) {
      console.error('Error renaming subject:', error);
      toast.error('Failed to rename subject.');
    }
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId) {
      toast.error('Please select a subject first');
      return;
    }

    const newTopicData: Topic = {
      id: Date.now().toString(),
      name: newTopic.name,
      subtopics: [],
      resources: []
    };

    const updatedSubjects = subjects.map(subject =>
      subject.id === selectedSubjectId
        ? { ...subject, topics: [...subject.topics, newTopicData] }
        : subject
    );

    setSubjects(updatedSubjects);
    saveTopicsToStorage(selectedSubjectId, updatedSubjects.find(subject => subject.id === selectedSubjectId)?.topics || []);
    setShowAddTopicModal(false);
    setNewTopic({ name: '' });
    toast.success('Topic added successfully');
  };

  const handleCreateSubtopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId || !selectedTopicId) {
      toast.error('Please select a topic first');
      return;
    }

    const newSubtopicData: Subtopic = {
      id: Date.now().toString(),
      name: newSubtopic.name,
      description: newSubtopic.description,
      resources: []
    };

    const updatedSubjects = subjects.map(subject =>
      subject.id === selectedSubjectId
        ? {
            ...subject,
            topics: subject.topics.map(topic =>
              topic.id === selectedTopicId
                ? { ...topic, subtopics: [...topic.subtopics, newSubtopicData] }
                : topic
            )
          }
        : subject
    );

    setSubjects(updatedSubjects);
    setShowAddSubtopicModal(false);
    setNewSubtopic({ name: '', description: '' });
    toast.success('Subtopic added successfully');
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const resourceId = editingResourceId || Date.now().toString();
      const newResourceData: Resource = {
        id: resourceId,
        dateAdded: new Date().toISOString(),
        articleLink: newResource.articleLink || '',
        articleTitle: newResource.articleTitle || '',
        videoLink: newResource.videoLink || '',
        videoTitle: newResource.videoTitle || '',
        exerciseLink: newResource.exerciseLink || '',
        exerciseTitle: newResource.exerciseTitle || '',
        solutionLink: newResource.solutionLink || '',
        solutionTitle: newResource.solutionTitle || '',
        practiceLink: newResource.practiceLink || '',
        practiceTitle: newResource.practiceTitle || '',
        solutionPdfFile: newResource.solutionPdfFile || '',
        exercisePdfFile: newResource.exercisePdfFile || '',
        classPptFile: newResource.classPptFile || '',
        classPptTitle: newResource.classPptTitle || ''
      };

      if (isEditing) {
        await updateResource(selectedSubjectId!, editingResourceId!, newResourceData);
      } else {
        await createResource(selectedSubjectId!, newResourceData);
      }

      // Refresh resources after API call
      const updatedResources = await fetchResources(selectedSubjectId!);
      setResourceTableData(updatedResources);

      setShowAddResourceModal(false);
      setIsEditing(false);
      setEditingResourceId(null);
      setNewResource({
        articleLink: '',
        articleTitle: '',
        videoLink: '',
        videoTitle: '',
        pdfLink: '',
        pdfTitle: '',
        exerciseLink: '',
        exerciseTitle: '',
        solutionLink: '',
        solutionTitle: '',
        practiceLink: '',
        practiceTitle: '',
        solutionPdfFile: '',
        exercisePdfFile: '',
        classPptFile: '',
        classPptTitle: ''
      });

      toast.success(isEditing ? 'Resource updated successfully' : 'Resource added successfully');
    } catch (error) {
      console.error('Error saving resources:', error);
      toast.error('Failed to save resources');
    }
  };

  const handleSolutionPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64String = await storePdf(file);
        setNewResource(prev => ({
          ...prev,
          solutionPdfFile: base64String,
          solutionTitle: file.name
        }));
        toast.success('PDF uploaded successfully');
      } catch (error) {
        console.error('Error uploading PDF:', error);
        toast.error('Failed to upload PDF');
      }
    }
  };

  const handleExercisePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64String = await storePdf(file);
        setNewResource(prev => ({
          ...prev,
          exercisePdfFile: base64String,
          exerciseTitle: file.name
        }));
        toast.success('Exercise PDF uploaded successfully');
      } catch (error) {
        console.error('Error uploading exercise PDF:', error);
        toast.error('Failed to upload exercise PDF');
      }
    }
  };

  const handleClassPptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64String = await storePdf(file);
        setNewResource(prev => ({
          ...prev,
          classPptFile: base64String,
          classPptTitle: file.name
        }));
        toast.success('Class PPT uploaded successfully');
      } catch (error) {
        console.error('Error uploading Class PPT:', error);
        toast.error('Failed to upload Class PPT');
      }
    }
  };

  const handleEditResource = (resource: ResourceTableItem) => {
    setIsEditing(true);
    setEditingResourceId(resource.id);
    setNewResource({
      articleTitle: resource.articleTitle,
      articleLink: resource.articleLink,
      videoTitle: resource.videoTitle,
      videoLink: resource.videoLink,
      pdfTitle: '',
      pdfLink: '',
      exerciseTitle: resource.exerciseTitle,
      exerciseLink: resource.exerciseLink,
      solutionTitle: resource.solutionTitle,
      solutionLink: resource.solutionLink,
      practiceTitle: resource.practiceTitle,
      practiceLink: resource.practiceLink,
      solutionPdfFile: resource.solutionPdfFile || '',
      exercisePdfFile: resource.exercisePdfFile || '',
      classPptFile: resource.classPptFile || '',
      classPptTitle: resource.classPptTitle || ''
    });
    setShowAddResourceModal(true);
  };

  const handleDeleteResource = async (resource: ResourceTableItem) => {
    if (confirm('Delete Resource\n\nAre you sure you want to delete this resource? This action cannot be undone.')) {
      try {
        await deleteResource(selectedSubjectId!, resource.id);
        const updatedResources = await fetchResources(selectedSubjectId!);
        setResourceTableData(updatedResources);
      } catch (error) {
        console.error('Error deleting resource:', error);
      }
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    if (confirm('Delete Subject\n\nAre you sure you want to delete this subject? This action cannot be undone and all associated data will be permanently removed.')) {
      try {
        await deleteSubjectById(subjectId);
        setSubjects(prevSubjects => prevSubjects.filter(subject => subject.id !== subjectId));
      } catch (error) {
        console.error('Error deleting subject:', error);
      }
    }
  };

  const handleEditSubject = async (subjectId: string) => {
    try {
      const subjectDetails = await fetchSubjectById(subjectId);
      setNewSubject({ name: subjectDetails.name, description: subjectDetails.description });
      setShowAddSubjectModal(true);

      const updatedSubject = { ...subjectDetails, name: newSubject.name, description: newSubject.description };
      await updateSubjectById(subjectId, updatedSubject);
      setSubjects(prevSubjects =>
        prevSubjects.map(subject => (subject.id === subjectId ? updatedSubject : subject))
      );
    } catch (error) {
      console.error('Error editing subject:', error);
    }
  };

  const handleDeleteTopic = (subjectId: string, topicId: string) => {
    if (confirm('Delete Topic\n\nAre you sure you want to delete this topic? This action cannot be undone and all associated data will be permanently removed.')) {
      const updatedSubjects = subjects.map(subject =>
        subject.id === subjectId
          ? { ...subject, topics: subject.topics.filter(topic => topic.id !== topicId) }
          : subject
      );
      setSubjects(updatedSubjects);
      toast.success('Topic deleted successfully');
    }
  };

  const handleDeleteSubtopic = (subjectId: string, topicId: string, subtopicId: string) => {
    if (confirm('Delete Subtopic\n\nAre you sure you want to delete this subtopic? This action cannot be undone and all associated data will be permanently removed.')) {
      const updatedSubjects = subjects.map(subject =>
        subject.id === subjectId
          ? {
              ...subject,
              topics: subject.topics.map(topic =>
                topic.id === topicId
                  ? { ...topic, subtopics: topic.subtopics.filter(subtopic => subtopic.id !== subtopicId) }
                  : topic
              )
            }
          : subject
      );
      setSubjects(updatedSubjects);
      toast.success('Subtopic deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Subject Editor</h1>
        <button
          onClick={() => setShowAddSubjectModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Subject
        </button>
      </div>

      {/* Subjects List */}
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {subjects.map(subject => (
          <div key={subject.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{subject.name}</h2>
                <p className="mt-1 text-sm text-gray-500">{subject.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const newName = prompt('Enter new subject name:', subject.name);
                    if (newName && newName.trim() !== '' && newName !== subject.name) {
                      handleRenameSubject(subject.id, newName.trim());
                    }
                  }}
                  className="text-green-600 hover:text-green-800"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => {
                    setSelectedSubjectId(subject.id);
                    setShowAddResourceModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Upload className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => handleDeleteSubject(subject.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Resources Table */}
            <div className="mt-6">
              {resourceTableData.length > 0 ? (
                <ResourcesTable
                  resources={resourceTableData.filter(r => r.subtopicId === subject.id)}
                  subtopicId={subject.id}
                  onEdit={handleEditResource}
                  onDelete={handleDeleteResource}
                />
              ) : (
                <p className="text-sm text-gray-500 text-center">No resources added yet.</p>
              )}
            </div>

            {/* Topics */}
            {subject.topics && subject.topics.length > 0 && (
              <div className="mt-6 space-y-4">
                {subject.topics.map(topic => (
                  <div key={topic.id} className="border rounded-lg">
                    <button
                      onClick={() => toggleTopic(topic.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        {expandedTopics.includes(topic.id) ? (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                        <span className="font-medium text-gray-900">{topic.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedSubjectId(subject.id);
                            setSelectedTopicId(topic.id);
                            setSelectedSubtopicId(null);
                            setShowAddResourceModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Upload className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteTopic(subject.id, topic.id);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </button>

                    {/* Topic Resources */}
                    {expandedTopics.includes(topic.id) && (
                      <div className="border-t border-gray-200">
                        <div className="px-6 py-4">
                          {topic.resources && topic.resources.length > 0 ? (
                            <ResourcesTable 
                              resources={resourceTableData.filter(r => r.subtopicId === topic.id)}
                              subtopicId={topic.id}
                              onEdit={handleEditResource}
                              onDelete={handleDeleteResource}
                            />
                          ) : (
                            <p className="text-sm text-gray-500 text-center">
                              No resources added to this topic yet.
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Subtopics */}
                    {expandedTopics.includes(topic.id) && (
                      <div className="border-t divide-y divide-gray-200">
                        {topic.subtopics.map(subtopic => (
                          <div key={subtopic.id} className="bg-gray-50">
                            <button
                              onClick={() => toggleSubtopic(subtopic.id)}
                              className="w-full flex items-center justify-between p-4 hover:bg-gray-100"
                            >
                              <div className="flex items-center space-x-3 ml-6">
                                {expandedSubtopics.includes(subtopic.id) ? (
                                  <ChevronDown className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-gray-400" />
                                )}
                                <span className="text-sm font-medium text-gray-900">{subtopic.name}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSelectedSubjectId(subject.id);
                                    setSelectedTopicId(topic.id);
                                    setSelectedSubtopicId(subtopic.id);
                                    setShowAddResourceModal(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <Upload className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDeleteSubtopic(subject.id, topic.id, subtopic.id);
                                  }}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </button>

                            {/* Resources */}
                            {expandedSubtopics.includes(subtopic.id) && (
                              <div className="px-14 pb-4">
                                {subtopic.resources.length > 0 ? (
                                  <ResourcesTable 
                                    resources={resourceTableData}
                                    subtopicId={subtopic.id}
                                    onEdit={handleEditResource}
                                    onDelete={handleDeleteResource}
                                  />
                                ) : (
                                  <p className="text-sm text-gray-500 text-center">
                                    No resources added yet.
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSubjectId(subject.id);
                    setShowAddTopicModal(true);
                  }}
                  className="w-full text-left p-4 text-sm text-blue-600 hover:text-blue-800 border rounded-lg hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4 inline mr-1" />
                  Add Topic
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleCreateSubject}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900">Add New Subject</h3>
                  <div className="mt-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={newSubject.name}
                        onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                        className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject Description
                      </label>
                      <textarea
                        id="description"
                        value={newSubject.description}
                        onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                        className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Create Subject
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddSubjectModal(false)}
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

      {/* Add Topic Modal */}
      {showAddTopicModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleCreateTopic}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900">Add New Topic</h3>
                  <div className="mt-4 space-y-6">
                    <div>
                      <label htmlFor="topicName" className="block text-sm font-medium text-gray-700 mb-2">
                        Topic Name
                      </label>
                      <input
                        type="text"
                        id="topicName"
                        value={newTopic.name}
                        onChange={(e) => setNewTopic({ name: e.target.value })}
                        className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Add Topic
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddTopicModal(false)}
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

      {/* Add Subtopic Modal */}
      {showAddSubtopicModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleCreateSubtopic}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900">Add New Subtopic</h3>
                  <div className="mt-4">
                    <div>
                      <label htmlFor="subtopicName" className="block text-sm font-medium text-gray-700 mb-1">
                        Subtopic Name
                      </label>
                      <input
                        type="text"
                        id="subtopicName"
                        value={newSubtopic.name}
                        onChange={(e) => setNewSubtopic({ ...newSubtopic, name: e.target.value })}
                        className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Add Subtopic
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddSubtopicModal(false)}
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

      {/* Add Resource Modal */}
{showAddResourceModal && (
  <div className="fixed inset-0 overflow-y-auto z-50">
    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <form onSubmit={handleCreateResource}>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg font-medium text-gray-900">Add Resources</h3>
            <div className="mt-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Article Section */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Topic Name </h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="articleTitle" className="block text-sm font-medium text-gray-700 mb-1">
                        Name 
                      </label>
                      <input
                        type="text"
                        id="articleTitle"
                        value={newResource.articleTitle}
                        onChange={(e) => setNewResource({...newResource, articleTitle: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter Topic Name"
                      />
                    </div>
                    
                  </div>
                </div>



                {/* PDF Section */}
                {/* <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Additional Resources (PDF)</h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="pdfLink" className="block text-sm font-medium text-gray-700 mb-1">
                        Link
                      </label>
                      <input
                        type="url"
                        id="pdfLink"
                        value={newResource.pdfLink}
                        onChange={(e) => setNewResource({...newResource, pdfLink: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="https://"
                      />
                    </div>
                  </div>
                </div> */}

                {/* Exercise Section */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Exercise </h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="exercisePdf" className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Exercise PDF
                      </label>
                      <input
                        type="file"
                        id="exercisePdf"
                        accept=".pdf"
                        onChange={handleExercisePdfUpload}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    {newResource.exercisePdfFile && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">PDF uploaded: {newResource.exerciseTitle}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Solution Section */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Solution</h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="solutionPdf" className="block text-sm font-medium text-gray-700 mb-1">
                        Upload PDF
                      </label>
                      <input
                        type="file"
                        id="solutionPdf"
                        accept=".pdf"
                        onChange={handleSolutionPdfUpload}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    {newResource.solutionPdfFile && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">PDF uploaded: {newResource.solutionTitle}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Video Section */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Video</h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="videoLink" className="block text-sm font-medium text-gray-700 mb-1">
                        Link
                      </label>
                      <input
                        type="url"
                        id="videoLink"
                        value={newResource.videoLink}
                        onChange={(e) => setNewResource({...newResource, videoLink: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="https://"
                      />
                    </div>
                  </div>
                </div>

                {/* Class PPT */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Class PPT</h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="classPpt" className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Class PPT (PDF)
                      </label>
                      <input
                        type="file"
                        id="classPpt"
                        accept=".pdf"
                        onChange={handleClassPptUpload}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    {newResource.classPptFile && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">PDF uploaded: {newResource.classPptTitle}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Article Section */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Resources</h4>
                  <div className="space-y-4">
                    
                    <div>
                      <label htmlFor="articleLink" className="block text-sm font-medium text-gray-700 mb-1">
                        Link
                      </label>
                      <input
                        type="url"
                        id="articleLink"
                        value={newResource.articleLink}
                        onChange={(e) => setNewResource({...newResource, articleLink: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="https://"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Add Resources
            </button>
            <button
              type="button"
              onClick={() => setShowAddResourceModal(false)}
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
    </div>
  );
};

export default SubjectEditor;