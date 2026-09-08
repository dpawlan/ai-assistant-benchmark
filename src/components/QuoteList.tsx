'use client';

import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { useState } from 'react';
import { Feedback, FeedbackKind } from '@/lib/types';
import { KIND_LABEL, QuoteItem } from './QuoteItem';

const PAGE = 20;
const KIND_ORDER: FeedbackKind[] = ['praise', 'use-case', 'comparison', 'complaint', 'bug', 'feature-request', 'other'];
const HASH_PREFIX = '#quotes=';

export type AttributedFeedback = Feedback & { categories: string[] };

interface QuoteListProps {
  feedback: AttributedFeedback[];
  categoryLabels: Record<string, string>;
}

/* The category filter lives in the URL hash (#quotes=<key>) so score rows can link straight to it. */
function subscribe(cb: () => void) {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
}
const getHash = () => window.location.hash;
const getServerHash = () => '';

function categoryFromHash(hash: string): string {
  return hash.startsWith(HASH_PREFIX) ? decodeURIComponent(hash.slice(HASH_PREFIX.length)) : '';
}

export function QuoteList({ feedback, categoryLabels }: QuoteListProps) {
  const hash = useSyncExternalStore(subscribe, getHash, getServerHash);
  const category = categoryFromHash(hash);
  const [kind, setKind] = useState<FeedbackKind | 'all'>('all');
  const [limit, setLimit] = useState(PAGE);

  useEffect(() => {
    if (category) document.getElementById('quotes')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [category]);

  const kindCounts = useMemo(() => {
    const c = new Map<string, number>();
    for (const f of feedback) c.set(f.kind, (c.get(f.kind) ?? 0) + 1);
    return c;
  }, [feedback]);

  const categoryCounts = useMemo(() => {
    const c = new Map<string, number>();
    for (const f of feedback) for (const k of f.categories) c.set(k, (c.get(k) ?? 0) + 1);
    return c;
  }, [feedback]);

  const visible = useMemo(() => {
    let list = feedback;
    if (kind !== 'all') list = list.filter(f => f.kind === kind);
    if (category) list = list.filter(f => f.categories.includes(category));
    return [...list].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [feedback, kind, category]);

  const setCategory = (key: string) => {
    const url = key ? `${HASH_PREFIX}${encodeURIComponent(key)}` : window.location.pathname + window.location.search;
    window.history.replaceState(null, '', url);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    setLimit(PAGE);
  };

  if (feedback.length === 0) {
    return <p className="empty-state">Quotes appear here as they are collected from public posts.</p>;
  }

  const kinds = KIND_ORDER.filter(k => kindCounts.has(k));
  const categoryKeys = Object.keys(categoryLabels).filter(k => categoryCounts.has(k));

  return (
    <div id="quotes" style={{ scrollMarginTop: 24 }}>
      <div className="filter-row" role="group" aria-label="Filter quotes">
        <button type="button" className={`fpill${kind === 'all' ? ' on' : ''}`} onClick={() => { setKind('all'); setLimit(PAGE); }}>
          All<span className="n">{feedback.length}</span>
        </button>
        {kinds.map(k => (
          <button key={k} type="button" className={`fpill${kind === k ? ' on' : ''}`} onClick={() => { setKind(k); setLimit(PAGE); }}>
            {KIND_LABEL[k]}
            <span className="n">{kindCounts.get(k)}</span>
          </button>
        ))}
        {categoryKeys.length > 0 && (
          <label className={`fselect${category ? ' on' : ''}`}>
            <span className="sr-only">Category</span>
            <select value={category} onChange={e => setCategory(e.target.value)} aria-label="Filter by category">
              <option value="">Any category</option>
              {categoryKeys.map(k => (
                <option key={k} value={k}>
                  {categoryLabels[k]} ({categoryCounts.get(k)})
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="empty-state">
          No {kind === 'all' ? '' : `${KIND_LABEL[kind].toLowerCase()} `}quotes about {categoryLabels[category]?.toLowerCase() ?? 'that'} yet.
        </p>
      ) : (
        <div>
          {visible.slice(0, limit).map(item => (
            <QuoteItem key={item.id} quote={item} categories={item.categories} categoryLabels={categoryLabels} />
          ))}
        </div>
      )}

      {visible.length > limit && (
        <button type="button" className="more" onClick={() => setLimit(l => l + PAGE)}>
          Show {Math.min(PAGE, visible.length - limit)} more
        </button>
      )}
    </div>
  );
}
