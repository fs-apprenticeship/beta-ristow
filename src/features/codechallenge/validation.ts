import { z } from "zod";

export const challengeTestCaseSchema = z.object({
    expectedOutput: z.string(),
    input: z.string(),
});

export const challengeSchema = z.object({
    difficulty: z.enum(["easy", "medium", "hard"]),
    language: z.literal("python"),
    prompt: z.string(),
    solution: z.string(),
    starterCode: z.string(),
    testCases: z.array(challengeTestCaseSchema).length(3)
})

export type ChallengeData = z.infer<typeof challengeSchema>