import generateStructuredOutput from "@/lib/openai/generate-structured-output";

const schema = {
  additionalProperties: false,
  properties: {
    difficulty: {
      enum: ["easy", "medium", "hard"],
      type: "string",
    },
    language: {
      enum: ["python"],
      type: "string",
    },
    prompt: { type: "string" },
    solution: { type: "string" },
    starterCode: { type: "string" },
  },
  required: ["prompt", "starterCode", "difficulty", "solution", "language"],
  type: "object",
} as const;

export async function generateChallenge(title: string, topics: string) {
  const prompt = `
  Create a coding challenge based on:
  Title: ${title}
  Topics: ${topics}`;

  const response = await generateStructuredOutput({
    formatSchema: schema,
    instructions:
      "You are a coding challenge generator for a coding education platform.",
    prompt: prompt,
  });
  console.log("Raw response from OpenAI:", response);
  return response;
}
