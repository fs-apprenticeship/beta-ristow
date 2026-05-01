import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z, ZodTypeAny } from "zod";

const client = new OpenAI();

export default async function generateStructuredOutput<
  Schema extends ZodTypeAny,
>({
  formatSchema,
  instructions,
  prompt,
}: {
  formatSchema: Schema;
  instructions: string;
  prompt: string;
}): Promise<z.infer<Schema>> {
  const response = await client.responses.create({
    input: [
      { content: instructions, role: "developer" },
      { content: prompt, role: "user" },
    ],
    model: "gpt-4o-2024-08-06",
    text: {
      format: zodTextFormat(formatSchema, "structured_output"),
    },
  });

  return formatSchema.parse(JSON.parse(response.output_text));
}
