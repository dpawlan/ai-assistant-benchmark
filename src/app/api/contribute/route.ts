import { NextRequest, NextResponse } from 'next/server';
import { clientIp, clip, createIssue, makeRateLimiter, putRepoFile, sendEmail } from '@/lib/inbox';
import { getAllSlugs } from '@/lib/data';

/**
 * Intake for contributed runs (see skills/contribute-runs/SKILL.md and scripts/contribute.mjs).
 * A bundle holds draft runs with timing signals and REDACTED excerpts, usage stats, and the contributor's handle and
 * disclosure. It never holds a transcript. The bundle is committed to a private inbox repo and a ticket is opened
 * there; nothing is published until a maintainer scores and approves each run.
 *
 * Env: CONTRIB_REPO (default dpawlan/assistant-benchmark-contrib), CONTRIB_GITHUB_TOKEN (contents + issues write on
 * that repo; falls back to GITHUB_TOKEN). Without a token the bundle is emailed instead so nothing is lost.
 */

const CONTRIB_REPO = process.env.CONTRIB_REPO ?? 'dpawlan/assistant-benchmark-contrib';
const MAX_BYTES = 1_500_000;
const MAX_DRAFTS = 40;
const MAX_EXCERPT = 40;
const CATEGORIES = new Set(['online_task', 'travel', 'recommendation_quality', 'purchasing', 'email_replies', 'proactive_behavior', 'running_routine', 'third_party_integrations', 'permissions_privacy', 'memory', 'personality', 'phone_calls', 'multiplayer_groups', 'chained_tasks', 'proactive_restraint', 'content_creation_games']);
const rateLimited = makeRateLimiter(6, 60 * 60 * 1000);

interface Msg { from: 'me' | 'agent'; ts: string; text: string; attachment?: boolean }
interface Draft { id: string; category: string; protocol: 'task' | 'observed'; date: string; signals: Record<string, unknown>; excerpt: Msg[]; proposed_score: number | null; proposed_outcome: string | null; notes: string }
interface Bundle {
  version: number; id: string; created_at: string; slug: string;
  contributor: { handle: string; disclosure: string; comped: string };
  source: string; assistant_handle: string | null; usage: Record<string, unknown> | null; drafts: Draft[];
}

/** Server-side redaction, so a modified client cannot skip it. */
function scrub(text: string): string {
  return text
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '[email]')
    .replace(/(\+?1[ -.]?)?\(?\d{3}\)?[ -.]?\d{3}[ -.]?\d{4}\b/g, '[phone]')
    .replace(/\b\d{13,19}\b/g, '[card]')
    .replace(/\bhttps?:\/\/\S+/g, m => (/assistantbenchmark\.com/i.test(m) ? m : '[link]'));
}

function validate(raw: unknown): { bundle: Bundle } | { error: string } {
  const b = raw as Partial<Bundle>;
  if (!b || typeof b !== 'object') return { error: 'Invalid bundle' };
  if (b.version !== 1) return { error: 'Unsupported bundle version' };
  const slug = clip(b.slug, 60);
  if (!/^[a-z0-9-]+$/.test(slug) || !getAllSlugs().includes(slug)) return { error: `Unknown assistant: ${slug}` };
  const handle = clip(b.contributor?.handle, 41);
  if (!/^@[\w.-]{2,40}$/.test(handle)) return { error: 'A handle like @you is required' };
  if (!Array.isArray(b.drafts) || !b.drafts.length) return { error: 'No draft runs in the bundle' };
  if (b.drafts.length > MAX_DRAFTS) return { error: `Too many drafts (max ${MAX_DRAFTS})` };
  const drafts: Draft[] = [];
  for (const d of b.drafts) {
    if (!d || typeof d !== 'object') return { error: 'Malformed draft' };
    const id = clip(d.id, 80);
    if (!/^[\w.-]+$/.test(id) || !id.startsWith(`${slug}-`)) return { error: `Draft id does not belong to ${slug}: ${id}` };
    if (!CATEGORIES.has(String(d.category))) return { error: `Unknown category on ${id}` };
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(d.date))) return { error: `Bad date on ${id}` };
    if (!Array.isArray(d.excerpt) || d.excerpt.length > MAX_EXCERPT) return { error: `Bad excerpt on ${id}` };
    const excerpt: Msg[] = [];
    let last = '';
    for (const m of d.excerpt) {
      if (!m || (m.from !== 'me' && m.from !== 'agent') || typeof m.ts !== 'string' || Number.isNaN(Date.parse(m.ts))) return { error: `Bad message in ${id}` };
      if (m.ts < last) return { error: `Messages out of order in ${id}` };
      last = m.ts;
      excerpt.push({ from: m.from, ts: m.ts, text: scrub(clip(m.text, 600)), ...(m.attachment ? { attachment: true } : {}) });
    }
    const score = typeof d.proposed_score === 'number' && d.proposed_score >= 1 && d.proposed_score <= 10 ? d.proposed_score : null;
    const outcome = ['pass', 'partial', 'fail', 'n/a'].includes(String(d.proposed_outcome)) ? String(d.proposed_outcome) : null;
    drafts.push({ id, category: String(d.category), protocol: d.protocol === 'task' ? 'task' : 'observed', date: String(d.date), signals: (d.signals && typeof d.signals === 'object' ? d.signals : {}) as Record<string, unknown>, excerpt, proposed_score: score, proposed_outcome: outcome, notes: scrub(clip(d.notes, 300)) });
  }
  return {
    bundle: {
      version: 1, id: /^[\w-]{8,64}$/.test(String(b.id)) ? String(b.id) : crypto.randomUUID(), created_at: new Date().toISOString(), slug,
      contributor: { handle, disclosure: clip(b.contributor?.disclosure, 500), comped: clip(b.contributor?.comped, 200) || 'none' },
      source: clip(b.source, 20) || 'imessage', assistant_handle: b.assistant_handle ? scrubHandle(clip(b.assistant_handle, 60)) : null,
      usage: b.usage && typeof b.usage === 'object' ? b.usage : null, drafts,
    },
  };
}

