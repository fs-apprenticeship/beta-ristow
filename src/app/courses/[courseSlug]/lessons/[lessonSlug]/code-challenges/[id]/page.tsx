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

export default function ChallengePage() {
  const params = useParams();
  const id = params.id as string;

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchChallenge() {
      if (!id) return;

      setLoading(true);
      try {
        const res = await fetch(`/api/code-challenges/${id}`);
        if (!res.ok) throw new Error("Failed to fetch challenge");
        const data: Challenge = await res.json();
        setChallenge(data);
      } catch (err) {
        console.error(err);
        setChallenge(null);
      } finally {
        setLoading(false);
      }
    }
    fetchChallenge();
  }, [id]);

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

      {/* User Solution */}
      <div className="mt-16 max-w-xl mx-auto">
        <h2 className="font-medium mb-4 text-lg">Your Solution</h2>
        <div className="border border-gray-300 rounded-md">
          <CodeMirror
            extensions={[python()]}
            height="300px"
            value={challenge.starterCode || ""}
          />
        </div>
      </div>
    </div>
  );
}
