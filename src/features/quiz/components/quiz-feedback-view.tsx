"use client";

import { QuizFeedback } from "../types";

type QuizFeedbackViewProps = {
  feedback: QuizFeedback;
  onBackToQuiz: () => void;
  quizTitle: string;
};

export default function QuizFeedbackView({
  feedback,
  onBackToQuiz,
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
          <strong>Result:</strong> {feedback.passed ? "Passed" : "Not Passed"}
        </p>
      )}

      <h3>Question Feedback</h3>

      <ul>
        {feedback.questionFeedback.map((item, index) => (
          <li key={`${item.question}-${index}`}>
            <p>
              <strong>Question:</strong> {item.question}
            </p>
            <p>
              <strong>Chosen Answer:</strong> {item.chosenAnswer}
            </p>
            {typeof item.isCorrect === "boolean" && (
              <p>
                <strong>Correct:</strong> {item.isCorrect ? "Yes" : "No"}
              </p>
            )}
            <p>
              <strong>Feedback:</strong> {item.feedback}
            </p>
          </li>
        ))}
      </ul>

      <button onClick={onBackToQuiz} type="button">
        Back to Quiz
      </button>
    </section>
  );
}
