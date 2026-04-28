import getQuizById from "../data/get-quiz-by-id";
import mapQuizToUIQuiz from "../mappers/map-quiz-to-ui-quiz";

export default async function getPersistedQuiz(quizId: string) {
  const persistedQuiz = await getQuizById(quizId);

  if (!persistedQuiz) {
    return null;
  }

  return {
    lessonId: persistedQuiz.lessonId,
    quiz: mapQuizToUIQuiz(persistedQuiz),
  };
}
