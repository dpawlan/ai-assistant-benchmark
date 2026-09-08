import { NextRequest, NextResponse } from 'next/server';

/**
 * "Request a test" submissions. Each one becomes a GitHub issue (the queue) and an email (so it's noticed).
 * Both are best-effort: if the env vars are missing or a delivery fails, the request is logged and the
 * form still gets a success, so a config problem never shows up as a user-facing error.
 *
 * Env:
 *   GITHUB_TOKEN       fine-grained token with Issues: write on GITHUB_REPO
 *   GITHUB_REPO        "owner/name", default dpawlan/ai-assistant-benchmark
 *   RESEND_API_KEY     resend.com key; sender is RESEND_FROM (default onboarding@resend.dev for the free tier)
 *   REQUEST_TO         where notifications go, default davidmpawlan@gmail.com
 */

interface RequestPayload {
  agentName: string;
  agentUrl?: string;
  categories: string[];
  contact?: string;
  notes?: string;
  /** Honeypot: real users never fill it. */
  website?: string;
}

const GITHUB_REPO = process.env.GITHUB_REPO ?? 'dpawlan/ai-assistant-benchmark';
const REQUEST_TO = process.env.REQUEST_TO ?? 'davidmpawlan@gmail.com';
const RESEND_FROM = process.env.RESEND_FROM ?? 'Assistant Benchmark <onboarding@resend.dev>';

const MAX = { agentName: 80, agentUrl: 300, contact: 200, notes: 2000 };
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 };

// Per-instance memory: fine for a low-volume form, resets on cold start.
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(t => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT.max;
}

function clip(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);
}

interface Entry {
  id: string;
  timestamp: string;
  agentName: string;
  agentUrl: string | null;
  categories: string[];
  contact: string | null;
  notes: string | null;
}

function issueBody(e: Entry): string {
  return [
    `**Assistant:** ${e.agentName}`,
    `**Website:** ${e.agentUrl ?? '—'}`,
    `**Categories to test first:** ${e.categories.length ? e.categories.join(', ') : 'all'}`,
    `**Contact:** ${e.contact ?? '—'}`,
    '',
    '**Notes**',
    e.notes ?? '—',
    '',
    `<sub>Submitted ${e.timestamp} · id ${e.id}</sub>`,
  ].join('\n');
}

async function createIssue(e: Entry): Promise<string | null> {
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
    body: JSON.stringify({ title: `Test request: ${e.agentName}`, body: issueBody(e), labels: ['request'] }),
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = (await res.json()) as { html_url?: string };
  return json.html_url ?? null;
}

async function sendEmail(e: Entry, issueUrl: string | null): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const rows = [
    ['Assistant', e.agentName],
    ['Website', e.agentUrl ?? '—'],
    ['Categories first', e.categories.length ? e.categories.join(', ') : 'all'],
    ['Contact', e.contact ?? '—'],
    ['Notes', e.notes ?? '—'],
    ['Issue', issueUrl ?? 'not created (no GITHUB_TOKEN)'],
  ]
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#6e6e73;vertical-align:top">${k}</td><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`)
    .join('');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [REQUEST_TO],
      subject: `Test request: ${e.agentName}`,
      html: `<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:15px;color:#1d1d1f"><table>${rows}</table></div>`,
      text: issueBody(e).replace(/\*\*/g, '').replace(/<[^>]+>/g, ''),
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

export async function POST(request: NextRequest) {
  let payload: RequestPayload;
  try {
    payload = (await request.json()) as RequestPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const agentName = clip(payload.agentName, MAX.agentName);
  if (!agentName) return NextResponse.json({ error: 'Agent name is required' }, { status: 400 });

  // Bots fill the honeypot; pretend it worked and drop it.
  if (clip(payload.website, 50)) return NextResponse.json({ success: true, id: crypto.randomUUID() });

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) return NextResponse.json({ error: 'Too many requests. Try again in a few minutes.' }, { status: 429 });

  const entry: Entry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    agentName,
    agentUrl: clip(payload.agentUrl, MAX.agentUrl) || null,
    categories: Array.isArray(payload.categories) ? payload.categories.filter(c => typeof c === 'string').slice(0, 14) : [],
    contact: clip(payload.contact, MAX.contact) || null,
    notes: clip(payload.notes, MAX.notes) || null,
  };

  console.log('[request]', JSON.stringify(entry));

  let issueUrl: string | null = null;
  try {
    issueUrl = await createIssue(entry);
  } catch (err) {
    console.error('[request] issue failed', err);
  }
  try {
    await sendEmail(entry, issueUrl);
  } catch (err) {
    console.error('[request] email failed', err);
  }

  return NextResponse.json({ success: true, id: entry.id });
}
