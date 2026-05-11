export type GeneratedReflection = {
  questions: ReflectionQuestion[];
  title: string;
};

export type ReflectionAnswer = {
  answer: string;
  questionId: string;
};

export type ReflectionAnswers = {
  answers: ReflectionAnswer[];
};

export type ReflectionContext = {
  content: string;
  questionCount?: number;
  title: string;
};

export type ReflectionFeedback = {
  overallFeedback: string;
};

export type ReflectionQuestion = {
  id: string;
  prompt: string;
};

export type ReflectionSessionStatus =
  | "answering"
  | "error"
  | "submitted"
  | "submitting";

export type ReflectionSubmission = {
  answers: ReflectionAnswer[];
  context: ReflectionContext;
  reflectionQuestions: GeneratedReflection;
};
