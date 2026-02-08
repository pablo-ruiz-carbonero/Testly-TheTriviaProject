
export const QuestionType = {
  TRUE_FALSE: "TRUE_FALSE",
  SINGLE_CHOICE: "SINGLE_CHOICE",
  MULTIPLE_CHOICE: "MULTIPLE_CHOICE",
} as const;

export type QuestionType = typeof QuestionType[keyof typeof QuestionType];

export interface Question {
  id?: string;
  question: string;
  type: QuestionType;
  options?: string[];
  answer: string[];
  category: string;
  difficulty: number;
}
