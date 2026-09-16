'use client';

import Link from 'next/link';
import { track } from '@vercel/analytics';
import { JobGroup } from '@/lib/types';
import { UseCaseSearch } from './UseCaseSearch';

interface UseCaseFiltersProps {
  groups: JobGroup[];
  group: string | null;
  sort: 'top' | 'new';
  q: string;
}

/** Search box (live), group chips and a Top / New toggle. Chips are plain links so the page works without JS. */
export function UseCaseFilters({ groups, group, sort, q }: UseCaseFiltersProps) {
  const href = (g: string | null, s: 'top' | 'new', query = q) => {
    const p = new URLSearchParams();
    if (g) p.set('group', g);
    if (s !== 'top') p.set('sort', s);
    if (query) p.set('q', query);
    const qs = p.toString();
    return qs ? `/use-cases?${qs}` : '/use-cases';
  };
  return (
    <>
      <UseCaseSearch initial={q} group={group} sort={sort} />
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
    </>
  );
}
