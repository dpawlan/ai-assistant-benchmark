import { NextRequest, NextResponse } from 'next/server';
import { getScoredCategories } from '@/lib/data';
import travelProtocol from '../../../../data/travel-protocol-draft.json';
import { clientIp, clip, createIssue, makeRateLimiter, sendEmail } from '@/lib/inbox';

/**
 * "Request a test" submissions. Each one becomes a GitHub issue (the queue) and an email (so it's noticed).
 * Both are best-effort: if the env vars are missing or a delivery fails, the request is logged and the
 * form still gets a success, so a config problem never shows up as a user-facing error. Env: see src/lib/inbox.ts.
 */

interface RequestPayload {
  suite?: 'general' | 'travel';
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
  suite: 'general' | 'travel';
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
    `**Category:** ${e.suite === 'travel' ? 'Travel' : 'General'}`,
    `**Assistant:** ${e.agentName}`,
    `**Website:** ${e.agentUrl ?? '—'}`,
    `**Dimensions to test first:** ${e.categories.length ? e.categories.join(', ') : 'all'}`,
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

  if (!payload || typeof payload !== 'object') return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  const suite = payload.suite ?? 'general';
  if (suite !== 'general' && suite !== 'travel') return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  const dimensions = suite === 'travel'
    ? travelProtocol.map(t => ({ key: String(t.id), label: t.title }))
    : getScoredCategories().map(c => ({ key: c.key, label: c.label }));
  const requested = payload.categories ?? [];
  if (!Array.isArray(requested) || requested.some(key => !dimensions.some(d => d.key === key))) return NextResponse.json({ error: 'Invalid dimensions for category' }, { status: 400 });
  const selected = dimensions.filter(d => requested.includes(d.key)).map(d => d.label);

  const agentName = clip(payload.agentName, MAX.agentName);
  if (!agentName) return NextResponse.json({ error: 'Agent name is required' }, { status: 400 });

  // Bots fill the honeypot; pretend it worked and drop it.
  if (clip(payload.website, 50)) return NextResponse.json({ success: true, id: crypto.randomUUID() });

  if (rateLimited(clientIp(request))) return NextResponse.json({ error: 'Too many requests. Try again in a few minutes.' }, { status: 429 });

  const entry: Entry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    agentName,
    suite,
    agentUrl: clip(payload.agentUrl, MAX.agentUrl) || null,
    categories: selected,
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
        ['Category', entry.suite === 'travel' ? 'Travel' : 'General'],
        ['Assistant', entry.agentName],
        ['Website', entry.agentUrl ?? '—'],
        ['Dimensions first', entry.categories.length ? entry.categories.join(', ') : 'all'],
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
