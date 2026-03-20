import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

    const response = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [{ role: "user", content: prompt }],
    });

    return JSON.parse(response.choices[0].message.content!.trim());
}