import OpenAI from "openai";

import generateStructuredOutput from "@/lib/openai/generate-structured-output";
import getClient from "@/lib/prisma/get-client";

const prisma = getClient();
const openai = new OpenAI();

interface Article {
  conclusion: string;
  intro: string;
  sections: { content: string; heading: string }[];
}

// the visibility flags for lesson
interface LessonContentVisibility {
  codeChallenge: boolean;
  quiz: boolean;
}

//  the output schema for the visibility flags
const CONTENT_FLAGS_SCHEMA = {
  additionalProperties: false,
  properties: {
    codeChallenge: { type: "boolean" },
    quiz: { type: "boolean" },
  },
  required: ["quiz", "codeChallenge"],
  type: "object",
} as const;

// generate the visibility flags for the lesson
export async function setLessonContentVisibility(lesson: {
  description: string;
  outcomes: string;
  title: string;
}): Promise<LessonContentVisibility> {
  return generateStructuredOutput<LessonContentVisibility>({
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
    },
    required: ["conclusion", "intro", "sections"],
    type: "object",
  },
  strict: true,
  type: "json_schema",
} as const;

export async function getOrGenerateLessonArticle(
  lessonId: string,
  courseId: string,
): Promise<Article> {
  const existing = await prisma.lessonArticle.findUnique({
    where: { lessonId },
  });
  if (existing) return existing.content as unknown as Article;

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

function buildInstructions() {
  return `
    You are an instructional writer. The user prompt gives course context (title, description, outcomes)
    and one lesson (title, description). Write a single lesson article that teaches that lesson.

    Ground everything in those fields: explain and expand on this lesson, and show how it fits the course
    and supports the course outcomes. Do not invent a different topic or ignore the lesson description.

    Structure: use markdown with ## headings, a short introduction, clearly ordered sections, and a brief
    closing. The piece should read as one coherent narrative, not disconnected bullet dumps.

    Length: aim for roughly 800–1200 words—substantive enough to learn from, not a thin summary.

    Tone: clear, plain language. Use examples where they clarify the lesson.
    
    the article should have intro, conclusion and a clear structure with headings and subheadings.

    the article should be focused on teaching the lesson, not just describing it. 
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
): Promise<Article> {
  const [course, lesson] = await Promise.all([
    prisma.course.findUniqueOrThrow({ where: { id: courseId } }),
    prisma.lesson.findUniqueOrThrow({ where: { courseId, id: lessonId } }),
  ]);

  const response = await openai.responses.create({
    input: [
      { content: buildInstructions(), role: "developer" },
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

  await prisma.lessonArticle.upsert({
    create: { content, lessonId },
    update: { content },
    where: { lessonId },
  });

  return article;
}
