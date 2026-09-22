import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatDate, getAgents } from '@/lib/data';
import { getAuthor, getAuthors } from '@/lib/authors';
import { getArticles } from '@/lib/articles';
import { getReport, getReports, primaryPick } from '@/lib/reports';
import { AuthorAvatar } from '@/components/AuthorAvatar';
import { ArticleCard } from '@/components/ArticleCard';
import { ReportCover } from '@/components/ReportCover';
import { AgentIcon } from '@/components/AgentIcon';

interface Props {
  params: Promise<{ slug: string }>;
}

const SITE = 'https://assistantbenchmark.com';

export function generateStaticParams() {
  return getAuthors().map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = getAuthor(slug);
  return { title: a ? a.name : 'Author', description: a?.role };
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();
  const bySlug = Object.fromEntries(getAgents().map(a => [a.slug, a]));
  const articles = getArticles().filter(a => a.author === author.name);
  const reports = getReports().filter(r => (r.author ?? 'david-pawlan') === author.slug);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.role,
    description: author.bio,
    url: `${SITE}/authors/${author.slug}`,
    sameAs: author.links.filter(l => l.url.startsWith('http')).map(l => l.url),
    worksFor: { '@type': 'Organization', name: 'Assistant Benchmark', url: SITE },
  };

  return (
    <div className="wrap mid au">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="ag-top">
        <Link href="/reports" className="back">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5l-5 5 5 5" />
          </svg>
          Reports
        </Link>
      </div>

      <header className="au-head">
        <AuthorAvatar author={author} size={112} className="au-photo" />
        <div className="au-head-text">
          <p className="rp-eyebrow">Author</p>
          <h1 className="au-name">{author.name}</h1>
          <p className="au-role">{author.role}</p>
          <p className="au-bio">{author.bio}</p>
          <p className="au-links">
            {author.links.map((l, i) => (
              <span key={l.url}>
                {i > 0 && <span className="au-sep" aria-hidden="true" />}
                <a href={l.url} target={l.url.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{l.label}</a>
              </span>
            ))}
          </p>
        </div>
      </header>

      <section className="au-trust">
        <h2 className="ag-h2">Why you can trust this</h2>
        <ul>{author.trust.map((t, i) => <li key={i}>{t}</li>)}</ul>
        <p className="au-trust-foot"><Link href="/dimensions#how">How scoring works</Link></p>
      </section>

      <div className="au-body">
        {reports.length > 0 && (
          <section className="au-section">
            <h2 className="ag-h2">Reports</h2>
            <p className="ag-sub">{reports.length === 1 ? 'One report' : `${reports.length} reports`}, kept current.</p>
            <div className="au-reports">
              {reports.map(r => {
                const pick = bySlug[primaryPick(r)];
                return (
                  <Link key={r.key} href={`/reports/${r.key}`} className="au-report">
                    <ReportCover report={r} bySlug={bySlug} />
                    <span className="au-report-text">
                      <span className="rp-eyebrow">Updated {formatDate(r.updated)}</span>
                      <span className="au-report-title">{r.title}</span>
                      {pick && (
                        <span className="rp-pickline">
                          <AgentIcon name={pick.name} icon={pick.icon} size={20} className="rp-pickline-icon" />
                          Our pick: <b>{pick.name}</b>
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {articles.length > 0 && (
          <section className="au-section">
            <h2 className="ag-h2">Writing</h2>
            <p className="ag-sub">{articles.length === 1 ? 'One piece' : `${articles.length} pieces`}, newest first.</p>
            <div className="rp-writing-list">
              {articles.map(a => <ArticleCard key={a.slug} article={a} report={a.report ? getReport(a.report) : null} bySlug={bySlug} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
