import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import requestStream from "@/lib/stream/request-stream";

import Home from "./page";

vi.mock("@/lib/stream/request-stream", () => ({
  default: vi.fn(),
}));

vi.mock("react-markdown", () => ({
  default: ({ children }: { children: string }) => (
    <div data-testid="markdown-content">{children}</div>
  ),
}));

vi.mock("./codeblock", () => ({
  default: ({ children }: { children: string }) => (
    <pre data-testid="code-block">{children}</pre>
  ),
}));

describe("Chat Page (AVA)", () => {
  const mockParams = {
    params: Promise.resolve({
      courseSlug: "intro-to-python",
      lessonSlug: "set-up-your-environment",
    }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the initial UI correctly with header and empty state", async () => {
    await act(async () => {
      render(<Home params={mockParams.params} />);
    });

    expect(screen.getByText("Hi there, I am AVA")).toBeInTheDocument();
    expect(screen.getByText("Ask me anything")).toBeInTheDocument();
    expect(
      screen.getByText("Your conversation will appear here..."),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send/i })).toBeInTheDocument();
  });

  it("sends a message when Enter is pressed and shows user + assistant messages", async () => {
    (requestStream as ReturnType<typeof vi.fn>).mockImplementation(
      (_url: string, onChunk: (chunk: string) => void) => {
        const message =
          "Yes, you can install Python from the official website.";
        onChunk(`data: ${JSON.stringify(message)}\n\n`);
        return () => {};
      },
    );

    await act(async () => {
      render(<Home params={mockParams.params} />);
    });

    const textarea = screen.getByRole("textbox");

    fireEvent.change(textarea, {
      target: { value: "How do I install Python?" },
    });
    fireEvent.keyDown(textarea, {
      code: "Enter",
      key: "Enter",
      shiftKey: false,
    });

    await waitFor(() => {
      expect(screen.getByText("How do I install Python?")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          "Yes, you can install Python from the official website.",
        ),
      ).toBeInTheDocument();
    });

    expect(requestStream).toHaveBeenCalledWith(
      "/api/courses/intro-to-python/lessons/set-up-your-environment/chat",
      expect.any(Function),
      expect.objectContaining({
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }),
    );
  });
});
