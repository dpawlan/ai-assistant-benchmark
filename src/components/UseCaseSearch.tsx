'use client';

import { useEffect, useRef, useState } from 'react';
import { track } from '@vercel/analytics';

/**
 * Live search over the cards already on the page. Each card carries data-search (its lower-cased text); typing hides the
 * ones that don't match every word. Submitting the form still does a server-side search, so the URL stays shareable.
 */
export function UseCaseSearch({ initial, group, sort }: { initial: string; group: string | null; sort: 'top' | 'new' }) {
  const [q, setQ] = useState(initial);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const cards = document.querySelectorAll<HTMLElement>('.uc-list > li[data-search]');
    let off = 0;
    cards.forEach(card => {
      const hay = card.dataset.search ?? '';
      const show = words.every(w => hay.includes(w));
      card.hidden = !show;
      if (!show) off++;
    });
    const empty = document.getElementById('uc-empty');
    if (empty) empty.hidden = !(cards.length > 0 && off === cards.length);
    const count = document.getElementById('uc-search-count');
    if (count) {
      count.textContent = off > 0 ? `${off} hidden` : '';
      count.hidden = !(q && off > 0);
    }
    // Keep the URL in step without a navigation, so reload and share keep the query.
    const url = new URL(window.location.href);
    if (q) url.searchParams.set('q', q);
    else url.searchParams.delete('q');
    window.history.replaceState(null, '', url.pathname + (url.search ? url.search : ''));
    if (timer.current) window.clearTimeout(timer.current);
    if (q.trim()) timer.current = window.setTimeout(() => track('uc_filter', { q: q.trim().slice(0, 40) }), 800);
  }, [q]);

  return (
    <form className="uc-search" action="/use-cases" method="get" role="search" onSubmit={e => e.preventDefault()}>
      <input
        type="search"
        name="q"
        className="input"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Search jobs, assistants, prompts"
        aria-label="Search use cases"
        maxLength={80}
        autoComplete="off"
      />
      {group && <input type="hidden" name="group" value={group} />}
      {sort !== 'top' && <input type="hidden" name="sort" value={sort} />}
      {q && (
        <button type="button" className="chip" onClick={() => setQ('')}>
          Clear
        </button>
      )}
      <span className="uc-search-count" id="uc-search-count" hidden />
    </form>
  );
}
