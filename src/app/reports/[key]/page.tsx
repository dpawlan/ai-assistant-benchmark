import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatDate, getAgents, getCategory, rankByCategory } from '@/lib/data';
import { getReport, getReports, primaryPick, updatePath } from '@/lib/reports';
import { comparePath } from '@/lib/compare-shared';
import { AgentIcon } from '@/components/AgentIcon';
import { ScoreCell } from '@/components/ScoreCell';
import { ReportCover } from '@/components/ReportCover';
import { Markdown } from '@/components/Markdown';
import { getArticleForUpdate, getArticlesForReport } from '@/lib/articles';
import { ArticleCard } from '@/components/ArticleCard';
import { getAuthor } from '@/lib/authors';
import { AuthorAvatar } from '@/components/AuthorAvatar';

interface Props {
  params: Promise<{ key: string }>;
}

export function generateStaticParams() {
  return getReports().map(r => ({ key: r.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { key } = await params;
  const r = getReport(key);
  return { title: r ? r.title : 'Report' };
}

export default async function ReportPage({ params }: Props) {
  const { key } = await params;
  const report = getReport(key);
  if (!report) notFound();
  const agents = getAgents();
  const bySlug = Object.fromEntries(agents.map(a => [a.slug, a]));
  const category = getCategory(report.dimension);
  const ranked = rankByCategory(agents, report.dimension).filter(a => typeof a.scores[report.dimension] === 'number');
  const runCount = agents.reduce((n, a) => n + Object.values(a.latestRuns).filter(r => r.category === report.dimension).length, 0);
  const pick = primaryPick(report);
  const pickAgent = bySlug[pick];
  const articles = getArticlesForReport(report.key);
  const author = getAuthor(report.author ?? 'david-pawlan');

  const toc: { id: string; label: string }[] = [
    { id: 'everyone', label: 'Everyone tested' },
    ...report.sections.map(s =>
      s.type === 'who' ? { id: 'who', label: 'Who this is for' }
      : s.type === 'how' ? { id: 'how', label: 'How we tested' }
      : s.type === 'pick' ? { id: `pick-${s.section.slug}`, label: s.section.heading }
      : s.type === 'competition' ? { id: 'competition', label: 'The competition' }
      : s.type === 'ahead' ? { id: 'ahead', label: 'What to look forward to' }
      : { id: s.id, label: s.heading }),
    ...(report.updates.length ? [{ id: 'updates', label: 'Updates' }] : []),
    ...(articles.length ? [{ id: 'writing', label: 'Writing about this report' }] : []),
  ];

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

      <header className="rp-hero">
        <div className="rp-hero-text">
          <p className="rp-eyebrow">{category?.label ?? report.dimension}</p>
          <h1 className="rp-title">{report.title}</h1>
          <p className="rp-dek">{report.question}</p>
          <div className="rp-author">
            {author && <AuthorAvatar author={author} size={32} />}
            <span className="rp-author-text">
              {author ? <Link href={`/authors/${author.slug}`}>By {author.name}</Link> : null}
              <span>Updated {formatDate(report.updated)}. Published {formatDate(report.published)}.</span>
            </span>
          </div>
          <p className="rp-byline">
            {ranked.length} assistants tested, {runCount} runs of the same task.
          </p>
          {report.preview && <p className="rp-preview">Preview with placeholder prose. Scores are real; the write-up is illustrative.</p>}
        </div>
        <ReportCover report={report} bySlug={bySlug} size="hero" />
      </header>

      <div className="rp-intro">
        <Markdown body={report.intro} />
      </div>

      <section className="rp-picks" aria-label="Our picks">
        {report.picks.map(p => {
          const a = bySlug[p.slug];
          if (!a) return null;
          return (
            <Link key={p.slug} href={`/agents/${a.slug}`} className={`rp-pick-card ${p === report.picks[0] ? 'lead' : ''}`}>
              <span className="rp-pick-label">{p.label}</span>
              <span className="rp-pick-head">
                <AgentIcon name={a.name} icon={a.icon} size={44} />
                <span className="rp-pick-name">{a.name}</span>
                <ScoreCell value={a.scores[report.dimension]} />
              </span>
              <span className="rp-pick-why">{p.why}</span>
            </Link>
          );
        })}
      </section>

      <section id="everyone" className="rp-board" aria-label="Everyone tested">
        <div className="rp-board-head">
          <h2 className="ag-h2">Everyone tested</h2>
          <p className="ag-sub">{category?.label ?? report.dimension}, newest run per assistant, ranked by score. <Link href={`/dimensions/${report.dimension}`}>The test and how it is scored</Link></p>
        </div>
        <ol className="rp-board-list">
          {ranked.map((a, i) => (
            <li key={a.slug}>
              <Link href={`/agents/${a.slug}`} className="rp-board-item">
                <span className="rp-board-rank">{i + 1}</span>
                <AgentIcon name={a.name} icon={a.icon} size={24} className="rp-board-icon" />
                <span className="rp-board-name">{a.name}</span>
                <ScoreCell value={a.scores[report.dimension]} />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <div className="rp-body">
        <nav className="rp-toc" aria-label="In this report">
          <p className="rp-toc-head">In this report</p>
          {toc.map(t => <a key={t.id} href={`#${t.id}`}>{t.label}</a>)}
        </nav>

        <article className="rp-article">
          {report.sections.map((sec, i) => {
            if (sec.type === 'who') return (
              <section key={i} id="who" className="rp-section"><h2>Who this is for</h2><Markdown body={sec.body} /></section>
            );
            if (sec.type === 'how') return (
              <section key={i} id="how" className="rp-section"><h2>How we tested</h2><Markdown body={sec.body} /></section>
            );
            if (sec.type === 'ahead') return (
              <section key={i} id="ahead" className="rp-section"><h2>What to look forward to</h2><Markdown body={sec.body} /></section>
            );
            if (sec.type === 'extra') return (
              <section key={i} id={sec.id} className="rp-section"><h2>{sec.heading}</h2><Markdown body={sec.body} /></section>
            );
            if (sec.type === 'pick') {
              const ps = sec.section;
              const a = bySlug[ps.slug];
              return (
                <section key={i} id={`pick-${ps.slug}`} className="rp-section">
                  <h2>{ps.heading}</h2>
                  {a && (
                    <div className="rp-pick-strip">
                      <AgentIcon name={a.name} icon={a.icon} size={40} />
                      <span className="rp-pick-strip-text">
                        <Link href={`/agents/${a.slug}`}>{a.name}</Link>
                        <span><ScoreCell value={a.scores[report.dimension]} /> on this test</span>
                      </span>
                    </div>
                  )}
                  <Markdown body={ps.body} />
                  {ps.flaws && (
                    <>
                      <h3>Flaws but not dealbreakers</h3>
                      <Markdown body={ps.flaws} />
                    </>
                  )}
                </section>
              );
            }
            return (
              <section key={i} id="competition" className="rp-section">
                <h2>The competition</h2>
                <p className="rp-muted">Everyone else that took the test, against {pickAgent?.name ?? 'our pick'}. Each one links to the full head to head.</p>
                {sec.entries.map(c => {
                  const a = bySlug[c.slug];
                  if (!a) return null;
                  return (
                    <div key={c.slug} id={`competition-${c.slug}`} className="rp-competitor">
                      <div className="rp-competitor-head">
                        <AgentIcon name={a.name} icon={a.icon} size={32} />
                        <Link href={`/agents/${a.slug}`} className="rp-competitor-name">{a.name}</Link>
                        <ScoreCell value={a.scores[report.dimension]} />
                        {pickAgent && pickAgent.slug !== a.slug && (
                          <Link href={comparePath(pickAgent.slug, a.slug, [report.dimension])} className="rp-competitor-link">
                            {pickAgent.name} vs {a.name}
                          </Link>
                        )}
                      </div>
                      <Markdown body={c.body} />
                    </div>
                  );
                })}
              </section>
            );
          })}

          {report.updates.length > 0 && (
            <section id="updates" className="rp-section">
              <h2>Updates</h2>
              <p className="rp-muted">Every change to this report, newest first. Each one has its own page you can link to.</p>
              <ol className="rp-updates">
                {report.updates.map(u => (
                  <li key={u.slug} id={`update-${u.slug}`} className="rp-update">
                    <span className="rp-update-date">{formatDate(u.date, 'short')}</span>
                    <span className="rp-update-body">
                      <Link href={updatePath(report, u)} className="rp-update-title">{u.title}</Link>
                      <span className="rp-update-text">{u.excerpt}</span>
                      <span className="rp-update-foot">
                        <Link href={updatePath(report, u)}>Read the update</Link>
                        {getArticleForUpdate(report.key, u.slug) && (
                          <Link href={`/articles/${getArticleForUpdate(report.key, u.slug)!.slug}`} className="rp-take">Read our take</Link>
                        )}
                        {u.agents.map(s => bySlug[s]).filter(Boolean).map(a => (
                          <Link key={a.slug} href={`/agents/${a.slug}`} className="chip">{a.name}</Link>
                        ))}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}
          {articles.length > 0 && (
            <section id="writing" className="rp-section">
              <h2>Writing about this report</h2>
              <p className="rp-muted">Analysis and opinion, dated and signed. The report holds the verdict; these are the arguments.</p>
              <div className="rp-writing-list">
                {articles.map(a => <ArticleCard key={a.slug} article={a} report={report} bySlug={bySlug} showReport={false} />)}
              </div>
            </section>
          )}
        </article>

      </div>
    </div>
  );
}
