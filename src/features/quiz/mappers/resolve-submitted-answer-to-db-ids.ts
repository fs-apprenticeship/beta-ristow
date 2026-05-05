import type { PersistedQuiz, UserAnswer } from "../types";

export default function resolveSubmittedAnswerToDbIds(
  persistedQuiz: PersistedQuiz,
  answer: UserAnswer,
) {
  const question = persistedQuiz.questions.find(
    (q) => q.position.toString() === answer.questionId,
  );

  if (!question) {
    throw new Error(
      `Question not found for submitted question id: ${answer.questionId}`,
    );
  }

  const selectedOption = question.options.find(
    (o) => o.position.toString() === answer.selectedOptionId,
  );

  if (!selectedOption) {
    throw new Error(
      `Option not found for submitted option id: ${answer.selectedOptionId}`,
    );
  }

  return {
    questionId: question.id,
    selectedOptionId: selectedOption.id,
  };
}
