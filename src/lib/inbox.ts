import { NextRequest } from 'next/server';

/**
 * Shared plumbing for the two forms (request a test, submit a use case): both file a GitHub issue and send an email.
 * Deliveries are best-effort: with no token or key, the form still succeeds and the entry is only logged.
 *
 * Env:
 *   GITHUB_TOKEN       fine-grained token with Issues: write on GITHUB_REPO
 *   GITHUB_REPO        "owner/name", default dpawlan/ai-assistant-benchmark
 *   RESEND_API_KEY     resend.com key; sender is RESEND_FROM (default onboarding@resend.dev for the free tier)
 *   REQUEST_TO         where notifications go, default davidmpawlan@gmail.com
 */

export const GITHUB_REPO = process.env.GITHUB_REPO ?? 'dpawlan/ai-assistant-benchmark';
export const REQUEST_TO = process.env.REQUEST_TO ?? 'davidmpawlan@gmail.com';
export const RESEND_FROM = process.env.RESEND_FROM ?? 'Assistant Benchmark <onboarding@resend.dev>';

export function clip(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);
}

export function clientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

/** Per-instance sliding window: fine for low-volume forms, resets on cold start. */
export function makeRateLimiter(max: number, windowMs: number): (ip: string) => boolean {
  const hits = new Map<string, number[]>();
  return ip => {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter(t => now - t < windowMs);
    recent.push(now);
    hits.set(ip, recent);
    return recent.length > max;
  };
}

export async function createIssue(input: { title: string; body: string; labels: string[] }): Promise<string | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'assistant-benchmark',
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = (await res.json()) as { html_url?: string };
  return json.html_url ?? null;
}

export async function sendEmail(input: { subject: string; rows: [string, string][]; text: string }): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const rows = input.rows
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#6e6e73;vertical-align:top">${k}</td><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`)
    .join('');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [REQUEST_TO],
      subject: input.subject,
      html: `<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:15px;color:#1d1d1f"><table>${rows}</table></div>`,
      text: input.text,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 200)}`);
}
