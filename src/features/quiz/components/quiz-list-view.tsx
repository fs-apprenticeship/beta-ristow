import Link from "next/link";

import type { QuizListItem } from "../types";

type QuizListViewProps = {
  quizList: QuizListItem[];
};

export default function QuizListView({ quizList }: QuizListViewProps) {
  const hasQuizzes = quizList.length > 0;

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Quizzes</h1>
          <p className="text-sm text-muted-foreground">
            Review existing quizzes or take one for this lesson.
          </p>
        </div>
      </header>

      {!hasQuizzes && (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <h2 className="text-base font-medium">No quizzes yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate a quiz to get started.
          </p>
        </div>
      )}

      {hasQuizzes && (
        <ul className="space-y-3">
          {quizList.map((quiz, index) => (
            <li
              className="flex items-center justify-between gap-4 rounded-lg border p-4"
              key={quiz.id}
            >
              <div className="min-w-0">
                <h2 className="truncate text-base font-medium">
                  Quiz {index + 1}: {quiz.title}
                </h2>

                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <div>
                    <span>Questions {quiz.questionCount}</span>
                  </div>

                  <time dateTime={quiz.createdAt.toISOString()}>
                    Created {quiz.createdAt.toLocaleDateString()}
                  </time>
                </div>
              </div>

              <Link
                className="shrink-0 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
                href={`./quizzes/${quiz.id}`}
              >
                Take Quiz
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
