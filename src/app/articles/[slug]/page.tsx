import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatDate, getAgents } from '@/lib/data';
import { getArticle, getArticles, readingMinutes } from '@/lib/articles';
import { getReport, primaryPick } from '@/lib/reports';
import { comparePath } from '@/lib/compare-shared';
import { AgentIcon } from '@/components/AgentIcon';
import { Markdown } from '@/components/Markdown';
import { ReportCover } from '@/components/ReportCover';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getArticles().map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  return { title: a ? a.title : 'Article', description: a?.dek };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const agents = getAgents();
  const bySlug = Object.fromEntries(agents.map(a => [a.slug, a]));
  const report = article.report ? getReport(article.report) : null;
  const update = report && article.update ? report.updates.find(u => u.slug === article.update) ?? null : null;
  const involved = article.agents.map(s => bySlug[s]).filter(Boolean);
  const pick = report ? primaryPick(report) : null;
  const pairs: [string, string][] = [];
  for (let i = 0; i < article.agents.length; i++) for (let j = i + 1; j < article.agents.length; j++) pairs.push([article.agents[i], article.agents[j]]);
  const more = getArticles().filter(a => a.slug !== article.slug).slice(0, 3);

  return (
    <div className="wrap mid rp">
      <div className="ag-top">
        <Link href="/reports" className="back">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5l-5 5 5 5" />
          </svg>
          Reports
        </Link>
      </div>

      <div className="art">
        <header className="art-head">
          <p className="rp-eyebrow">{article.kind}</p>
          <h1 className="art-title">{article.title}</h1>
          <p className="art-dek">{article.dek}</p>
          <p className="art-byline">
            By {article.author}, {formatDate(article.date)}. {readingMinutes(article.body)} minute read.
          </p>
          <p className="rp-preview">Preview with placeholder prose.</p>
        </header>

        {(report || involved.length > 0) && (
          <div className="art-context">
            {report && (
              <Link href={`/reports/${report.key}`} className="art-context-report">
                <ReportCover report={report} bySlug={bySlug} />
                <span className="art-context-text">
                  <span className="rp-eyebrow">Related report</span>
                  <span className="art-context-title">{report.title}</span>
                  {update && <span className="art-context-sub">Written alongside the update &ldquo;{update.title}&rdquo;</span>}
                </span>
              </Link>
            )}
            {involved.length > 0 && (
              <div className="art-context-agents">
                <span className="rp-eyebrow">Assistants in this piece</span>
                <div className="rp-update-involved">
                  {involved.map(a => (
                    <Link key={a.slug} href={`/agents/${a.slug}`} className="rp-update-agent">
                      <AgentIcon name={a.name} icon={a.icon} size={28} />
                      {a.name}
                      {a.slug === pick && <span className="chip blue">Our pick</span>}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <article className="art-body">
          <Markdown body={article.body} />
        </article>

        <div className="art-foot">
          {update && report && (
            <section className="rp-section">
              <h2>The update behind this piece</h2>
              <ol className="rp-updates">
                <li className="rp-update">
                  <span className="rp-update-date">{formatDate(update.date, 'short')}</span>
                  <span className="rp-update-body">
                    <Link href={`/reports/${report.key}/updates/${update.slug}`} className="rp-update-title">{update.title}</Link>
                    <span className="rp-update-text">{update.paragraphs[0]}</span>
                    <span className="rp-update-foot"><Link href={`/reports/${report.key}/updates/${update.slug}`}>Read the update</Link></span>
                  </span>
                </li>
              </ol>
            </section>
          )}
          {pairs.length > 0 && (
            <section className="rp-section">
              <h2>Head to heads mentioned</h2>
              <div className="rp-runs">
                {pairs.map(([a, b]) => bySlug[a] && bySlug[b] && (
                  <Link key={a + b} href={comparePath(a, b, report ? [report.dimension] : [])} className="chip">
                    {bySlug[a].name} vs {bySlug[b].name}
                  </Link>
                ))}
              </div>
            </section>
          )}
          {more.length > 0 && (
            <section className="rp-section">
              <h2>More writing</h2>
              <ul className="rp-other-updates">
                {more.map(a => (
                  <li key={a.slug}>
                    <span className="rp-update-date">{formatDate(a.date, 'short')}</span>
                    <Link href={`/articles/${a.slug}`}>{a.title}</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
