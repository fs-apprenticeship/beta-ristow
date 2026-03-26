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
- Evaluate logic and correctness.
- Line number of error code if it is error.
- print any prints or console logs.
- return the output if the code is run.
- If the code runs, accept the code and provide feedback for an optimal solution.
- Return JSON only in this format:
{
    "correct": true|false,
    "stdout": "if there are prints or console logs, print it out"
    "error-code": "error description and line of the error code"
    "output": "If the code runs, provide the output"
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
