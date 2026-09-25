import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatDate, getAgents } from '@/lib/data';
import { getArticle, getArticles, readingMinutes } from '@/lib/articles';
import { getReport, primaryPick } from '@/lib/reports';
import { comparePath } from '@/lib/compare-shared';
import { AgentIcon } from '@/components/AgentIcon';
import { ScoreCell } from '@/components/ScoreCell';
import { Markdown } from '@/components/Markdown';
import { ReportCover } from '@/components/ReportCover';
import { ArticleHero } from '@/components/ArticleHero';
import { ArticleCard } from '@/components/ArticleCard';
import { getAuthorByName } from '@/lib/authors';
import { AuthorAvatar } from '@/components/AuthorAvatar';

interface Props {
  params: Promise<{ slug: string }>;
}

const SITE = 'https://assistantbenchmark.com';

export function generateStaticParams() {
  return getArticles().map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return { title: 'Article' };
  const image = `/og/articles/${a.slug}.png`;
  return {
    title: a.title,
    description: a.dek,
    openGraph: { title: a.title, description: a.dek, type: 'article', url: `${SITE}/articles/${a.slug}`, images: [{ url: image, width: 2400, height: 1260, alt: a.title }] },
    twitter: { card: 'summary_large_image', title: a.title, description: a.dek, images: [image] },
  };
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
  const pickAgent = pick ? bySlug[pick] : null;
  const pairs: [string, string][] = [];
  for (let i = 0; i < article.agents.length; i++) for (let j = i + 1; j < article.agents.length; j++) pairs.push([article.agents[i], article.agents[j]]);
  const more = getArticles().filter(a => a.slug !== article.slug).slice(0, 2);
  const url = `${SITE}/articles/${article.slug}`;
  const share = `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(url)}`;
  const author = getAuthorByName(article.author);
  const authorHref = author ? `/authors/${author.slug}` : null;

  return (
    <div className="wrap mid art-wrap">
      <div className="ag-top">
        <Link href="/articles" className="back">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5l-5 5 5 5" />
          </svg>
          Writing
        </Link>
      </div>

      <article className="art">
        <header className="art-head">
          <p className="art-kicker">
            <span>{article.kind}</span>
            {report && <Link href={`/reports/${report.key}`}>{report.title}</Link>}
          </p>
          <h1 className="art-title">{article.title}</h1>
          <p className="art-dek">{article.dek}</p>
          <div className="art-byline">
            <AuthorAvatar author={author} name={article.author} size={36} />
            <span className="art-byline-text">
              <span className="art-author">{authorHref ? <Link href={authorHref}>By {article.author}</Link> : `By ${article.author}`}</span>
              <span className="art-date">{formatDate(article.date)}. {readingMinutes(article.body)} minute read.</span>
            </span>
            <a className="art-share" href={share} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-7.4 8.5L23 22h-6.8l-5.3-6.9L4.8 22H1.7l7.9-9L0 2h7l4.8 6.3L18.9 2zm-1.2 18h1.9L6.4 3.9H4.4L17.7 20z"/></svg>
              Share
            </a>
          </div>
          {article.preview && <p className="rp-preview">Preview with placeholder prose.</p>}
        </header>

        <ArticleHero article={article} report={report} agents={involved} bySlug={bySlug} />

        {article.takeaways.length > 0 && (
          <aside className="art-short">
            <p className="art-short-head">The short version</p>
            <ul>{article.takeaways.map((t, i) => <li key={i}>{t}</li>)}</ul>
          </aside>
        )}

        <div className="art-body">
          <Markdown body={article.body} />
        </div>

        {report && (
          <Link href={`/reports/${report.key}`} className="art-report-card">
            <ReportCover report={report} bySlug={bySlug} />
            <span className="art-report-text">
              <span className="rp-eyebrow">The report behind this piece</span>
              <span className="art-report-title">{report.title}</span>
              {pickAgent && (
                <span className="art-report-pick">
                  <AgentIcon name={pickAgent.name} icon={pickAgent.icon} size={24} className="rp-pickline-icon" />
                  Our pick: <b>{pickAgent.name}</b>
                  <ScoreCell value={pickAgent.scores[report.dimension]} />
                </span>
              )}
              <span className="art-report-sub">Updated {formatDate(report.updated)}. {report.competition.length + report.picks.length} assistants ranked.</span>
            </span>
          </Link>
        )}

        <div className="art-author-box">
          <AuthorAvatar author={author} name={article.author} size={52} />
          <span>
            <span className="art-author-name">{authorHref ? <Link href={authorHref}>{article.author}</Link> : article.author}</span>
            {author?.role && <span className="art-author-role">{author.role}</span>}
            <span className="art-author-bio">{author ? author.bio : ''} {authorHref && <Link href={authorHref}>More from {article.author.split(' ')[0]}</Link>}</span>
          </span>
        </div>

        <div className="art-foot">
          {update && report && (
            <section className="art-foot-section">
              <h2>The update behind this piece</h2>
              <ol className="rp-updates">
                <li className="rp-update">
                  <span className="rp-update-date">{formatDate(update.date, 'short')}</span>
                  <span className="rp-update-body">
                    <Link href={`/reports/${report.key}/updates/${update.slug}`} className="rp-update-title">{update.title}</Link>
                    <span className="rp-update-text">{update.excerpt}</span>
                    <span className="rp-update-foot"><Link href={`/reports/${report.key}/updates/${update.slug}`}>Read the update</Link></span>
                  </span>
                </li>
              </ol>
            </section>
          )}
          {pairs.length > 0 && (
            <section className="art-foot-section">
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
        </div>
      </article>

      {more.length > 0 && (
        <section className="art-more">
          <h2 className="ag-h2">More writing</h2>
          <div className="art-more-grid">
            {more.map(a => <ArticleCard key={a.slug} article={a} report={a.report ? getReport(a.report) : null} bySlug={bySlug} />)}
          </div>
        </section>
      )}
    </div>
  );
}
