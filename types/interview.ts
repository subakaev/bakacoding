export interface InterviewQuestion {
  id: string;
  question: string;
}

export interface InterviewQuestionSet {
  id: string;
  name: string;
  questions: InterviewQuestion[];
}
