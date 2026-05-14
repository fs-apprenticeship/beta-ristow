"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";

import type { LessonContentVisibility } from "@/features/article/generate-article";
import type { LessonArticleContent } from "@/features/article/get-lesson-article";

import generateDefaultQuizAction from "../quizzes/_actions/generate-default-quiz-action";

export const dynamic = "force-dynamic";

export default function IntroPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = use(params);

  const formatSlug = (slug: string) =>
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const [articles, setArticles] = useState<LessonArticleContent[]>([]);
  const [visibility, setVisibility] = useState<LessonContentVisibility | null>(
    null,
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

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

  async function handleQuizClick() {
    setIsGeneratingQuiz(true);
    try {
      await generateDefaultQuizAction(courseSlug, lessonSlug);
    } finally {
      setIsGeneratingQuiz(false);
    }
  }

  async function handleGenerate() {
    setIsGenerating(true);
    try {
      const res = await fetch(
        `/api/courses/${courseSlug}/lessons/${lessonSlug}/articles`,
        { method: "POST" },
      );
      if (!res.ok) throw new Error("Failed to generate article");
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
          borderBottom: "1px solid var(--pico-muted-border-color)",
          marginBottom: "calc(var(--pico-spacing) * 2)",
          padding: "calc(var(--pico-spacing) * 2) 0",
          textAlign: "center",
        }}
      >
        <p style={{ color: "var(--pico-muted-color)", margin: "0 0 0.25rem" }}>
          <small>{formatSlug(courseSlug)}</small>
        </p>
        <h1 style={{ margin: 0 }}>{formatSlug(lessonSlug)}</h1>
      </header>

      <section style={{ marginBottom: "calc(var(--pico-spacing) * 2)" }}>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "var(--pico-spacing)",
          }}
        >
          <h2 style={{ margin: 0 }}>Articles</h2>
          <button
            aria-busy={isGenerating}
            disabled={isGenerating}
            onClick={handleGenerate}
            style={{ margin: 0, width: "auto" }}
          >
            Generate Article
          </button>
        </div>
        {articles.length === 0 ? (
          <p style={{ color: "var(--pico-muted-color)" }}>No articles yet.</p>
        ) : (
          <ul>
            {articles.map((article) => (
              <li key={article.id}>
                <Link href={`${articleBasePath}/${article.id}`}>
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {(visibility?.quiz || visibility?.codeChallenge) && (
        <section>
          <h2 style={{ marginBottom: "var(--pico-spacing)" }}>Practice</h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--pico-spacing)",
            }}
          >
            {visibility.quiz && (
              <button
                aria-busy={isGeneratingQuiz}
                disabled={isGeneratingQuiz}
                onClick={handleQuizClick}
                style={{ flex: 1, margin: 0, minWidth: "160px" }}
              >
                Quiz
              </button>
            )}
            {visibility.codeChallenge && (
              <Link
                href={`/courses/${courseSlug}/lessons/${lessonSlug}/code-challenges`}
                role="button"
                style={{
                  flex: 1,
                  margin: 0,
                  minWidth: "160px",
                  textAlign: "center",
                }}
              >
                Code Challenges
              </Link>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
