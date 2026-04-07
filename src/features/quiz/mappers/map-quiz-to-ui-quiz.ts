import getQuizzes from "../data/get-quizzes";
import { GeneratedQuiz } from "../types";

type PersistedQuiz = NonNullable<
  Awaited<ReturnType<typeof getQuizzes>>
>[number];

export default function mapQuizToUIQuiz(quiz: PersistedQuiz): GeneratedQuiz {
  return {
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
