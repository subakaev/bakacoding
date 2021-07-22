export interface InterviewQuestion {
  id: string;
  question: string;
}

export interface InterviewQuestionSet {
  id: string;
  name: string;
  questions: InterviewQuestion[];
}

export type Grade = "solved" | "average" | "failed";

export interface Answer {
  grade: Grade | null;
  comment: string;
}
