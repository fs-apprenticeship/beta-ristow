import Link from "next/link";

import type { QuizAttemptListItem } from "../types";

type QuizAttemptListViewProps = {
  attempts: QuizAttemptListItem[];
};

export default function QuizAttemptListView({
  attempts,
}: QuizAttemptListViewProps) {
  const hasAttempts = attempts.length > 0;

  return (
    <section>
      <header>
        <h1>Quiz Attempts</h1>
        <p>Review your previous quiz results for this lesson.</p>
      </header>

      {!hasAttempts && (
        <div>
          <h2>No attempts yet</h2>
          <p>Take a quiz first to see your saved attempts here.</p>
        </div>
      )}

      {hasAttempts && (
        <ul>
          {attempts.map((attempt) => (
            <li
              key={attempt.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                listStyleType: "none",
                marginBottom: "1rem",
                padding: "1rem",
              }}
            >
              <h2>{attempt.quizTitle}</h2>

              <p>
                <strong>Score:</strong> {attempt.score}%
              </p>

              <p>
                <strong>Questions:</strong> {attempt.totalQuestions}
              </p>

              <p>
                <strong>Result:</strong>{" "}
                <span style={{ color: attempt.passed ? "green" : "red" }}>
                  {attempt.passed ? "Passed" : "Failed"}
                </span>
              </p>

              <p>
                <strong>Created:</strong>{" "}
                <time dateTime={attempt.createdAt.toISOString()}>
                  {attempt.createdAt.toLocaleDateString()}
                </time>
              </p>

              <Link href={`./attempts/${attempt.id}`}>View Attempt</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
