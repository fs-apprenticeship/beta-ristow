import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { requestStreamMock } = vi.hoisted(() => ({
  requestStreamMock: vi.fn(),
}));

vi.mock("@/lib/stream/request-stream", () => ({
  default: requestStreamMock,
}));

import { StreamingDescription } from "./streaming-description";

describe("StreamingDescription", () => {
  beforeEach(() => {
    requestStreamMock.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders streamed text from requestStream", async () => {
    requestStreamMock.mockImplementation((_url, onChunk) => {
      void onChunk("First sentence. ");
      void onChunk("Second sentence.");

      return () => {};
    });

    render(<StreamingDescription questionId="question-123" />);

    expect(requestStreamMock).toHaveBeenCalledWith(
      "/api/onboarding-questions/question-123/description",
      expect.any(Function),
    );
    expect(
      await screen.findByText("First sentence. Second sentence."),
    ).toBeInTheDocument();
  });

  it("stops streaming on unmount", () => {
    const stopStreaming = vi.fn();

    requestStreamMock.mockReturnValue(stopStreaming);

    const { unmount } = render(
      <StreamingDescription questionId="question-123" />,
    );

    unmount();

    expect(stopStreaming).toHaveBeenCalledOnce();
  });

  it("appends each streamed chunk to the current text", async () => {
    let onChunk: ((chunk: string) => Promise<void> | void) | undefined;

    requestStreamMock.mockImplementation((_url, receivedOnChunk) => {
      onChunk = receivedOnChunk;
      return () => {};
    });

    render(<StreamingDescription questionId="question-123" />);

    await act(async () => {
      await onChunk?.("First sentence. ");
      await onChunk?.("Second sentence.");
    });

    expect(
      screen.getByText("First sentence. Second sentence."),
    ).toBeInTheDocument();
  });
});
