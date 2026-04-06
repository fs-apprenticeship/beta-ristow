import generateText from "@/lib/openai/generate-text";
import parseJsonResponse from "@/lib/openai/parse-json-response";

export async function generateChallenge(title: string, topics: string) {
  const prompt = `
Create a coding challenge based on:
Title: ${title}
Topics: ${topics}

Return JSON only in this format:
{
    "prompt": "...",
    "starterCode": "...",
    "difficulty": "easy|medium|hard",
    "solution": "...",
    "language": "python"
}
`;

  const response = await generateText({
    instructions:
      "You are a coding challenge generator for a coding education platform.",
    prompt,
  });
  console.log("Raw response from OpenAI:", response);
  return parseJsonResponse(
    response,
    "Failed to generate a valid coding challenge.",
  );
}
