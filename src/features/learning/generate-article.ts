import OpenAI from "openai";

import getClient from "@/lib/prisma/get-client";

const prisma = getClient();
const openai = new OpenAI();

interface Article {
  conclusion: string;
  intro: string;
  sections: { content: string; heading: string }[];
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

export default async function* generateArticle(
  lessonId: string,
  courseId: string,
): AsyncGenerator<string> {
  const [course, lesson] = await Promise.all([
    prisma.course.findUniqueOrThrow({ where: { id: courseId } }),
    prisma.lesson.findUniqueOrThrow({ where: { courseId, id: lessonId } }),
  ]);

  const response = await openai.responses.create({
    input: [
      { content: buildInstructions(), role: "developer" },
      { content: await buildPrompt(lesson, course), role: "user" },
    ],
    max_output_tokens: 1000,
    model: "gpt-4o-2024-08-06",
    temperature: 0.7,
    text: { format: ARTICLE_JSON_FORMAT },
  });

  const article = JSON.parse(response.output_text) as Article;
  yield article.intro;
  yield "\n";
  for (const section of article.sections) {
    yield section.content;
    yield "\n";
  }
  yield article.conclusion;
  yield "\n";
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
