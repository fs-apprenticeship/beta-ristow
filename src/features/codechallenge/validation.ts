import { z } from "zod";

/* =========================
   CHALLENGE GENERATION
========================= */

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

/* =========================
   CHALLENGE EVALUATION
========================= */

export const evaluationResultSchema = z.object({
    results: z.array(
        z.object({
            output: z.string(),
            stdout: z.string(),
            passed: z.boolean(),
        })
    )
})

export type ChallengeData = z.infer<typeof challengeSchema>
export type EvaluationResult = z.infer<typeof evaluationResultSchema>