import { NextRequest, NextResponse } from 'next/server';
import { clientIp, clip, createIssue, makeRateLimiter, sendEmail } from '@/lib/inbox';

/**
 * "Submit a use case" submissions. Same pipeline as the test-request form: a GitHub issue (label `use-case`, plus
 * `vendor-submitted` when the sender works on the assistant) and an email. Nothing appears on the site until a
 * person reads it and adds a job to data/jobs.json. Deliveries are best-effort; the entry is always logged.
 */

interface UseCasePayload {
  title: string;
  assistant: string;
  what_happened: string;
  post_url?: string;
  contact?: string;
  vendor?: boolean;
  /** Honeypot: real users never fill it. */
  website?: string;
}

const MAX = { title: 120, assistant: 80, what_happened: 2000, post_url: 300, contact: 200 };
const rateLimited = makeRateLimiter(5, 10 * 60 * 1000);

interface Entry {
  id: string;
  timestamp: string;
  title: string;
  assistant: string;
  whatHappened: string;
  postUrl: string | null;
  contact: string | null;
  vendor: boolean;
}

function issueBody(e: Entry): string {
  return [
    `**Assistant:** ${e.assistant}`,
    `**What they asked for:** ${e.title}`,
    '',
    '**What happened**',
    e.whatHappened,
    '',
    `**Post:** ${e.postUrl ?? '—'}`,
    `**Contact:** ${e.contact ?? '—'}`,
    `**Works on this assistant:** ${e.vendor ? 'yes' : 'no'}`,
    '',
    `<sub>Submitted ${e.timestamp} · id ${e.id}</sub>`,
  ].join('\n');
}

export async function POST(request: NextRequest) {
  let payload: UseCasePayload;
  try {
    payload = (await request.json()) as UseCasePayload;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const title = clip(payload.title, MAX.title);
  const assistant = clip(payload.assistant, MAX.assistant);
  const whatHappened = clip(payload.what_happened, MAX.what_happened);
  if (!title || !assistant || !whatHappened) return NextResponse.json({ error: 'Title, assistant and what happened are required' }, { status: 400 });

  if (clip(payload.website, 50)) return NextResponse.json({ success: true, id: crypto.randomUUID() });

  if (rateLimited(clientIp(request))) return NextResponse.json({ error: 'Too many requests. Try again in a few minutes.' }, { status: 429 });

  const postUrl = clip(payload.post_url, MAX.post_url);
  const entry: Entry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    title,
    assistant,
    whatHappened,
    postUrl: /^https?:\/\//i.test(postUrl) ? postUrl : null,
    contact: clip(payload.contact, MAX.contact) || null,
    vendor: payload.vendor === true,
  };

  console.log('[use-case]', JSON.stringify(entry));

  const subject = `Use case: ${entry.title} (${entry.assistant})`;
  let issueUrl: string | null = null;
  try {
    issueUrl = await createIssue({ title: subject, body: issueBody(entry), labels: ['use-case', ...(entry.vendor ? ['vendor-submitted'] : [])] });
  } catch (err) {
    console.error('[use-case] issue failed', err);
  }
  try {
    await sendEmail({
      subject,
      rows: [
        ['Assistant', entry.assistant],
        ['What they asked for', entry.title],
        ['What happened', entry.whatHappened],
        ['Post', entry.postUrl ?? '—'],
        ['Contact', entry.contact ?? '—'],
        ['Works on this assistant', entry.vendor ? 'yes' : 'no'],
        ['Issue', issueUrl ?? 'not created (no GITHUB_TOKEN)'],
      ],
      text: issueBody(entry).replace(/\*\*/g, '').replace(/<[^>]+>/g, ''),
    });
  } catch (err) {
    console.error('[use-case] email failed', err);
  }

  return NextResponse.json({ success: true, id: entry.id });
}
