"use server";

import generateQuizFeedback from "../generate-quiz-feedback";
import { QuizFeedback, QuizSubmission } from "../types";

export default async function submitQuiz(
  submission: QuizSubmission,
): Promise<QuizFeedback> {
  return generateQuizFeedback(submission);
}
