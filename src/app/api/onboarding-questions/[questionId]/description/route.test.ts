import { beforeEach, describe, expect, it, vi } from "vitest";

import { AccountFactory } from "@/test/factories/account-factory";

const { generateDescriptionMock, requireCurrentAccountMock } = vi.hoisted(
  () => ({
    generateDescriptionMock: vi.fn(),
    requireCurrentAccountMock: vi.fn(),
  }),
);

vi.mock("@/features/identity/actions/require-current-account", () => ({
  default: requireCurrentAccountMock,
}));

vi.mock("@/features/onboarding/generate-description", () => ({
  default: generateDescriptionMock,
}));

import { GET } from "./route";

describe("onboarding question description route", () => {
  const request = new Request("https://example.com");

  beforeEach(() => {
    generateDescriptionMock.mockReset();
    requireCurrentAccountMock.mockReset();
  });

  it("streams the generated description", async () => {
    const learner = await AccountFactory.build();
    requireCurrentAccountMock.mockResolvedValue(learner);
    const questionId = "question-123";

    generateDescriptionMock.mockImplementation(async function* () {
      yield "First sentence. ";
      yield "Second sentence.";
    });

    const response = await GET(request, {
      params: Promise.resolve({ questionId }),
    });

    expect(response.headers.get("Cache-Control")).toBe("no-cache");
    expect(response.headers.get("Content-Type")).toBe(
      "text/plain; charset=utf-8",
    );
    expect(await response.text()).toBe("First sentence. Second sentence.");
    expect(generateDescriptionMock).toHaveBeenCalledWith(
      questionId,
      learner.id,
    );
  });

  it("returns the response before generation finishes", async () => {
    const learner = await AccountFactory.build();
    requireCurrentAccountMock.mockResolvedValue(learner);
    const questionId = "question-456";

    let resolveGeneration = () => {};
    const generationReady = new Promise<void>((resolve) => {
      resolveGeneration = resolve;
    });

    generateDescriptionMock.mockImplementation(async function* () {
      await generationReady;
      yield "Finished later.";
    });

    const responsePromise = GET(request, {
      params: Promise.resolve({ questionId }),
    });

    await expect(responsePromise).resolves.toBeInstanceOf(Response);

    resolveGeneration();

    const response = await responsePromise;
    await expect(response.text()).resolves.toBe("Finished later.");
  });
});
