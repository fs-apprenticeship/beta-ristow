"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function GenerateChallengePage() {
  const [title, setTitle] = useState("");
  const [topics, setTopics] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const router = useRouter();
  const params = useParams();

  // Grab the parent slugs from the route
  const courseSlug = params.couseSlug;
  const lessonSlug = params.lessonSlug;

  const handleGenerate = async () => {
    setError(null);

    if (!title.trim() || !topics.trim()) {
      setError("Both title and topics are required.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/code-challenges/generate", {
        body: JSON.stringify({ title, topics }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to generate challenge");
      }

      const data = await res.json();

      if (!data.id) {
        throw new Error("No challenge ID returned from API");
      }

      // Redirect to the newly generated challenge
      router.push(
        `/courses/${courseSlug}/lessons/${lessonSlug}/code-challenges/${data.id}`,
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Generate New Challenge</h1>

      <label className="block mb-2">
        Title
        <input
          className="w-full p-2 border rounded mt-1"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Array Sorting Challenge"
          type="text"
          value={title}
        />
      </label>

      <label className="block mb-2">
        Topics
        <input
          className="w-full p-2 border rounded mt-1"
          onChange={(e) => setTopics(e.target.value)}
          placeholder="arrays, loops"
          type="text"
          value={topics}
        />
      </label>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <button
        className={`w-full py-2 px-4 mt-4 rounded text-white ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={loading}
        onClick={handleGenerate}
      >
        {loading ? "Generating..." : "Generate Challenge"}
      </button>
    </div>
  );
}
