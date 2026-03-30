"use client";

import { useEffect, useState } from "react";

import type { LessonArticleContent } from "@/features/article/get-lesson-article";

export default function LessonArticle({
  courseSlug,
  initialArticle,
  lessonSlug,
}: {
  courseSlug: string;
  initialArticle: LessonArticleContent | null;
  lessonSlug: string;
}) {
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

  if (error) {
    return (
      <p className="lesson-article-error" role="alert">
        {error}
      </p>
    );
  }

  if (!article) {
    return <p className="lesson-article-loading">Loading article…</p>;
  }

  return (
    <article className="lesson-article max-w-3xl">
      <div className="whitespace-pre-wrap">{article.intro}</div>
      {article.sections.map((section, index) => (
        <section key={`${section.heading}-${index}`}>
          <h3>{section.heading}</h3>
          <div className="whitespace-pre-wrap">{section.content}</div>
        </section>
      ))}
      <div className="whitespace-pre-wrap">{article.conclusion}</div>
    </article>
  );
}
