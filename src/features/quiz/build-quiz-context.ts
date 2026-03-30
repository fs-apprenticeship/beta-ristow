import type { QuizContext } from "./types";

type LessonForQuizContext = {
  description: string;
  outcomes: string;
  title: string;
};

export default function buildQuizContext(
  lesson: LessonForQuizContext,
): QuizContext {
  return {
    content: [
      `Lesson Title: ${lesson.title}`,
      `Description: ${lesson.description}`,
      `Outcomes: ${lesson.outcomes}`,
    ].join("\n\n"),
    questionCount: 15,
    title: lesson.title,
  };
}
