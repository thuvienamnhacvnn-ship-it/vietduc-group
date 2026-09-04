import "server-only";

/**
 * Outbound notifications.
 *
 * There is no mail service configured by default, and this module never
 * pretends otherwise: `send()` reports `sent: false` with a reason, and every
 * caller surfaces that honestly rather than telling the visitor an email is on
 * its way. Wiring a real provider means implementing one adapter here.
 *
 * Configure with:
 *   EMAIL_PROVIDER=resend
 *   RESEND_API_KEY=...
 *   EMAIL_FROM="Việt Đức Group <tuyensinh@example.com>"
 *   ADMIN_NOTIFY_EMAIL=...
 */

export type SendResult = { sent: boolean; reason?: string };

export type Message = {
  to: string;
  subject: string;
  text: string;
};

interface EmailProvider {
  readonly id: string;
  send(message: Message): Promise<SendResult>;
}

class ResendProvider implements EmailProvider {
  readonly id = "resend";
  constructor(
    private readonly apiKey: string,
    private readonly from: string,
  ) {}

  async send(message: Message): Promise<SendResult> {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${this.apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: this.from,
        to: [message.to],
        subject: message.subject,
        text: message.text,
      }),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      return { sent: false, reason: `resend responded ${response.status}: ${detail.slice(0, 200)}` };
    }
    return { sent: true };
  }
}

function getProvider(): EmailProvider | null {
  const name = (process.env.EMAIL_PROVIDER ?? "").trim().toLowerCase();
  const from = process.env.EMAIL_FROM?.trim();
  if (name === "resend") {
    const key = process.env.RESEND_API_KEY?.trim();
    return key && from ? new ResendProvider(key, from) : null;
  }
  return null;
}

export function emailConfigured(): boolean {
  return getProvider() !== null;
}

export async function send(message: Message): Promise<SendResult> {
  const provider = getProvider();
  if (!provider) return { sent: false, reason: "no_email_provider" };
  try {
    return await provider.send(message);
  } catch (error) {
    return { sent: false, reason: (error as Error).message };
  }
}

/** Where new-lead alerts go. Empty means nobody is notified by email. */
export function adminRecipient(): string | null {
  return process.env.ADMIN_NOTIFY_EMAIL?.trim() || null;
}
