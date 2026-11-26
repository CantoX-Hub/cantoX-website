import { NextResponse } from "next/server";
import type { LogoRequestFormData } from "@/app/types/index.types";

const RAVEN_URL = "https://api.getravenrelay.com/v1/emails";
const STYLES = ["Classic", "Minimalistic", "Floral", "Luxury", "Afrocentric"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Strip CR/LF so user input can't break the subject line.
const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").slice(0, 200);

async function sendEmail(apiKey: string, payload: Record<string, unknown>) {
  const res = await fetch(RAVEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": crypto.randomUUID(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(
      `RavenRelay ${res.status}: ${body?.error?.code ?? "unknown"} ${body?.error?.message ?? ""}`,
    );
  }
  return res.json() as Promise<{ id: string; status: string; test_mode: boolean }>;
}

export async function POST(request: Request) {
  const apiKey = process.env.RAVENRELAY_API_KEY;
  const from = process.env.LOGO_REQUEST_FROM;
  const teamInbox = process.env.LOGO_REQUEST_TO;

  if (!apiKey || !from || !teamInbox) {
    console.error("[logo-request] Missing RAVENRELAY_API_KEY, LOGO_REQUEST_FROM or LOGO_REQUEST_TO");
    return NextResponse.json({ error: "Email is not configured." }, { status: 500 });
  }

  let data: Partial<LogoRequestFormData>;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const form = {
    coupleName: String(data.coupleName ?? "").trim(),
    email: String(data.email ?? "").trim(),
    logoName: String(data.logoName ?? "").trim(),
    hashtag: String(data.hashtag ?? "").trim(),
    style: String(data.style ?? "").trim(),
    brief: String(data.brief ?? "").trim(),
  };

  // Server-side validation mirrors the client rules.
  if (
    !form.coupleName ||
    !EMAIL_RE.test(form.email) ||
    !form.logoName ||
    !STYLES.includes(form.style) ||
    form.brief.length < 15 ||
    form.brief.length > 500
  ) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  const safe = Object.fromEntries(
    Object.entries(form).map(([k, v]) => [k, escapeHtml(v)]),
  ) as typeof form;

  const rows = [
    ["Couple name", safe.coupleName],
    ["Email", safe.email],
    ["Logo name", safe.logoName],
    ["Hashtag", safe.hashtag || "—"],
    ["Style", safe.style],
    ["Brief", safe.brief.replace(/\n/g, "<br />")],
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;font-weight:bold;vertical-align:top">${label}</td><td style="padding:6px 0">${value}</td></tr>`,
    )
    .join("");

  try {
    // 1. Notify the CantoX team. Hitting "Reply" goes straight to the couple.
    await sendEmail(apiKey, {
      from,
      to: teamInbox.split(",").map((s) => s.trim()).filter(Boolean),
      reply_to: form.email,
      subject: oneLine(`New logo request: ${form.logoName} (${form.coupleName})`),
      html: `<h2>New logo request</h2><table>${rows}</table>`,
      text: Object.entries(form).map(([k, v]) => `${k}: ${v}`).join("\n"),
      tags: { type: "logo_request" },
    });

    // 2. Confirm to the couple. A failure here shouldn't fail the request.
    await sendEmail(apiKey, {
      from,
      to: form.email,
      subject: "We've received your logo request",
      html: `<p>Hi ${safe.coupleName},</p>
<p>Thanks for requesting a logo for <strong>${safe.logoName}</strong>. Our design team will review your brief and get back to you soon.</p>
<p>Here's what you sent us:</p><table>${rows}</table>
<p>With love,<br />The CantoX team</p>`,
      tags: { type: "logo_request_confirmation" },
    }).catch((err) => console.error("[logo-request] confirmation failed:", err));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[logo-request] send failed:", err);
    return NextResponse.json(
      { error: "Unable to submit your request. Please try again." },
      { status: 502 },
    );
  }
}
