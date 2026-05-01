"use client";

import { use, useEffect, useState } from "react";

import type { LessonArticleContent } from "@/features/article/get-lesson-article";

export const dynamic = "force-dynamic";

type Visibility = { codeChallenge: boolean; quiz: boolean };

export default function IntroPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = use(params);

  const [articles, setArticles] = useState<LessonArticleContent[]>([]);
  const [visibility, setVisibility] = useState<null | Visibility>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const articleBasePath = `/courses/${courseSlug}/lessons/${lessonSlug}/article`;

  useEffect(() => {
    fetch(`/api/courses/${courseSlug}/lessons/${lessonSlug}/articles`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then(setArticles);

    fetch(`/api/courses/${courseSlug}/lessons/${lessonSlug}/visibility`)
      .then((res) => res.json())
      .then(setVisibility);
  }, [courseSlug, lessonSlug]);

  async function handleGenerate() {
    setIsGenerating(true);
    try {
      const res = await fetch(
        `/api/courses/${courseSlug}/lessons/${lessonSlug}/article`,
      );
      const article = (await res.json()) as LessonArticleContent;
      setArticles((prev) => [...prev, article]);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main className="container">
      <header
        style={{
          padding: "var(--pico-spacing) 0 calc(var(--pico-spacing) * 3)",
          textAlign: "center",
        }}
      >
        <h1>{lessonSlug}</h1>
        <p>
          <small>{courseSlug}</small>
        </p>
      </header>

      <h2>Articles</h2>
      {articles.length === 0 ? (
        <div style={{ marginBottom: "var(--pico-spacing)" }}>
          <p style={{ color: "var(--pico-muted-color)" }}>No articles yet.</p>
        </div>
      ) : (
        <ul>
          {articles.map((article) => (
            <li key={article.id}>
              <a href={`${articleBasePath}/${article.id}`}>{article.title}</a>
            </li>
          ))}
        </ul>
      )}

      <h3>Options</h3>
      <button
        aria-busy={isGenerating}
        disabled={isGenerating}
        onClick={handleGenerate}
      >
        Generate Article
      </button>
      {visibility && (
        <>
          <p>quiz: {String(visibility.quiz)}</p>
          <p>code-challenges: {String(visibility.codeChallenge)}</p>
        </>
      )}
    </main>
  );
}
