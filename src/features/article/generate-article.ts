import OpenAI from "openai";
import { z } from "zod";

import generateStructuredOutput from "@/lib/openai/generate-structured-output";
import getClient from "@/lib/prisma/get-client";

const prisma = getClient();
const openai = new OpenAI();

interface Article {
  conclusion: string;
  intro: string;
  sections: { content: string; heading: string }[];
  title: string;
}

const CONTENT_FLAGS_SCHEMA = z.object({
  codeChallenge: z.boolean(),
  quiz: z.boolean(),
});

export type LessonContentVisibility = z.infer<typeof CONTENT_FLAGS_SCHEMA>;

// generate the visibility flags for the lesson
export async function setLessonContentVisibility(lesson: {
  description: string;
  outcomes: string;
  title: string;
}): Promise<LessonContentVisibility> {
  return generateStructuredOutput({
    formatSchema: CONTENT_FLAGS_SCHEMA,
    instructions: `You are a teacher, tasked with creating a curriculum for a new course. Given a lesson title, description, and outcomes,
      decide whether the lesson warrants a quiz and/or a coding challenge.

      quiz = true  → lesson teaches concepts, theory, or facts testable with multiple-choice questions.
      codeChallenge = true → lesson teaches a programming skill that benefits from hands-on coding practice solve problem solving.

      Both can be true (e.g. functions lesson, array in python). Both can be false (e.g. environment setup lesson).
      Return only the JSON object with "quiz" and "codeChallenge" boolean fields.`,
    prompt: `Title: ${lesson.title}
Description: ${lesson.description}
Outcomes: ${lesson.outcomes}`,
  });
}

const ARTICLE_JSON_FORMAT = {
  name: "lesson_article",
  schema: {
    additionalProperties: false,
    properties: {
      conclusion: { type: "string" },
      intro: { type: "string" },
      sections: {
        items: {
          additionalProperties: false,
          properties: {
            content: { type: "string" },
            heading: { type: "string" },
          },
          required: ["content", "heading"],
          type: "object",
        },
        type: "array",
      },
      title: { type: "string" },
    },
    required: ["conclusion", "intro", "sections", "title"],
    type: "object",
  },
  strict: true,
  type: "json_schema",
} as const;

export async function generateLessonArticle(
  lessonId: string,
  courseId: string,
): Promise<Article & { id: string }> {
  return generateAndPersistArticle(lessonId, courseId);
}

export async function getOrGenerateLessonVisibility(
  lessonId: string,
): Promise<LessonContentVisibility> {
  const lesson = await prisma.lesson.findUniqueOrThrow({
    select: {
      codeChallenge: true,
      description: true,
      outcomes: true,
      quiz: true,
      title: true,
    },
    where: { id: lessonId },
  });

  if (lesson.quiz !== null && lesson.codeChallenge !== null) {
    return { codeChallenge: lesson.codeChallenge, quiz: lesson.quiz };
  }

  const visibility = await setLessonContentVisibility({
    description: lesson.description,
    outcomes: lesson.outcomes,
    title: lesson.title,
  });

  await prisma.lesson.update({
    data: { codeChallenge: visibility.codeChallenge, quiz: visibility.quiz },
    where: { id: lessonId },
  });

  return visibility;
}

function buildInstructions(existingArticleCount: number) {
  const depthGuidance =
    existingArticleCount === 0
      ? `This is the first article on this lesson. Write for a learner who is new to the topic.
         Start from the fundamentals, define key terms, and build understanding step by step.
         Use simple examples and avoid assuming prior knowledge beyond the course prerequisites.`
      : existingArticleCount === 1
        ? `A foundational article on this lesson already exists. This is the second article, so go deeper.
           Skip basic definitions — assume the reader understands the fundamentals.
           Focus on nuance, edge cases, less-obvious gotchas, and richer examples.
           Introduce more realistic scenarios and explore the "why" behind the concepts.`
        : `${existingArticleCount} articles on this lesson already exist, covering both basics and intermediate depth.
           This article should be advanced. Target a reader who is comfortable with the topic and wants mastery.
           Cover expert-level insights, real-world trade-offs, performance considerations, or patterns used in production.
           Challenge assumptions, present non-obvious pitfalls, and go beyond what a tutorial would cover.`;

  return `
    You are an instructional writer. The user prompt gives course context (title, description, outcomes)
    and one lesson (title, description). Write a single lesson article that teaches that lesson.

    ${depthGuidance}

    Ground everything in those fields: explain and expand on this lesson, and show how it fits the course
    and supports the course outcomes. Do not invent a different topic or ignore the lesson description.

    Structure: use markdown with ## headings, a short introduction, clearly ordered sections, and a brief
    closing. The piece should read as one coherent narrative, not disconnected bullet dumps.

    Length: aim for roughly 800–1200 words—substantive enough to learn from, not a thin summary.

    Tone: clear, plain language. Use examples where they clarify the lesson.

    The article should have intro, conclusion and a clear structure with headings and subheadings.

    The article should be focused on teaching the lesson, not just describing it.
    It should have actionable insights and practical examples that help the learner understand and apply the material.
    `
    .replace(/\s+/g, " ")
    .trim();
}

async function buildPrompt(
  lesson: { description: string; title: string },
  course: { description: string; outcomes: string; title: string },
) {
  return `
    ## Course context
    Title: ${course.title}
    Description: ${course.description}
    Outcomes: ${course.outcomes}

    ## This lesson
    Title: ${lesson.title}
    Description: ${lesson.description}
`
    .replace(/\s+/g, " ")
    .trim();
}

async function generateAndPersistArticle(
  lessonId: string,
  courseId: string,
): Promise<Article & { id: string }> {
  const [course, lesson, articles] = await Promise.all([
    prisma.course.findUniqueOrThrow({ where: { id: courseId } }),
    prisma.lesson.findUniqueOrThrow({ where: { courseId, id: lessonId } }),
    prisma.lessonArticle.findMany({ where: { lessonId } }),
  ]);

  const response = await openai.responses.create({
    input: [
      { content: buildInstructions(articles.length), role: "developer" },
      { content: await buildPrompt(lesson, course), role: "user" },
    ],
    max_output_tokens: 8192,
    model: "gpt-4o-2024-08-06",
    temperature: 0.7,
    text: { format: ARTICLE_JSON_FORMAT },
  });

  if (
    response.status === "incomplete" &&
    response.incomplete_details?.reason === "max_output_tokens"
  ) {
    throw new Error("Lesson article hit the model output limit.");
  }

  let article: Article;
  try {
    article = JSON.parse(response.output_text) as Article;
  } catch {
    throw new Error(
      "Lesson article response was not valid JSON (often caused by truncation).",
    );
  }
  const content = JSON.parse(JSON.stringify(article));

  const record = await prisma.lessonArticle.create({
    data: { content, lessonId, title: article.title },
  });

  return { ...article, id: record.id };
}
