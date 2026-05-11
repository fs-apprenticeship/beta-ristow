"use client";

import { ReflectionFeedback } from "../types";

type ReflectionFeedbackViewProps = {
  feedback: ReflectionFeedback;
  lessonTitle: string;
  onBackToHome: () => void;
  onBackToReflection: () => void;
};

export default function ReflectionFeedbackView({
  feedback,
  lessonTitle,
  onBackToHome,
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
      <hr />
      <div style={{ display: "flex", gap: "var(--pico-spacing)" }}>
        <button onClick={onBackToReflection} type="button">
          Back to Reflection Questions
        </button>
        <button onClick={onBackToHome} type="button">
          Back to Home
        </button>
      </div>
    </section>
  );
}
