import requireCurrentAccount from "@/features/identity/actions/require-current-account";
import generateDescription from "@/features/onboarding/generate-description";
import createStreamResponse from "@/lib/stream/create-stream-response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ questionId: string }> },
) {
  const { questionId } = await params;
  const { id: learnerId } = await requireCurrentAccount();

  const descriptionChunks = generateDescription(questionId, learnerId);

  return createStreamResponse(descriptionChunks);
}
