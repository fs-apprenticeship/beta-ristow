import Link from "next/link";

import type { QuizAttemptDetail } from "../types";

type QuizAttemptDetailViewProps = {
  attempt: QuizAttemptDetail;
};

export default function QuizAttemptDetailView({
  attempt,
}: QuizAttemptDetailViewProps) {
  return (
    <section>
      <header>
        <Link href="./">Back to attempts</Link>

        <h1>Attempt Review</h1>

        <p>{attempt.quizTitle}</p>
      </header>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          marginTop: "1rem",
          padding: "1rem",
        }}
      >
        <p>
          <strong>Score:</strong> {attempt.score}%
        </p>

        <p>
          <strong>Questions Count:</strong> {attempt.totalQuestions}
        </p>

        <p>
          <strong>Result:</strong>{" "}
          <span style={{ color: attempt.passed ? "green" : "red" }}>
            {attempt.passed ? "Passed" : "Failed"}
          </span>
        </p>

        <p>
          <strong>Overall Feedback:</strong> {attempt.overallFeedback}
        </p>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <h2>Question Feedback</h2>

        <ul>
          {attempt.answers.map((answer, index) => (
            <li
              key={answer.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                listStyleType: "none",
                marginBottom: "1rem",
                padding: "1rem",
              }}
            >
              <p>
                <strong>Question {index + 1}:</strong> {answer.questionPrompt}
              </p>

              <p>
                <strong>Your Answer:</strong> {answer.selectedOptionText}
              </p>

              <p>
                <strong>Result:</strong>{" "}
                <span
                  style={{
                    color: answer.isCorrect ? "green" : "red",
                  }}
                >
                  {answer.isCorrect ? "Correct" : "Incorrect"}
                </span>
              </p>

              {answer.feedback && (
                <p>
                  <strong>Feedback:</strong> {answer.feedback}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
