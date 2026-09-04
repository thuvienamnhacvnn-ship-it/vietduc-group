import {
  postJson,
  ProviderError,
  type ChatProvider,
  type ChatRequest,
  type ChatResult,
  type EmbeddingProvider,
} from "./provider";

export * from "./provider";

/* ------------------------------------------------------------- Anthropic */

class AnthropicChat implements ChatProvider {
  readonly id = "anthropic";
  constructor(
    private readonly apiKey: string,
    readonly model: string,
  ) {}

  async complete(request: ChatRequest): Promise<ChatResult> {
    type Response = {
      content: { type: string; text?: string }[];
      stop_reason?: string;
      usage?: { input_tokens: number; output_tokens: number };
    };
    const data = await postJson<Response>(
      "https://api.anthropic.com/v1/messages",
      {
        model: this.model,
        max_tokens: request.maxTokens,
        temperature: request.temperature,
        system: request.system,
        messages: request.messages,
      },
      { "x-api-key": this.apiKey, "anthropic-version": "2023-06-01" },
      request.signal,
    );
    return {
      text: data.content.filter((c) => c.type === "text").map((c) => c.text ?? "").join(""),
      stopReason: data.stop_reason,
      usage: { inputTokens: data.usage?.input_tokens, outputTokens: data.usage?.output_tokens },
    };
  }
}

/* ---------------------------------------------------------------- OpenAI */

class OpenAiChat implements ChatProvider {
  readonly id = "openai";
  constructor(
    private readonly apiKey: string,
    readonly model: string,
    private readonly baseUrl: string,
  ) {}

  async complete(request: ChatRequest): Promise<ChatResult> {
    type Response = {
      choices: { message: { content: string }; finish_reason?: string }[];
      usage?: { prompt_tokens: number; completion_tokens: number };
    };
    const data = await postJson<Response>(
      `${this.baseUrl}/chat/completions`,
      {
        model: this.model,
        max_tokens: request.maxTokens,
        temperature: request.temperature,
        messages: [{ role: "system", content: request.system }, ...request.messages],
      },
      { authorization: `Bearer ${this.apiKey}` },
      request.signal,
    );
    return {
      text: data.choices[0]?.message?.content ?? "",
      stopReason: data.choices[0]?.finish_reason,
      usage: { inputTokens: data.usage?.prompt_tokens, outputTokens: data.usage?.completion_tokens },
    };
  }
}

class OpenAiEmbeddings implements EmbeddingProvider {
  readonly id = "openai";
  constructor(
    private readonly apiKey: string,
    readonly model: string,
    readonly dimensions: number,
    private readonly baseUrl: string,
  ) {}

  async embed(texts: string[]): Promise<number[][]> {
    type Response = { data: { embedding: number[]; index: number }[] };
    const data = await postJson<Response>(
      `${this.baseUrl}/embeddings`,
      { model: this.model, input: texts },
      { authorization: `Bearer ${this.apiKey}` },
    );
    return data.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
  }
}

/* ---------------------------------------------------------------- Gemini */

class GeminiChat implements ChatProvider {
  readonly id = "gemini";
  constructor(
    private readonly apiKey: string,
    readonly model: string,
  ) {}

