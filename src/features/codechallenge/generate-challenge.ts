import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateChallenge(title: string, topics: string) {
<<<<<<< HEAD
  const prompt = `
=======
    const prompt = `
>>>>>>> de2fd36 (feat(codeChallenge): add generateChallenge API and saveChallenge logic)
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

<<<<<<< HEAD
  const response = await openai.chat.completions.create({
    messages: [{ content: prompt, role: "user" }],
    model: "gpt-4.1",
  });

  return JSON.parse(response.choices[0].message.content!.trim());
}
=======
    const response = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [{ role: "user", content: prompt }],
    });

    return JSON.parse(response.choices[0].message.content!.trim());
}
>>>>>>> de2fd36 (feat(codeChallenge): add generateChallenge API and saveChallenge logic)
