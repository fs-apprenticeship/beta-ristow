export type GeneratedReflection = {
  questions: ReflectionQuestion[];
  title: string;
};

export type ReflectionAnswer = {
  answer: string;
  questionId: string;
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

export type ReflectionSubmission = {
  answers: ReflectionAnswer[];
  context: ReflectionContext;
  reflection: GeneratedReflection;
};
