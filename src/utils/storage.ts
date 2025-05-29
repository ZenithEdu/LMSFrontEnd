import { Subject } from '../types/subject';
export const EMPLOYEES_STORAGE_KEY = 'employeeManagementList';
export const MANAGERS_STORAGE_KEY = 'managersList';
export const SUBJECTS_STORAGE_KEY = 'subjectEditorData';
export const BATCHES_STORAGE_KEY = 'batchManagementList';
export const STORAGE_KEY = 'batchDataStorage'; // Add this constant for batch data storage

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager';
  gender: 'male' | 'female' | 'other';
  dateAdded: string;
}

export interface Batch {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  manager: string;
}

export interface BatchData {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  managers: string[];
}

export const loadEmployeesFromStorage = (): Employee[] => {
  const stored = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveEmployeesToStorage = (employees: Employee[]) => {
  localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));
};

export const getManagersList = (): Employee[] => {
  const employees = loadEmployeesFromStorage();
  return employees.filter(emp => emp.role === 'manager');
};

export const loadSubjectsFromStorage = (): Subject[] => {
  try {
    const stored = localStorage.getItem(SUBJECTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading subjects from storage:', error);
    return [];
  }
};

export const saveSubjectsToStorage = (subjects: Subject[]) => {
  localStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(subjects));
};

export const loadBatchesFromStorage = (): Batch[] => {
  try {
    const stored = localStorage.getItem(BATCHES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading batches from storage:', error);
    return [];
  }
};

export const saveBatchesToStorage = (batches: Batch[]) => {
  localStorage.setItem(BATCHES_STORAGE_KEY, JSON.stringify(batches));
};

export const saveBatch = (batch: BatchData) => {
  const batches = getBatches();
  batches.push({
    ...batch,
    managers: Array.isArray(batch.managers) ? batch.managers : [batch.manager],
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(batches));
};

export const getBatches = (): BatchData[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const batches = stored ? JSON.parse(stored) : [];
  return batches.map((batch: BatchData) => ({
    ...batch,
    managers: Array.isArray(batch.managers) ? batch.managers : [batch.manager],
  }));
};

export const getSubjectsList = (): string[] => {
  const subjects = loadSubjectsFromStorage();
  return subjects.map(subject => subject.name);
};

export const saveResourceTableToStorage = (resources: ResourceTableItem[]) => {
  localStorage.setItem('resourceTableData', JSON.stringify(resources));
};

export const loadResourceTableFromStorage = (): ResourceTableItem[] => {
  const storedData = localStorage.getItem('resourceTableData');
  return storedData ? JSON.parse(storedData) : [];
};

