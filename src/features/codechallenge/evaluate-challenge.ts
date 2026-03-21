import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface EvaluationResult {
  correct: boolean;
  feedback: string;
}

/**
 * Evaluates user code against a coding challenge prompt.
 */

export async function evaluateChallenge(
  prompt: string,
  userCode: string,
): Promise<EvaluationResult> {
  if (!prompt || !userCode) {
    return { correct: false, feedback: "Missing prompt or user code." };
  }

  const evalPrompt = `
You are a strict coding evaluator.

Challenge:
${prompt}

User Code:
${userCode}

Instructions:
- Return true ONLY if the user's code fully solves the problem.
- Consider edge cases.
- Do not execute the code; evaluate logic and correctness.
- Return JSON only in this format:
{
    "correct": true|false,
    "feedback": "Explain why the solution is correct or what is missing."
}
`;

  try {
    const response = await openai.chat.completions.create({
      messages: [{ content: evalPrompt, role: "user" }],
      model: "gpt-4.1",
      temperature: 0,
    });

    const content = response.choices?.[0].message?.content;

    if (!content) {
      return { correct: false, feedback: "AI returned an empty response." };
    }

    try {
      // Parse JSON returned by AI
      return JSON.parse(content.trim());
    } catch {
      console.warn("AI returned invalid JSON:", content);
      return { correct: false, feedback: "AI returned invalid JSON." };
    }
  } catch (err) {
    console.error("OpenAI evaluation error:", err);
    return { correct: false, feedback: "AI evaluation failed." };
  }
}
