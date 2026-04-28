export type GeneratedQuiz = {
  questions: QuizQuestion[];
  title: string;
};

export type PersistedQuiz = {
  createdAt: Date;
  id: string;
  lessonId: string;
  questions: {
    createdAt: Date;
    id: string;
    options: {
      createdAt: Date;
      id: string;
      position: number;
      questionId: string;
      text: string;
      updatedAt: Date;
    }[];
    position: number;
    prompt: string;
    quizId: string;
    updatedAt: Date;
  }[];
  title: string;
  updatedAt: Date;
};

export type PersistedQuizFeedback = QuizFeedback & {
  score: number;
  totalQuestions: number;
};

export type QuestionFeedback = {
  chosenAnswer: string;
  feedback: string;
  isCorrect?: boolean;
  questionId: string;
};

export type Quiz = {
  id: string;
  questions: QuizQuestion[];
  title: string;
};

export type QuizContext = {
  content: string;
  extraInstructions?: string;
  questionCount?: number;
  quizTitle?: string;
  title: string;
};

export type QuizFeedback = {
  overallFeedback: string;
  passed?: boolean;
  questionFeedback: QuestionFeedback[];
};

export type QuizListItem = {
  createdAt: Date;
  id: string;
  questionCount: number;
  title: string;
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
  quiz: Quiz;
};
export type UserAnswer = {
  questionId: string;
  selectedOptionId: string;
};
