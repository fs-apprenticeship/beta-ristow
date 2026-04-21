interface RequestStreamOptions {
  body?: BodyInit;
  headers?: Record<string, string>;
  method?: string;
}

export default function requestStream(
  input: RequestInfo | URL,
  onChunk: (chunk: string) => Promise<void> | void,
  options?: RequestStreamOptions,
) {
  const controller = new AbortController();

  streamResponse(input, controller.signal, onChunk, options).catch((error) => {
    if (error?.name === "AbortError") return;

    queueMicrotask(() => {
      throw error;
    });
  });

  return () => controller.abort();
}

async function streamResponse(
  input: RequestInfo | URL,
  signal: AbortSignal,
  onChunk: (chunk: string) => Promise<void> | void,
  options?: RequestStreamOptions,
) {
  const response = await fetch(input, { signal, ...options });
  if (!response.ok || !response.body) return;

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();

      const text = done
        ? decoder.decode()
        : decoder.decode(value, { stream: true });

      if (text) await onChunk(text);
      if (done) break;
    }
  } finally {
    reader.releaseLock();
  }
}
