"use server";

import type { QuizFeedback, QuizSubmission } from "../types";

import saveQuizAttempt from "../data/save-quiz-attempt";
import generateQuizFeedback from "../generate-quiz-feedback";

type SubmitQuizInput = {
  learnerId: string;
  lessonId: string;
  submission: QuizSubmission;
};

export default async function submitQuiz({
  learnerId,
  lessonId,
  submission,
}: SubmitQuizInput): Promise<string> {
  const feedback = await generateQuizFeedback(submission);

  const totalQuestions = submission.quiz.questions.length;
  const score = calculateQuizScore(feedback, totalQuestions);
  const passed = score >= 80;

  const savedAttempt = await saveQuizAttempt({
    feedback,
    learnerId,
    lessonId,
    passed,
    score,
    submission,
    totalQuestions,
  });
  return savedAttempt.id;
}

function calculateQuizScore(
  feedback: QuizFeedback,
  totalQuestions: number,
): number {
  if (totalQuestions === 0) {
    return 0;
  }

  const answeredCorrectly = feedback.questionFeedback.filter(
    (item) => item.isCorrect === true,
  ).length;

  return Math.round((answeredCorrectly / totalQuestions) * 100);
}
