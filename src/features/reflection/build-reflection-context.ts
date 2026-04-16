import type { ReflectionContext } from "./types";

type LessonForReflectionContext = {
  description: string;
  outcomes: string;
  title: string;
};

export default function buildReflectionContext(
  lesson: LessonForReflectionContext,
): ReflectionContext {
  return {
    content: [
      `Lesson Title: ${lesson.title}`,
      `Description: ${lesson.description}`,
      `Outcomes: ${lesson.outcomes}`,
    ].join("\n\n"),
    questionCount: 5,
    title: lesson.title,
  };
}
