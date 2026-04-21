import type { Quiz } from "../types";

import getQuizzes from "../data/get-quizzes";

type PersistedQuiz = NonNullable<
  Awaited<ReturnType<typeof getQuizzes>>
>[number];

export default function mapQuizToUIQuiz(quiz: PersistedQuiz): Quiz {
  return {
    id: quiz.id,
    questions: quiz.questions.map((question) => ({
      id: question.id,
      options: question.options.map((option) => ({
        id: option.id,
        text: option.text,
      })),
      prompt: question.prompt,
    })),
    title: quiz.title,
  };
}
