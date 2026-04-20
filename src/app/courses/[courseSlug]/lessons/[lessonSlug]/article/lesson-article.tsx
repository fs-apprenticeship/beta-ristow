"use client";

import { useEffect, useState } from "react";

import type { LessonArticleContent } from "@/features/article/get-lesson-article";

import { LessonArticleBody } from "./lesson-article-body";

type LessonArticleProps = {
  courseSlug: string;
  headerSubtitle: string;
  headerTitle: string;
  initialArticle: LessonArticleContent | null;
  lessonSlug: string;
};

export default function LessonArticle({
  courseSlug,
  headerSubtitle,
  headerTitle,
  initialArticle,
  lessonSlug,
}: LessonArticleProps) {
  const [article, setArticle] = useState<LessonArticleContent | null>(
    initialArticle,
  );
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    setArticle(initialArticle);
  }, [initialArticle]);

  useEffect(() => {
    if (initialArticle !== null) return;

    let cancelled = false;

    async function load() {
      try {
        const base = `/api/courses/${encodeURIComponent(courseSlug)}/lessons/${encodeURIComponent(lessonSlug)}`;
        const response = await fetch(`${base}/article`);
        if (!response.ok) throw new Error("Failed to load article");

        const data = (await response.json()) as LessonArticleContent;
        if (!cancelled) setArticle(data);
      } catch (cause) {
        if (!cancelled) {
          setError(
            cause instanceof Error ? cause.message : "Something went wrong",
          );
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [initialArticle, courseSlug, lessonSlug]);

  const showLoading = !error && article === null;
  const showBody = !error && article !== null;
  const showError = error !== null;

  return (
    <>
      <main className="container">
        {/* Header */}
        <header
          style={{
            padding: "var(--pico-spacing) 0 calc(var(--pico-spacing) * 3)",
            textAlign: "center",
          }}
        >
          <h1>{headerTitle}</h1>
          <p>
            <small>{headerSubtitle}</small>
          </p>
        </header>

        {/* Full-page scroll: no inner overflow (unlike chat’s .chat-area) */}
        <div style={{ marginBottom: "calc(var(--pico-spacing) * 4)" }}>
          {showError ? (
            <p
              role="alert"
              style={{
                opacity: 0.85,
                padding: "calc(var(--pico-spacing) * 6) 0",
                textAlign: "center",
              }}
            >
              <small>{error}</small>
            </p>
          ) : null}

          {showLoading ? (
            <p
              style={{
                opacity: 0.6,
                padding: "calc(var(--pico-spacing) * 6) 0",
                textAlign: "center",
              }}
            >
              <small>Loading article…</small>
            </p>
          ) : null}

          {showBody ? <LessonArticleBody article={article} /> : null}
        </div>
      </main>
    </>
  );
}
