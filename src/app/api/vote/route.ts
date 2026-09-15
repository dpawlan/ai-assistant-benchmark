import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getJobKeys } from '@/lib/data';
import { clientIp, makeRateLimiter } from '@/lib/inbox';
import { JOB_KEY_RE, VOTES_ENABLED, castVote, getVoteCounts } from '@/lib/votes';

/**
 * Upvotes for use cases. POST {job} casts one vote per browser (an httpOnly cookie `abv` identifies the voter);
 * a repeat is idempotent and returns the current count. GET ?jobs=a,b returns counts. Without Redis env the
 * POST still succeeds with stored:false so the flow can be exercised locally.
 */

const COOKIE = 'abv';
const VOTER_RE = /^[0-9a-f-]{36}$/;
const rateLimited = makeRateLimiter(30, 10 * 60 * 1000);
const NO_STORE = { 'Cache-Control': 'no-store' };

function validJob(job: unknown): job is string {
  return typeof job === 'string' && JOB_KEY_RE.test(job) && getJobKeys().includes(job);
}

export async function POST(request: NextRequest) {
  let payload: { job?: unknown };
  try {
    payload = (await request.json()) as { job?: unknown };
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400, headers: NO_STORE });
  }
  if (!validJob(payload.job)) return NextResponse.json({ error: 'Unknown job' }, { status: 400, headers: NO_STORE });
  if (rateLimited(clientIp(request))) return NextResponse.json({ error: 'Too many votes. Try again in a few minutes.' }, { status: 429, headers: NO_STORE });

  const store = await cookies();
  let voter = store.get(COOKIE)?.value ?? '';
  if (!VOTER_RE.test(voter)) {
    voter = crypto.randomUUID();
    store.set({ name: COOKIE, value: voter, httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 31_536_000 });
  }

  try {
    const result = await castVote(payload.job, voter);
    return NextResponse.json({ votes: result.votes, voted: true, stored: result.stored }, { headers: NO_STORE });
  } catch (err) {
    console.error('[vote] redis failed', err);
    return NextResponse.json({ error: 'Votes are unavailable right now' }, { status: 503, headers: NO_STORE });
  }
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('jobs') ?? '';
  const keys = raw
    .split(',')
    .map(k => k.trim())
    .filter(k => JOB_KEY_RE.test(k))
    .slice(0, 100);
  const counts = VOTES_ENABLED ? await getVoteCounts(keys) : Object.fromEntries(keys.map(k => [k, 0]));
  return NextResponse.json({ counts }, { headers: NO_STORE });
}
