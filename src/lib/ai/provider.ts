/**
 * Provider-agnostic interface for the advisor.
 *
 * Everything above this file talks in terms of `ChatProvider` and
 * `EmbeddingProvider`. Swapping Anthropic for OpenAI, Gemini or a self-hosted
 * model means adding one adapter file, not touching the RAG pipeline or the UI.
 *
 * No key is ever read outside `lib/ai/*`, and no key is ever sent to the client.
 */

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type ChatRequest = {
  system: string;
  messages: ChatMessage[];
  maxTokens: number;
  temperature: number;
  signal?: AbortSignal;
};

export type ChatResult = {
  text: string;
  /** Provider-reported stop reason, for diagnostics only. */
  stopReason?: string;
  usage?: { inputTokens?: number; outputTokens?: number };
};

export interface ChatProvider {
  readonly id: string;
  readonly model: string;
  complete(request: ChatRequest): Promise<ChatResult>;
}

export interface EmbeddingProvider {
  readonly id: string;
  readonly model: string;
  readonly dimensions: number;
  embed(texts: string[]): Promise<number[][]>;
}

export class ProviderError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ProviderError";
  }
}

/** Small helper shared by adapters: POST JSON, throw a typed error on failure. */
export async function postJson<T>(
  url: string,
  body: unknown,
  headers: Record<string, string>,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    // The body may carry the provider's own message; it must never reach the
    // browser, so it is only used for the server-side log line.
    const detail = await response.text().catch(() => "");
    throw new ProviderError(
      `provider responded ${response.status}: ${detail.slice(0, 400)}`,
      response.status,
    );
  }
  return (await response.json()) as T;
}
