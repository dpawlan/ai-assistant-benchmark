import { NextRequest, NextResponse } from 'next/server';
import { clientIp, clip, createIssue, makeRateLimiter, sendEmail } from '@/lib/inbox';

/**
 * "Request a test" submissions. Each one becomes a GitHub issue (the queue) and an email (so it's noticed).
 * Both are best-effort: if the env vars are missing or a delivery fails, the request is logged and the
 * form still gets a success, so a config problem never shows up as a user-facing error. Env: see src/lib/inbox.ts.
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

const MAX = { agentName: 80, agentUrl: 300, contact: 200, notes: 2000 };
const rateLimited = makeRateLimiter(5, 10 * 60 * 1000);

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

  if (rateLimited(clientIp(request))) return NextResponse.json({ error: 'Too many requests. Try again in a few minutes.' }, { status: 429 });

  const entry: Entry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    agentName,
    agentUrl: clip(payload.agentUrl, MAX.agentUrl) || null,
    categories: Array.isArray(payload.categories) ? payload.categories.filter(c => typeof c === 'string').slice(0, 15) : [],
    contact: clip(payload.contact, MAX.contact) || null,
    notes: clip(payload.notes, MAX.notes) || null,
  };

  console.log('[request]', JSON.stringify(entry));

  let issueUrl: string | null = null;
  try {
    issueUrl = await createIssue({ title: `Test request: ${entry.agentName}`, body: issueBody(entry), labels: ['request'] });
  } catch (err) {
    console.error('[request] issue failed', err);
  }
  try {
    await sendEmail({
      subject: `Test request: ${entry.agentName}`,
      rows: [
        ['Assistant', entry.agentName],
        ['Website', entry.agentUrl ?? '—'],
        ['Categories first', entry.categories.length ? entry.categories.join(', ') : 'all'],
        ['Contact', entry.contact ?? '—'],
        ['Notes', entry.notes ?? '—'],
        ['Issue', issueUrl ?? 'not created (no GITHUB_TOKEN)'],
      ],
      text: issueBody(entry).replace(/\*\*/g, '').replace(/<[^>]+>/g, ''),
    });
  } catch (err) {
    console.error('[request] email failed', err);
  }

  return NextResponse.json({ success: true, id: entry.id });
}
