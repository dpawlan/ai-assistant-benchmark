import Link from 'next/link';
import { formatDate } from '@/lib/data';
import { getEntriesForPair, updatePath } from '@/lib/reports';
import { getArticleForUpdate, getArticlesForPair } from '@/lib/articles';

/**
 * What the reports say about this pair. Each update is linkable on its own page and anchored
 * here as #update-<slug>; the comparison write-up anchors to the report's competition entry.
 */
export function ReportEntries({ a, b, aName, bName, focus = [] }: { a: string; b: string; aName: string; bName: string; focus?: string[] }) {
  const entries = getEntriesForPair(a, b, focus);
  const articles = getArticlesForPair(a, b).filter(x => !entries.some(e => e.update && x.update === e.update.slug && x.report === e.report.key));
  if (!entries.length && !articles.length) return null;
  return (
    <section className="rp-entries" id="from-the-reports">
      <h2 className="ag-h2">From the reports</h2>
      <p className="ag-sub">What we wrote when {aName} and {bName} took the same test. Every update here has its own page you can link to.</p>
      <ol className="rp-updates">
        {entries.map(e => {
          if (e.update) {
            const u = e.update;
            return (
              <li key={`u-${u.slug}`} id={`update-${u.slug}`} className="rp-update">
                <span className="rp-update-date">{formatDate(u.date, 'short')}</span>
                <span className="rp-update-body">
                  <Link href={updatePath(e.report, u)} className="rp-update-title">{u.title}</Link>
                  <span className="rp-update-text">{u.excerpt}</span>
                  <span className="rp-update-foot">
                    <Link href={updatePath(e.report, u)}>Read the update</Link>
                    {getArticleForUpdate(e.report.key, u.slug) && <Link href={`/articles/${getArticleForUpdate(e.report.key, u.slug)!.slug}`} className="rp-take">Read our take</Link>}
                    <Link href={`/reports/${e.report.key}`} className="chip blue">{e.report.title}</Link>
                  </span>
                </span>
              </li>
            );
          }
          if (e.section) {
            const ps = e.section;
            return (
              <li key={`s-${e.report.key}-${ps.slug}`} className="rp-update">
                <span className="rp-update-date">{formatDate(e.date, 'short')}</span>
                <span className="rp-update-body">
                  <Link href={`/reports/${e.report.key}#pick-${ps.slug}`} className="rp-update-title">{ps.heading}, from {e.report.title}</Link>
                  <span className="rp-update-text">{ps.excerpt}</span>
                  <span className="rp-update-foot">
                    <Link href={`/reports/${e.report.key}#pick-${ps.slug}`}>Read it in the report</Link>
                  </span>
                </span>
              </li>
            );
          }
          const c = e.competitor!;
          return (
            <li key={`c-${e.report.key}-${c.slug}`} className="rp-update">
              <span className="rp-update-date">{formatDate(e.date, 'short')}</span>
              <span className="rp-update-body">
                <Link href={`/reports/${e.report.key}#competition-${c.slug}`} className="rp-update-title">From {e.report.title}</Link>
                <span className="rp-update-text">{c.excerpt}</span>
                <span className="rp-update-foot">
                  <Link href={`/reports/${e.report.key}#competition-${c.slug}`}>Read it in the report</Link>
                </span>
              </span>
            </li>
          );
        })}
        {articles.map(x => (
          <li key={`a-${x.slug}`} className="rp-update">
            <span className="rp-update-date">{formatDate(x.date, 'short')}</span>
            <span className="rp-update-body">
              <Link href={`/articles/${x.slug}`} className="rp-update-title">{x.title}</Link>
              <span className="rp-update-text">{x.dek}</span>
              <span className="rp-update-foot"><Link href={`/articles/${x.slug}`}>Read the article</Link><span className="chip">{x.kind}</span></span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