/** Keep the assistant's number (it is the authenticity check) but never a contributor's. */
function scrubHandle(h: string): string { return h; }

export async function POST(request: NextRequest) {
  const len = Number(request.headers.get('content-length') ?? 0);
  if (len > MAX_BYTES) return NextResponse.json({ error: 'Bundle too large' }, { status: 413 });
  let raw: unknown;
  try { raw = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  if (rateLimited(clientIp(request))) return NextResponse.json({ error: 'Too many submissions. Try again in an hour.' }, { status: 429 });
  const v = validate(raw);
  if ('error' in v) return NextResponse.json({ error: v.error }, { status: 400 });
  const b = v.bundle;
  const name = `${b.created_at.slice(0, 10)}-${b.slug}-${b.contributor.handle.replace(/^@/, '')}-${b.id.slice(0, 8)}.json`;
  const summary = [
    `**Assistant:** ${b.slug}`, `**Contributor:** ${b.contributor.handle}`, `**Source:** ${b.source}`, `**Assistant handle in export:** ${b.assistant_handle ?? '—'}`,
    `**Disclosure:** ${b.contributor.disclosure || '—'}`, `**Comped accounts:** ${b.contributor.comped}`,
    `**Drafts:** ${b.drafts.length} (${b.drafts.map(d => `${d.category}${d.proposed_score !== null ? ` ${d.proposed_score}` : ''}`).join(', ')})`,
    b.usage ? `**Usage:** ${JSON.stringify({ messages: b.usage.messages, days_active: b.usage.days_active, median_reply_s: b.usage.median_reply_s })}` : '',
    '', `Bundle: \`inbox/${name}\`. Pull with \`node scripts/contribute.mjs pull\`.`,
  ].filter(Boolean).join('\n');
  console.log('[contribute]', JSON.stringify({ id: b.id, slug: b.slug, handle: b.contributor.handle, drafts: b.drafts.length }));

  const token = process.env.CONTRIB_GITHUB_TOKEN ?? process.env.GITHUB_TOKEN;
  let fileUrl: string | null = null;
  let ticket: string | null = null;
  if (token) {
    try {
      fileUrl = await putRepoFile({ repo: CONTRIB_REPO, path: `inbox/${name}`, content: JSON.stringify(b, null, 2) + '\n', message: `Contribution: ${b.slug} from ${b.contributor.handle}`, token });
      ticket = await createIssue({ repo: CONTRIB_REPO, token, title: `Contribution: ${b.slug} from ${b.contributor.handle} (${b.drafts.length} runs)`, body: summary, labels: ['contribution'] });
    } catch (err) {
      console.error('[contribute] inbox failed', err);
    }
  }
  try {
    await sendEmail({
      subject: `Contribution: ${b.slug} from ${b.contributor.handle}`,
      rows: [['Assistant', b.slug], ['Contributor', b.contributor.handle], ['Drafts', String(b.drafts.length)], ['Inbox file', fileUrl ?? 'not stored (no token)'], ['Ticket', ticket ?? '—']],
      text: fileUrl ? summary : `${summary}\n\n--- bundle (no inbox token configured) ---\n${JSON.stringify(b).slice(0, 60_000)}`,
    });
  } catch (err) {
    console.error('[contribute] email failed', err);
  }
  return NextResponse.json({ success: true, id: b.id, ticket });
}
