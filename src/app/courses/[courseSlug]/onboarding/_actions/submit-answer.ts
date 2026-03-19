"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import requireCurrentAccount from "@/features/identity/actions/require-current-account";
import answerQuestion from "@/features/onboarding/answer-question";

const answerSchema = z.object({
  answer: z.string().trim().min(1),
  id: z.string().trim().min(1),
});

export async function submitAnswer(courseSlug: string, formData: FormData) {
  const { id: learnerId } = await requireCurrentAccount();
  const { answer, id } = answerSchema.parse(Object.fromEntries(formData));

  await answerQuestion({ answer, id, learnerId });

  redirect(`/courses/${courseSlug}/onboarding`);
}
