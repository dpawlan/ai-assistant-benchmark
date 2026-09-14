'use client';

import Link from 'next/link';
import { track } from '@vercel/analytics';
import { JobGroup } from '@/lib/types';

/** Group chips plus a Top / New toggle. Links, so the page works without JS and stays crawlable. */
export function UseCaseFilters({ groups, group, sort }: { groups: JobGroup[]; group: string | null; sort: 'top' | 'new' }) {
  const href = (g: string | null, s: 'top' | 'new') => {
    const p = new URLSearchParams();
    if (g) p.set('group', g);
    if (s !== 'top') p.set('sort', s);
    const q = p.toString();
    return q ? `/use-cases?${q}` : '/use-cases';
  };
  return (
    <div className="uc-filters" aria-label="Filter use cases">
      <Link href={href(null, sort)} className={`chip${group ? '' : ' blue'}`} onClick={() => track('uc_filter', { group: 'all' })}>
        All
      </Link>
      {groups.map(g => (
        <Link key={g.key} href={href(g.key, sort)} className={`chip${group === g.key ? ' blue' : ''}`} onClick={() => track('uc_filter', { group: g.key })}>
          {g.label}
        </Link>
      ))}
      <span className="sep" aria-hidden="true" />
      <Link href={href(group, 'top')} className={`chip${sort === 'top' ? ' blue' : ''}`} onClick={() => track('uc_filter', { sort: 'top' })}>
        Top
      </Link>
      <Link href={href(group, 'new')} className={`chip${sort === 'new' ? ' blue' : ''}`} onClick={() => track('uc_filter', { sort: 'new' })}>
        New
      </Link>
    </div>
  );
}
