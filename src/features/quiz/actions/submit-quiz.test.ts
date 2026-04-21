import { afterEach, describe, expect, it, vi } from "vitest";

import type { QuizFeedback, QuizSubmission } from "../types";

import submitQuiz from "./submit-quiz";

vi.mock("server-only", () => ({}));

const { generateQuizFeedbackMock, saveQuizAttemptkMock } = vi.hoisted(() => ({
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

  it("generates feedback, calculates score, persists, and returns enriched result", async () => {
    generateQuizFeedbackMock.mockResolvedValue(feedback);

    const result = await submitQuiz({
      learnerId: "learner-1",
      lessonId: "lesson-1",
      submission,
    });

    // called correctly
    expect(generateQuizFeedbackMock).toHaveBeenCalledWith(submission);

    // score = 2/2 = 100
    expect(result.score).toBe(100);
    expect(result.totalQuestions).toBe(2);

    // persistence called with correct data
    expect(saveQuizAttemptMock).toHaveBeenCalledWith({
      feedback,
      learnerId: "learner-1",
      lessonId: "lesson-1",
      score: 100,
      submission,
      totalQuestions: 2,
    });

    // returns enriched feedback
    expect(result).toEqual({
      ...feedback,
      score: 100,
      totalQuestions: 2,
    });
  });

  it("calculates partial score correctly", async () => {
    generateQuizFeedbackMock.mockResolvedValue({
      ...feedback,
      questionFeedback: [
        { ...feedback.questionFeedback[0], isCorrect: true },
        { ...feedback.questionFeedback[1], isCorrect: false },
      ],
    });

    const result = await submitQuiz({
      learnerId: "learner-1",
      lessonId: "lesson-1",
      submission,
    });

    // 1/2 = 50
    expect(result.score).toBe(50);
    expect(result.totalQuestions).toBe(2);
  });
});