  async complete(request: ChatRequest): Promise<ChatResult> {
    type Response = {
      candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
      usageMetadata?: { promptTokenCount: number; candidatesTokenCount: number };
    };
    const data = await postJson<Response>(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`,
      {
        systemInstruction: { parts: [{ text: request.system }] },
        contents: request.messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          maxOutputTokens: request.maxTokens,
          temperature: request.temperature,
        },
      },
      { "x-goog-api-key": this.apiKey },
      request.signal,
    );
    const candidate = data.candidates?.[0];
    return {
      text: candidate?.content?.parts?.map((p) => p.text ?? "").join("") ?? "",
      stopReason: candidate?.finishReason,
      usage: {
        inputTokens: data.usageMetadata?.promptTokenCount,
        outputTokens: data.usageMetadata?.candidatesTokenCount,
      },
    };
  }
}

class GeminiEmbeddings implements EmbeddingProvider {
  readonly id = "gemini";
  constructor(
    private readonly apiKey: string,
    readonly model: string,
    readonly dimensions: number,
  ) {}

  async embed(texts: string[]): Promise<number[][]> {
    type Response = { embeddings: { values: number[] }[] };
    const data = await postJson<Response>(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:batchEmbedContents`,
      {
        requests: texts.map((text) => ({
          model: `models/${this.model}`,
          content: { parts: [{ text }] },
        })),
      },
      { "x-goog-api-key": this.apiKey },
    );
    return data.embeddings.map((e) => e.values);
  }
}

/* ------------------------------------------------------------- selection */

const DEFAULT_MODELS: Record<string, string> = {
  anthropic: "claude-sonnet-5",
  openai: "gpt-4o-mini",
  gemini: "gemini-2.0-flash",
};

/**
 * Returns the configured chat provider, or null when the site is running
 * without one. Null is a supported state, not an error: the advisor then falls
 * back to showing retrieved passages without generated prose, and the UI says
 * so plainly.
 */
export function getChatProvider(): ChatProvider | null {
  const name = (process.env.AI_PROVIDER ?? "").trim().toLowerCase();
  const model = process.env.AI_MODEL?.trim() || DEFAULT_MODELS[name];

  switch (name) {
    case "anthropic": {
      const key = process.env.ANTHROPIC_API_KEY?.trim();
      return key && model ? new AnthropicChat(key, model) : null;
    }
    case "openai": {
      const key = process.env.OPENAI_API_KEY?.trim();
      const baseUrl = process.env.OPENAI_BASE_URL?.trim() || "https://api.openai.com/v1";
      return key && model ? new OpenAiChat(key, model, baseUrl) : null;
    }
    case "gemini": {
      const key = process.env.GEMINI_API_KEY?.trim();
      return key && model ? new GeminiChat(key, model) : null;
    }
    default:
      return null;
  }
}

/**
 * Embeddings are optional. Without them retrieval still works - it falls back
 * to the lexical scorer in `lib/rag/retrieve.ts`, which is deterministic and
 * needs no external service.
 */
export function getEmbeddingProvider(): EmbeddingProvider | null {
  const name = (process.env.EMBEDDING_PROVIDER ?? "").trim().toLowerCase();
  switch (name) {
    case "openai": {
      const key = process.env.OPENAI_API_KEY?.trim();
      const model = process.env.EMBEDDING_MODEL?.trim() || "text-embedding-3-small";
      const dimensions = Number(process.env.EMBEDDING_DIMENSIONS ?? 1536);
      const baseUrl = process.env.OPENAI_BASE_URL?.trim() || "https://api.openai.com/v1";
      return key ? new OpenAiEmbeddings(key, model, dimensions, baseUrl) : null;
    }
    case "gemini": {
      const key = process.env.GEMINI_API_KEY?.trim();
      const model = process.env.EMBEDDING_MODEL?.trim() || "text-embedding-004";
      const dimensions = Number(process.env.EMBEDDING_DIMENSIONS ?? 768);
      return key ? new GeminiEmbeddings(key, model, dimensions) : null;
    }
    default:
      return null;
  }
}

/** Safe description for the admin dashboard - never includes key material. */
export function describeAiConfig() {
  const chat = getChatProvider();
  const embeddings = getEmbeddingProvider();
  return {
    chat: chat ? { provider: chat.id, model: chat.model } : null,
    embeddings: embeddings
      ? { provider: embeddings.id, model: embeddings.model, dimensions: embeddings.dimensions }
      : null,
    retrieval: embeddings ? "hybrid (lexical + vector)" : "lexical only",
  };
}

export { ProviderError };
