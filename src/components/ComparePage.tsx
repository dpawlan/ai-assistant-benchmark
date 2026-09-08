import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Scorecard } from './Scorecard';
import { buildComparison, cardPath, comparePath, parseFocus, parsePair, verdict } from '@/lib/compare';

/** Shared by /compare/[pair] and /compare/[pair]/[focus]. */
export function compareMetadata(pair: string, focusRaw?: string): Metadata {
  const parsed = parsePair(pair);
  const c = parsed && buildComparison(parsed[0], parsed[1]);
  if (!c) return { title: 'Not found' };
  const focus = parseFocus(focusRaw);
  const v = verdict(c, focus);
  const title = `${c.a.name} vs ${c.b.name}`;
  const description = `${v.headline}. ${v.detail} Every dimension scored on the same published test, with the thread behind each number.`;
  const image = cardPath(c.a.slug, c.b.slug, focus);
  return {
    title,
    description,
    alternates: { canonical: comparePath(c.a.slug, c.b.slug, focus) },
    openGraph: {
      title: `${title} | Assistant Benchmark`,
      description: `${v.headline}. ${v.detail}`,
      images: [{ url: image, width: 1200, height: 630, alt: `${title} scorecard` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Assistant Benchmark`,
      description: `${v.headline}. ${v.detail}`,
      images: [image],
    },
  };
}

export function ComparePage({ pair, focusRaw }: { pair: string; focusRaw?: string }) {
  const parsed = parsePair(pair);
  const c = parsed && buildComparison(parsed[0], parsed[1]);
  if (!c) notFound();
  const focus = parseFocus(focusRaw);
  const untested = [c.a, c.b].filter(s => s.testedCount === 0);

  return (
    <div className="wrap">
      <div className="ag-top">
        <Link href="/compare" className="back">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5l-5 5 5 5" />
          </svg>
          Head to head
        </Link>
      </div>

      <div className="page-head" style={{ paddingTop: 18 }}>
        <p className="cat-kicker">Head to head</p>
        <h1 className="page-title">
          {c.a.name} vs {c.b.name}
        </h1>
        <p className="page-sub">
          Same {c.rows.length} tests, same scale. The check goes to the higher score.
        </p>
      </div>

      {untested.length > 0 && (
        <div className="note-card hh-untested">
          {untested.map(s => s.name).join(' and ')} {untested.length === 1 ? 'has' : 'have'} not been tested yet, so no row can be decided against {untested.length === 1 ? 'it' : 'them'}.{' '}
          <Link href="/request">Request a test</Link>
        </div>
      )}

      <Scorecard comparison={c} initialFocus={focus} />

      <p className="hh-foot">
        Scores come from logged runs of the published tests; see <Link href="/dimensions#how">how scoring works</Link>. Nothing here is sponsored.
      </p>
    </div>
  );
}
