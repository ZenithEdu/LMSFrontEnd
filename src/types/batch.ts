export interface Batch {
  id: string;
  name: string;
  collegeName: string;
  startDate: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  batchId: string;
  college: string;
  branch: string;
}

export interface Manager {
  id: string;
  name: string;
  email: string;
  phone: string;
  batches: string[];
}