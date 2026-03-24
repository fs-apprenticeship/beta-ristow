"use client";

import { python } from "@codemirror/lang-python";
import CodeMirror from "@uiw/react-codemirror";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Challenge {
  id: string;
  language: string;
  prompt: string;
  starterCode?: string;
}

interface Evaluation {
  correct: boolean;
  feedback: string;
}

export default function ChallengePage() {
  const params = useParams();
  const id = params.id as string;

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(false);

  const [userCode, setUserCode] = useState("");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchChallenge() {
      if (!id) return;

      setLoading(true);
      try {
        const res = await fetch(`/api/code-challenges/${id}`);
        if (!res.ok) throw new Error("Failed to fetch challenge");
        const data: Challenge = await res.json();
        setChallenge(data);
        setUserCode(data.starterCode || "");
      } catch (err) {
        console.error(err);
        setChallenge(null);
      } finally {
        setLoading(false);
      }
    }
    fetchChallenge();
  }, [id]);

  const handleRun = async () => {
    if (!challenge) return;

    setRunning(true);
    setEvaluation(null);
    try {
      const res = await fetch(`/api/code-challenges/${challenge.id}/evaluate`, {
        body: JSON.stringify({ userCode }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!res.ok) throw new Error("Evaluation failed");
      const data: Evaluation = await res.json();
      setEvaluation(data);
    } catch (err) {
      console.error(err);
      setEvaluation({ correct: false, feedback: "Evaluation failed" });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!challenge) return;

    setSubmitting(true);
    setEvaluation(null);

    try {
      const res = await fetch(`/api/code-challenges/${challenge.id}/submit`, {
        body: JSON.stringify({ userCode }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!res.ok) throw new Error("Submission failed");

      const data = await res.json();

      setEvaluation({
        correct: data.submission?.correct ?? false,
        feedback:
          data.submission?.feedback ??
          data.msg ??
          "Submission saved (no evaluation yet)",
      });
    } catch (err) {
      console.error(err);
      setEvaluation({ correct: false, feedback: "Submission failed" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !challenge) return <div>Loading...</div>;
  if (!challenge) return <div>Challenge not found</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-semibold mb-4">Code Challenge</h1>
        {/* Prompt */}
        <div className="bg-gray-50 border border-gray-300 rounded-md p-4 text-gray-800 leading-relaxed whitespace-pre-wrap break-words w-full max-w-xl mx-auto">
          {challenge.prompt}
        </div>
      </div>
      {submitting && (
        <div className="mt-4 flex justify-center">
          <div className="w-6 h-6 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* User Solution */}
      <div className="mt-16 max-w-xl mx-auto">
        <h2 className="font-medium mb-4 text-lg">Your Solution</h2>
        <div className="border border-gray-300 rounded-md">
          <CodeMirror
            extensions={[python()]}
            height="300px"
            onChange={(value) => setUserCode(value)}
            value={userCode}
          />
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        {/* Run Button */}
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          disabled={running || submitting}
          onClick={handleRun}
        >
          {running ? "Running..." : "Run"}
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          disabled={running || submitting}
          onClick={handleSubmit}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
      {/* Evaluation Feedbac */}
      {evaluation && (
        <div className="mt-4 p-4 border rounded-md bg-gray-100">
          <p>
            <strong>Result:</strong>{" "}
            {evaluation.correct ? "✅ Correct" : "❌ Incorrect"}
          </p>
          <p>
            <strong>Feedback:</strong> {evaluation.feedback}
          </p>
        </div>
      )}
    </div>
  );
}
