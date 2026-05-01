export interface ChallengeData {
  difficulty: "easy" | "hard" | "medium";
  language: string;
  prompt: string;
  solution?: string;
  starterCode?: string;
  testCases: ChallengeTestCase[];
}

export interface ChallengeTestCase {
  expectedOutput: string;
  input: string;
}
