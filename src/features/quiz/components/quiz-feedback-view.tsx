"use client";

import { GeneratedQuiz, QuizFeedback, UserAnswer } from "../types";

type QuizFeedbackViewProps = {
  answers: UserAnswer[];
  feedback: QuizFeedback;
  onBackToQuiz: () => void;
  quiz: GeneratedQuiz;
};

export default function QuizFeedbackView({
  answers,
  feedback,
  onBackToQuiz,
  quiz,
}: QuizFeedbackViewProps) {
  return (
    <section>
      <h2>Quiz Feedback</h2>

      <p>
        <strong>Quiz:</strong> {quiz.title}
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
        {feedback.questionFeedback.map((item) => {
          const userAnswer = answers.find(
            (answer) => answer.questionId === item.questionId,
          );

          return (
            <li key={item.questionId}>
              <p>
                <strong>Question ID:</strong> {item.questionId}
              </p>
              <p>
                <strong>Selected Option:</strong>{" "}
                {userAnswer?.selectedOptionId ?? "N/A"}
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
          );
        })}
      </ul>

      <button onClick={onBackToQuiz} type="button">
        Back to Quiz
      </button>
    </section>
  );
}
