export interface Evaluation {
  id: number;
  applicationId: number;
  score: number;
  result: string;
  comments: string;
  strengths: string;
  weaknesses: string;
  reasons?: string;
  evaluationDate: string; // ISO string
}