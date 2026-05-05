import Link from "next/link";

import type { QuizListItem } from "../types";

type QuizListViewProps = {
  quizList: QuizListItem[];
};

export default function QuizListView({ quizList }: QuizListViewProps) {
  const hasQuizzes = quizList.length > 0;

  return (
    <section>
      <header>
        <h1>Quizzes</h1>
        <p>Review existing quizzes or take one for this lesson.</p>
      </header>

      {!hasQuizzes && (
        <div>
          <h2>No quizzes yet</h2>
          <p>Generate a quiz to get started.</p>
        </div>
      )}

      {hasQuizzes && (
        <ul>
          {quizList.map((quiz, index) => (
            <li
              key={quiz.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                listStyleType: "none",
                marginBottom: "1rem",
                padding: "1rem",
              }}
            >
              <h2>
                Quiz {index + 1}: {quiz.title}
              </h2>

              <p>
                <strong>Questions:</strong> {quiz.questionCount}
              </p>

              <p>
                <strong>Created:</strong>{" "}
                <time dateTime={quiz.createdAt.toISOString()}>
                  {quiz.createdAt.toLocaleDateString()}
                </time>
              </p>

              <Link href={`./quizzes/${quiz.id}`}>Take Quiz</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
