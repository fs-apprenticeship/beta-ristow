"use client";

import { useEffect, useState } from "react";

import type { LessonArticleContent } from "@/features/article/get-lesson-article";

import { LessonArticleBody } from "./lesson-article-body";
import { lessonArticleShellStyles } from "./lesson-article.styles";

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
      <style>{lessonArticleShellStyles}</style>

      <main className="container chat-page">
        <section className="chat-header">
          <h1>{headerTitle}</h1>
          <p>{headerSubtitle}</p>
        </section>

        <div className="chat-area">
          {showError ? (
            <p className="lesson-article-error" role="alert">
              {error}
            </p>
          ) : null}

          {showLoading ? <p className="chat-empty">Loading article…</p> : null}

          {showBody ? <LessonArticleBody article={article} /> : null}
        </div>
      </main>
    </>
  );
}
