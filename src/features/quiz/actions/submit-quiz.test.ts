import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import type { QuizFeedback, QuizSubmission } from "../types";

import submitQuiz from "./submit-quiz";

const { generateQuizFeedbackMock, saveQuizAttemptMock } = vi.hoisted(() => ({
  generateQuizFeedbackMock: vi.fn(),
  saveQuizAttemptMock: vi.fn(),
}));

vi.mock("../generate-quiz-feedback", () => ({
  default: generateQuizFeedbackMock,
}));

vi.mock("../data/save-quiz-attempt", () => ({
  default: saveQuizAttemptMock,
}));

describe("submitQuiz", () => {
  const submission: QuizSubmission = {
    answers: [
      { questionId: "q1", selectedOptionId: "a" },
      { questionId: "q2", selectedOptionId: "b" },
    ],
    context: {
      content: "Lesson content",
      questionCount: 2,
      title: "Test Lesson",
    },
    quiz: {
      id: "quiz-1",
      questions: [
        {
          id: "q1",
          options: [
            { id: "a", text: "Correct" },
            { id: "b", text: "Wrong" },
          ],
          prompt: "Q1",
        },
        {
          id: "q2",
          options: [
            { id: "a", text: "Wrong" },
            { id: "b", text: "Correct" },
          ],
          prompt: "Q2",
        },
      ],
      title: "Quiz",
    },
  };

  const feedback: QuizFeedback = {
    overallFeedback: "Nice work",
    passed: true,
    questionFeedback: [
      {
        chosenAnswer: "Correct",
        feedback: "Good",
        isCorrect: true,
        questionId: "q1",
      },
      {
        chosenAnswer: "Correct",
        feedback: "Good",
        isCorrect: true,
        questionId: "q2",
      },
    ],
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("generates feedback, calculates score, persists the attempt, and returns the attempt id", async () => {
    generateQuizFeedbackMock.mockResolvedValue(feedback);
    saveQuizAttemptMock.mockResolvedValue({ id: "attempt-1" });

    const result = await submitQuiz({
      learnerId: "learner-1",
      lessonId: "lesson-1",
      submission,
    });

    expect(generateQuizFeedbackMock).toHaveBeenCalledWith(submission);

    expect(saveQuizAttemptMock).toHaveBeenCalledWith({
      feedback,
      learnerId: "learner-1",
      lessonId: "lesson-1",
      score: 100,
      submission,
      totalQuestions: 2,
    });

    expect(result).toBe("attempt-1");
  });

  it("calculates partial score correctly before saving the attempt", async () => {
    const partialFeedback: QuizFeedback = {
      ...feedback,
      questionFeedback: [
        { ...feedback.questionFeedback[0], isCorrect: true },
        { ...feedback.questionFeedback[1], isCorrect: false },
      ],
    };

    generateQuizFeedbackMock.mockResolvedValue(partialFeedback);
    saveQuizAttemptMock.mockResolvedValue({ id: "attempt-2" });

    const result = await submitQuiz({
      learnerId: "learner-1",
      lessonId: "lesson-1",
      submission,
    });

    expect(saveQuizAttemptMock).toHaveBeenCalledWith({
      feedback: partialFeedback,
      learnerId: "learner-1",
      lessonId: "lesson-1",
      score: 50,
      submission,
      totalQuestions: 2,
    });

    expect(result).toBe("attempt-2");
  });
});
