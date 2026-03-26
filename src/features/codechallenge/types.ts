export interface ChallengeData {
  difficulty: "easy" | "hard" | "medium";
  language: string;
  prompt: string;
  solution?: string;
  starterCode?: string;
}
