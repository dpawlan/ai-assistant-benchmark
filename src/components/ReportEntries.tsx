import Link from 'next/link';
import { formatDate } from '@/lib/data';
import { getEntriesForPair } from '@/lib/reports';

/** The written record for this pair: dated entries from the reports that cover it, newest first. */
export function ReportEntries({ a, b, aName, bName }: { a: string; b: string; aName: string; bName: string }) {
  const entries = getEntriesForPair(a, b);
  if (!entries.length) return null;
  return (
    <section className="rp-entries">
      <h2 className="ag-h2">From the reports</h2>
      <p className="ag-sub">What we found when we put {aName} and {bName} through the same test, in the reports that rank them.</p>
      <ol className="rp-changes">
        {entries.map((e, i) => (
          <li key={i} className="rp-change">
            <span className="rp-change-date">{formatDate(e.change?.date ?? e.report.updated, 'short')}</span>
            <span className="rp-change-body">
              <span className="rp-change-title">{e.change ? e.change.title : `${aName} vs ${bName}`}</span>
              <span className="rp-change-text">{e.change ? e.change.body : e.matchup?.body}</span>
              <span className="rp-change-runs">
                <Link href={`/reports/${e.report.key}`} className="chip blue">{e.report.title}</Link>
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
