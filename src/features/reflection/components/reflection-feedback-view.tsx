"use client";

import { ReflectionFeedback } from "../types";

type ReflectionFeedbackViewProps = {
  feedback: ReflectionFeedback;
  lessonTitle: string;
  onBackToReflection: () => void;
};

export default function ReflectionFeedbackView({
  feedback,
  lessonTitle,
  onBackToReflection,
}: ReflectionFeedbackViewProps) {
  return (
    <section>
      <h2>Reflection Feedback</h2>

      <p>
        <strong>Reflection:</strong> {lessonTitle}
      </p>

      <p>
        <strong>Feedback:</strong> {feedback.overallFeedback}
      </p>

      <button onClick={onBackToReflection} type="button">
        Back to Reflection Questions
      </button>
    </section>
  );
}
