import { describe, expect, it, vi } from "vitest";

import getPersistedQuiz from "./get-persisted-quiz";

vi.mock("../data/get-quiz-by-id", () => ({
  default: vi.fn(),
}));

vi.mock("../mappers/map-quiz-to-ui-quiz", () => ({
  default: vi.fn(),
}));

import getQuizById from "../data/get-quiz-by-id";
import mapQuizToUIQuiz from "../mappers/map-quiz-to-ui-quiz";

const getQuizByIdMock = vi.mocked(getQuizById);
const mapQuizToUIQuizMock = vi.mocked(mapQuizToUIQuiz);

describe("getPersistedQuiz", () => {
  it("returns null when no persisted quiz is found", async () => {
    getQuizByIdMock.mockResolvedValueOnce(null);

    const result = await getPersistedQuiz("quiz-id");

    expect(result).toBeNull();
    expect(mapQuizToUIQuizMock).not.toHaveBeenCalled();
  });

  it("returns lessonId and mapped quiz when persisted quiz exists", async () => {
    const persistedQuiz = {
      createdAt: new Date(),
      id: "quiz-id",
      lessonId: "lesson-id",
      questions: [],
      title: "Persisted Quiz",
      updatedAt: new Date(),
    };

    const mappedQuiz = {
      id: "quiz-id",
      questions: [],
      title: "Persisted Quiz",
    };

    getQuizByIdMock.mockResolvedValueOnce(persistedQuiz);
    mapQuizToUIQuizMock.mockReturnValueOnce(mappedQuiz);

    const result = await getPersistedQuiz("quiz-id");

    expect(getQuizByIdMock).toHaveBeenCalledWith("quiz-id");
    expect(mapQuizToUIQuizMock).toHaveBeenCalledWith(persistedQuiz);

    expect(result).toEqual({
      lessonId: "lesson-id",
      quiz: mappedQuiz,
    });
  });
});
