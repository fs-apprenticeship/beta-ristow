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
    <section>
      <header>
        <h1>Generate Quiz</h1>

        <p>
          Create a new quiz for <strong>{lessonTitle}</strong>.
        </p>
      </header>

      <form action={action}>
        <div>
          <label htmlFor="title">
            <strong>Quiz title</strong>
          </label>

          <br />

          <input
            id="title"
            name="title"
            placeholder="Optional custom title"
            type="text"
          />
        </div>

        <br />

        <div>
          <label htmlFor="questionCount">
            <strong>Number of questions</strong>
          </label>

          <br />

          <input
            defaultValue={5}
            id="questionCount"
            max={50}
            min={5}
            name="questionCount"
            required
            type="number"
          />

          <p>Choose between 5 and 50 questions.</p>
        </div>

        <div>
          <label htmlFor="instructions">
            <strong>Extra instructions</strong>
          </label>

          <br />

          <textarea
            id="instructions"
            name="instructions"
            placeholder="Optional: make it harder, focus on examples, include tricky questions, etc."
            rows={5}
          />
        </div>

        <br />

        <SubmitButton />
      </form>
    </section>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit">
      {pending ? "Generating..." : "Generate Quiz"}
    </button>
  );
}
