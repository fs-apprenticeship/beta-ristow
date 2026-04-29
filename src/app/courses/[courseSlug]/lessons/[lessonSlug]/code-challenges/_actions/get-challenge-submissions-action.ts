"use server";

import { getChallengeSubmissions } from "@/features/codechallenge/get-challenge-submissions";

export async function getChallengeSubmissionsAction(challengeId: string) {
  return getChallengeSubmissions(challengeId);
}
