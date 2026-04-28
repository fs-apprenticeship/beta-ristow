"use client";

import { useFormStatus } from "react-dom";

type QuizGenerationFormProps = {
  action: (formData: FormData) => Promise<void> | void;
  lessonTitle: string;
};

export default function QuizGenerationForm({
  action,
  lessonTitle,
}: QuizGenerationFormProps) {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Generate Quiz</h1>

        <p className="text-sm text-muted-foreground">
          Create a new quiz for{" "}
          <span className="font-medium">{lessonTitle}</span>.
        </p>
      </header>

      <form action={action} className="space-y-5 rounded-lg border p-5">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="title">
            Quiz title
          </label>

          <input
            className="w-full rounded-md border px-3 py-2 text-sm"
            id="title"
            name="title"
            placeholder="Optional custom title"
            required
            type="text"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="questionNumber">
            Number of questions
          </label>

          <input
            defaultValue={5}
            id="questionCount"
            max={50}
            min={5}
            name="questionCount"
            required
            type="number"
          />

          <p className="text-xs text-muted-foreground">
            Choose between 5 and 50 questions.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="instructions">
            Extra instructions
          </label>

          <textarea
            className="w-full resize-y rounded-md border px-3 py-2 text-sm"
            id="instructions"
            name="instructions"
            placeholder="Optional: make it harder, focus on examples, include tricky questions, etc."
            required
            rows={5}
          />
        </div>

        <SubmitButton />
      </form>
    </section>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? "Generating..." : "Generate Quiz"}
    </button>
  );
}
