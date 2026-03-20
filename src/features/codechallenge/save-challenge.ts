import getClient from "@/lib/prisma/get-client";

export async function saveChallengeToDB(challengeData: any) {
    const prisma = getClient();

    return await prisma.challenge.create({
        data: {
            prompt: challengeData.prompt,
            starterCode: challengeData.starterCode,
            solution: challengeData.solution,
            difficulty: challengeData.difficulty,
            language: challengeData.language,
        },
    });
}
