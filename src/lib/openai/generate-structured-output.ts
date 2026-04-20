import OpenAI from "openai";

const client = new OpenAI();

export default async function generateStructuredOutput<T>({
  formatSchema,
  instructions,
  prompt,
}: {
  formatSchema: Record<string, unknown>;
  instructions: string;
  prompt: string;
}): Promise<T> {
  const response = await client.responses.create({
    input: [
      { content: instructions, role: "developer" },
      { content: prompt, role: "user" },
    ],
    model: "gpt-4o-2024-08-06",
    text: {
      format: {
        description: `The output is JSON that will be parsed to be used as data affecting UI display and logic.
    Always return valid JSON that adheres to the provided Schema.`,
        name: "structured_output",
        schema: formatSchema,
        type: "json_schema",
      },
    },
  });

  return JSON.parse(response.output_text);
}
