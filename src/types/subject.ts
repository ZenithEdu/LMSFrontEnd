export interface Subject {
  id: string;
  name: string;
  description: string;
  batches: string[];
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  subtopics: Subtopic[];
}

export interface Subtopic {
  id: string;
  name: string;
  description: string;
  resources: Resource[];
}

export interface Resource {
  id: string;
  uploadedBy: string;
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
  exercisePdfFile?: string; // Base64 encoded PDF data for exercise
}

export interface ResourceTableItem {
  exercisePdfFile?: string;
}