import { afterEach, describe, expect, it, vi } from "vitest";

import type { QuizSubmission } from "./types";

import generateQuizFeedback from "./generate-quiz-feedback";

const { generateTextMock, parseJsonResponseMock } = vi.hoisted(() => ({
  generateTextMock: vi.fn(),
  parseJsonResponseMock: vi.fn(),
}));

vi.mock("@/lib/openai/generate-text", () => ({
  default: generateTextMock,
}));

vi.mock("@/lib/openai/parse-json-response", () => ({
  default: parseJsonResponseMock,
}));

describe("generateQuizFeedback", () => {
  const submission: QuizSubmission = {
    answers: [
      { questionId: "q1", selectedOptionId: "a" },
      { questionId: "q2", selectedOptionId: "b" },
    ],
    context: {
      content: "This lesson covers variables, data types, and assignments.",
      questionCount: 2,
      title: "Java Basics",
    },
    quiz: {
      id: "quiz-1",
      questions: [
        {
          id: "q1",
          options: [
            { id: "a", text: "A stored value" },
            { id: "b", text: "A loop" },
          ],
          prompt: "What is a variable?",
        },
      ],
      title: "Java Basics Quiz",
    },
  };

  afterEach(() => {
    generateTextMock.mockReset();
    parseJsonResponseMock.mockReset();
  });

  it("calls the text generator and parser, then returns valid quiz feedback", async () => {
    const rawModelText = "some raw feedback response";

    const parsedFeedback = {
      overallFeedback: "Great job. You understood the main concepts well.",
      passed: true,
      questionFeedback: [
        {
          chosenAnswer: "A storage location for data",
          feedback: "Correct.",
          isCorrect: true,
          question: "What is a variable?",
        },
      ],
    };

    generateTextMock.mockResolvedValue(rawModelText);
    parseJsonResponseMock.mockReturnValue(parsedFeedback);

    const result = await generateQuizFeedback(submission);

    expect(generateTextMock).toHaveBeenCalledOnce();
    expect(parseJsonResponseMock).toHaveBeenCalledWith(rawModelText);

    expect(result.overallFeedback).toBe(
      "Great job. You understood the main concepts well.",
    );
    expect(result.passed).toBe(true);
    expect(result.questionFeedback[0]?.questionId).toBe("What is a variable?");
    expect(result.questionFeedback[0]?.chosenAnswer).toBe(
      "A storage location for data",
    );
  });

  it("throws when the parsed feedback shape is invalid", async () => {
    generateTextMock.mockResolvedValue("raw feedback text");
    parseJsonResponseMock.mockReturnValue({
      overallFeedback: "Needs improvement.",
      passed: false,
      questionFeedback: [
        {
          // missing feedback field
          isCorrect: false,
          questionId: "q1",
        },
      ],
    });

    await expect(generateQuizFeedback(submission)).rejects.toThrow(
      "Quiz feedback generator returned an invalid shape.",
    );
  });
});
