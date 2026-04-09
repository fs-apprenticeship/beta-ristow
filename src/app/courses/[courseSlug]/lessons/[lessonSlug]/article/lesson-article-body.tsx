"use client";

import type { ReactNode } from "react";

import ReactMarkdown from "react-markdown";

import type { LessonArticleContent } from "@/features/article/get-lesson-article";

import ArticleCodeBlock from "./article-codeblock";

const markdownComponents = {
  code: ArticleCodeBlock,
  pre({ children }: { children?: ReactNode }) {
    return <>{children}</>;
  },
};

export function LessonArticleBody({
  article,
}: {
  article: LessonArticleContent;
}) {
  const hasIntro = article.intro.trim().length > 0;
  const hasConclusion = article.conclusion.trim().length > 0;

  return (
    <article className="lesson-article-panel">
      {hasIntro ? (
        <div className="lesson-article-markdown">
          <ReactMarkdown components={markdownComponents}>
            {article.intro}
          </ReactMarkdown>
        </div>
      ) : null}
      {article.sections.map((section, index) => (
        <section
          className="lesson-article-section"
          key={`${section.heading}-${index}`}
        >
          {section.heading.trim() ? (
            <h3 className="lesson-article-section-title">{section.heading}</h3>
          ) : null}
          {section.content.trim() ? (
            <div className="lesson-article-markdown">
              <ReactMarkdown components={markdownComponents}>
                {section.content}
              </ReactMarkdown>
            </div>
          ) : null}
        </section>
      ))}
      {hasConclusion ? (
        <div className="lesson-article-markdown">
          <ReactMarkdown components={markdownComponents}>
            {article.conclusion}
          </ReactMarkdown>
        </div>
      ) : null}
    </article>
  );
}
