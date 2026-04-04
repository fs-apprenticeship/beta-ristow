export type GeneratedQuiz = {
  questions: QuizQuestion[];
  title: string;
};

export type PersistedQuizAttemptPayload = {
  answers: UserAnswer[];
  feedback: PersistedQuizFeedback;
  quiz: GeneratedQuiz;
};

export type PersistedQuizFeedback = QuizFeedback & {
  score: number;
  totalQuestions: number;
};

export type QuestionFeedback = {
  chosenAnswer: string;
  feedback: string;
  isCorrect?: boolean;
  question: string;
};

export type QuizContext = {
  content: string;
  questionCount?: number;
  title: string;
};

export type QuizFeedback = {
  overallFeedback: string;
  passed?: boolean;
  questionFeedback: QuestionFeedback[];
};

export type QuizOption = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  options: QuizOption[];
  prompt: string;
};

export type QuizSubmission = {
  answers: UserAnswer[];
  context: QuizContext;
  quiz: GeneratedQuiz;
};

export type UserAnswer = {
  questionId: string;
  selectedOptionId: string;
};
