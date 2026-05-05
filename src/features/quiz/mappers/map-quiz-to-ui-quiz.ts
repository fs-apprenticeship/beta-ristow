import type { PersistedQuiz, Quiz } from "../types";

export default function mapQuizToUIQuiz(quiz: PersistedQuiz): Quiz {
  return {
    id: quiz.id,
    questions: quiz.questions.map((question) => ({
      id: question.position.toString(),
      options: question.options.map((option) => ({
        id: option.position.toString(),
        text: option.text,
      })),
      prompt: question.prompt,
    })),
    title: quiz.title,
  };
}
