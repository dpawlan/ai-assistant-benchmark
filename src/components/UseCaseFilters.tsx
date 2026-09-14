'use client';

import Link from 'next/link';
import { track } from '@vercel/analytics';
import { JobGroup } from '@/lib/types';

interface UseCaseFiltersProps {
  groups: JobGroup[];
  group: string | null;
  sort: 'top' | 'new';
  q: string;
}

/** Search box, group chips and a Top / New toggle. Plain links and a GET form, so it works without JS and stays crawlable. */
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
      <form className="uc-search" action="/use-cases" method="get" role="search">
        <input
          type="search"
          name="q"
          className="input"
          defaultValue={q}
          placeholder="Search jobs, assistants, prompts"
          aria-label="Search use cases"
          maxLength={80}
          onBlur={e => e.target.value.trim() && track('uc_filter', { q: e.target.value.trim().slice(0, 40) })}
        />
        {group && <input type="hidden" name="group" value={group} />}
        {sort !== 'top' && <input type="hidden" name="sort" value={sort} />}
        <button type="submit" className="btn ghost">
          Search
        </button>
        {q && (
          <Link href={href(group, sort, '')} className="chip">
            Clear
          </Link>
        )}
      </form>
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
