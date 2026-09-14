'use client';

import { useState, useSyncExternalStore } from 'react';
import { track } from '@vercel/analytics';

const STORE = 'abv:voted';

function readVoted(): string[] {
  try {
    const raw = localStorage.getItem(STORE);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((k): k is string => typeof k === 'string') : [];
  } catch {
    return [];
  }
}

const listeners = new Set<() => void>();
function remember(job: string) {
  try {
    const next = [...new Set([...readVoted(), job])];
    localStorage.setItem(STORE, JSON.stringify(next));
  } catch {
    /* storage unavailable: the server-side cookie still prevents a double count */
  }
  listeners.forEach(l => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  window.addEventListener('storage', l);
  return () => {
    listeners.delete(l);
    window.removeEventListener('storage', l);
  };
}

/** One upvote per browser per job. Optimistic; reverts if the server says no. */
export function VoteButton({ job, initialVotes, compact = false }: { job: string; initialVotes: number; compact?: boolean }) {
  const [votes, setVotes] = useState(initialVotes);
  const [clicked, setClicked] = useState(false);
  const [pending, setPending] = useState(false);
  // Server renders "not voted"; the browser reads localStorage after hydration without a state update in an effect.
  const stored = useSyncExternalStore(subscribe, () => readVoted().includes(job), () => false);
  const voted = clicked || stored;

  const vote = async () => {
    if (voted || pending) return;
    setPending(true);
    setClicked(true);
    setVotes(v => v + 1);
    try {
      const res = await fetch('/api/vote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ job }) });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { votes: number; stored: boolean };
      if (data.stored) setVotes(data.votes);
      remember(job);
      track('uc_vote', { job });
    } catch {
      setClicked(false);
      setVotes(v => Math.max(0, v - 1));
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      className={`uc-vote${voted ? ' on' : ''}`}
      onClick={vote}
      disabled={pending || voted}
      aria-pressed={voted}
      title={voted ? 'Upvoted' : 'Upvote this use case'}
    >
      <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
        <path d="M6 1.5l4.5 6h-9z" />
      </svg>
      {votes}
      {!compact && <span>{voted ? 'Upvoted' : 'Upvote'}</span>}
    </button>
  );
}
