"use server";

import generateReflectionFeedback from "../generate-reflection-feedback";
import { ReflectionFeedback, ReflectionSubmission } from "../types";

export default async function submitReflection(
  submission: ReflectionSubmission,
): Promise<ReflectionFeedback> {
  return generateReflectionFeedback(submission);
}
