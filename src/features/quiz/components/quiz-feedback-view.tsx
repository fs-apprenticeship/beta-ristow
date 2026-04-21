"use client";

import type { PersistedQuizFeedback, Quiz } from "../types";

type QuizFeedbackViewProps = {
  feedback: PersistedQuizFeedback;
  onBackToQuiz: () => void;
  quiz: Quiz;
  quizTitle: string;
};

export default function QuizFeedbackView({
  feedback,
  onBackToQuiz,
  quiz,
  quizTitle,
}: QuizFeedbackViewProps) {
  return (
    <section>
      <h2>Quiz Feedback</h2>

      <p>
        <strong>Quiz:</strong> {quizTitle}
      </p>

      <p>
        <strong>Overall Feedback:</strong> {feedback.overallFeedback}
      </p>

      {typeof feedback.passed === "boolean" && (
        <p>
          <strong>Result:</strong>{" "}
          <span style={{ color: feedback.passed ? "green" : "red" }}>
            {feedback.score}% — {feedback.passed ? "Passed" : "Failed"}
          </span>
        </p>
      )}

      <h3>Question Feedback</h3>

      <ul>
        {feedback.questionFeedback.map((item, index) => {
          const question = quiz.questions.find((q) => q.id === item.questionId);

          return (
            <li
              key={item.questionId}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                listStyleType: "none",
                marginBottom: "1.5rem",
                padding: "1rem",
              }}
            >
              <p>
                <strong>Question {index + 1}:</strong> {question?.prompt}
              </p>

              <p>
                <strong>Your Answer:</strong> {item.chosenAnswer}
              </p>

              <p>
                <strong>Result:</strong>{" "}
                <span style={{ color: item.isCorrect ? "green" : "red" }}>
                  {item.isCorrect ? "Correct" : "Incorrect"}
                </span>
              </p>

              <p>
                <strong>Feedback:</strong> {item.feedback}
              </p>
            </li>
          );
        })}
      </ul>
      <button onClick={onBackToQuiz} type="button">
        Back to Quiz
      </button>
    </section>
  );
}
