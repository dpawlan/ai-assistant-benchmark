import Link from 'next/link';
import { Metadata } from 'next';
import { formatDate, getAgents } from '@/lib/data';
import { getReports, primaryPick } from '@/lib/reports';
import { AgentIcon } from '@/components/AgentIcon';
import type { Agent } from '@/lib/types';
import { ReportCover } from '@/components/ReportCover';
import { getArticles } from '@/lib/articles';
import { ArticleCard } from '@/components/ArticleCard';

export const metadata: Metadata = { title: 'Reports' };

export default function ReportsPage() {
  const reports = getReports();
  const bySlug = Object.fromEntries(getAgents().map(a => [a.slug, a]));
  const [featured, ...rest] = reports;
  const articles = getArticles();
  const byKey = Object.fromEntries(reports.map(r => [r.key, r]));
  return (
    <div className="wrap mid">
      <div className="page-head">
        <h1 className="page-title">Reports</h1>
        <p className="page-sub">
          One report per question you would actually ask, kept current. Every pick comes from runs of the same published test, and every update names the run behind it.
        </p>
      </div>
      {reports.length === 0 && (
        <div className="rp-soon">
          <p className="rp-soon-title">Assistant Consumer Reports are coming soon.</p>
          <p>The first one covers shopping: which assistant should buy things for you, ranked from the same purchasing test, with a pick and a dated log of every change. Until then, the writing below is where the verdicts get argued.</p>
        </div>
      )}
      {reports.some(r => r.preview) && <p className="rp-preview">Preview with placeholder prose. Scores in the tables are real; the write-ups are illustrative.</p>}

      {featured && (
        <Link href={`/reports/${featured.key}`} className="rp-featured">
          <ReportCover report={featured} bySlug={bySlug} size="hero" />
          <span className="rp-featured-text">
            <span className="rp-eyebrow">Updated {formatDate(featured.updated)}</span>
            <span className="rp-featured-title">{featured.title}</span>
            <span className="rp-featured-dek">{featured.excerpt}</span>
            <PickLine slug={primaryPick(featured)} bySlug={bySlug} />
          </span>
        </Link>
      )}

      <div className="rp-grid">
        {rest.map(r => (
          <Link key={r.key} href={`/reports/${r.key}`} className="rp-card">
            <ReportCover report={r} bySlug={bySlug} />
            <span className="rp-card-text">
              <span className="rp-eyebrow">Updated {formatDate(r.updated)}</span>
              <span className="rp-card-title">{r.title}</span>
              <span className="rp-card-dek">{r.question}</span>
              <PickLine slug={primaryPick(r)} bySlug={bySlug} />
            </span>
          </Link>
        ))}
      </div>

      {articles.length > 0 && (
        <section className="rp-writing">
          <div className="rp-writing-head">
            <div className="rp-writing-row">
              <h2 className="ag-h2">Latest writing</h2>
              <Link href="/articles" className="rp-writing-all">All writing</Link>
            </div>
            <p className="ag-sub">Analysis and opinion, dated and signed. Reports carry the verdicts; this is where we argue about them.</p>
          </div>
          <div className="rp-writing-list">
            {articles.slice(0, 4).map(a => <ArticleCard key={a.slug} article={a} report={a.report ? byKey[a.report] ?? null : null} bySlug={bySlug} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function PickLine({ slug, bySlug }: { slug: string; bySlug: Record<string, Agent> }) {
  const a = bySlug[slug];
  if (!a) return null;
  return (
    <span className="rp-pickline">
      <AgentIcon name={a.name} icon={a.icon} size={20} className="rp-pickline-icon" />
      Our pick: <b>{a.name}</b>
    </span>
  );
}
