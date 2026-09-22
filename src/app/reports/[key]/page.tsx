import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatDate, getAgents, getCategory, rankByCategory } from '@/lib/data';
import { getReport, getReports, primaryPick, updatePath } from '@/lib/reports';
import { comparePath } from '@/lib/compare-shared';
import { AgentIcon } from '@/components/AgentIcon';
import { ScoreCell } from '@/components/ScoreCell';
import { SpeedCell } from '@/components/SpeedCell';
import { CostMark } from '@/components/CostMark';
import { ReportCover } from '@/components/ReportCover';
import { getArticleForUpdate, getArticlesForReport, readingMinutes } from '@/lib/articles';

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

  const toc: { id: string; label: string }[] = [
    { id: 'who', label: 'Who this is for' },
    { id: 'how', label: 'How we tested' },
    ...report.pick_sections.map(s => ({ id: `pick-${s.slug}`, label: s.heading })),
    ...(report.competition.length ? [{ id: 'competition', label: 'The competition' }] : []),
    ...(report.looking_ahead.length ? [{ id: 'ahead', label: 'What to look forward to' }] : []),
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
          <p className="rp-byline">
            {ranked.length} assistants tested, {runCount} runs of the same task. Published {formatDate(report.published)}, updated {formatDate(report.updated)}.
          </p>
          <p className="rp-preview">Preview with placeholder prose. Scores are real; the write-up is illustrative.</p>
        </div>
        <ReportCover report={report} bySlug={bySlug} size="hero" />
      </header>

      <div className="rp-intro">
        {report.intro.map((p, i) => <p key={i}>{p}</p>)}
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

      <div className="rp-body">
        <nav className="rp-toc" aria-label="In this report">
          <p className="rp-toc-head">In this report</p>
          {toc.map(t => <a key={t.id} href={`#${t.id}`}>{t.label}</a>)}
          <p className="rp-toc-foot"><Link href={`/dimensions/${report.dimension}`}>The test and how it is scored</Link></p>
        </nav>

        <article className="rp-article">
          <section id="who" className="rp-section">
            <h2>Who this is for</h2>
            {report.who_for.map((p, i) => <p key={i}>{p}</p>)}
          </section>

          <section id="how" className="rp-section">
            <h2>How we tested</h2>
            {report.how_we_tested.map((p, i) => <p key={i}>{p}</p>)}
          </section>

          {report.pick_sections.map(s => {
            const a = bySlug[s.slug];
            return (
              <section key={s.slug} id={`pick-${s.slug}`} className="rp-section">
                <h2>{s.heading}</h2>
                {a && (
                  <div className="rp-pick-strip">
                    <AgentIcon name={a.name} icon={a.icon} size={40} />
                    <span className="rp-pick-strip-text">
                      <Link href={`/agents/${a.slug}`}>{a.name}</Link>
                      <span><ScoreCell value={a.scores[report.dimension]} /> on this test</span>
                    </span>
                  </div>
                )}
                {s.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                {s.flaws.length > 0 && (
                  <>
                    <h3>Flaws but not dealbreakers</h3>
                    <ul>{s.flaws.map((f, i) => <li key={i}>{f}</li>)}</ul>
                  </>
                )}
              </section>
            );
          })}

          {report.competition.length > 0 && (
            <section id="competition" className="rp-section">
              <h2>The competition</h2>
              <p className="rp-muted">Everyone else that took the test, against {pickAgent?.name ?? 'our pick'}. Each one links to the full head to head.</p>
              {report.competition.map(c => {
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
                    <p>{c.body}</p>
                  </div>
                );
              })}
            </section>
          )}


          {report.looking_ahead.length > 0 && (
            <section id="ahead" className="rp-section">
              <h2>What to look forward to</h2>
              {report.looking_ahead.map((p, i) => <p key={i}>{p}</p>)}
            </section>
          )}

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
                      <span className="rp-update-text">{u.paragraphs[0]}</span>
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
                {articles.map(a => (
                  <Link key={a.slug} href={`/articles/${a.slug}`} className="rp-writing-item">
                    <span className="rp-writing-meta">{a.kind}, {formatDate(a.date)}</span>
                    <span className="rp-writing-title">{a.title}</span>
                    <span className="rp-writing-dek">{a.dek}</span>
                    <span className="rp-writing-foot">{readingMinutes(a.body)} minute read</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>

          <aside id="everyone" className="rp-rail">
            <h2 className="ag-h2">Everyone tested</h2>
            <p className="ag-sub">{category?.label ?? report.dimension}, newest run per assistant. Speed, then score.</p>
            <div className="rp-table">
              {ranked.map((a, i) => (
                <Link key={a.slug} href={`/agents/${a.slug}`} className="rp-row">
                  <span className="rp-row-rank">{i + 1}</span>
                  <AgentIcon name={a.name} icon={a.icon} size={28} className="rp-row-icon" />
                  <span className="rp-row-name">
                    {a.name}
                    <CostMark pricing={a.access?.pricing} />
                    {report.picks.find(p => p.slug === a.slug) && <span className="chip blue">{report.picks.find(p => p.slug === a.slug)!.label}</span>}
                  </span>
                  <span className="rp-row-cells">
                    <SpeedCell usage={a.usage} />
                    <ScoreCell value={a.scores[report.dimension]} />
                  </span>
                </Link>
              ))}
            </div>
            <p className="rp-rail-foot"><Link href={`/dimensions/${report.dimension}`}>The test and how it is scored</Link></p>
          </aside>
      </div>
    </div>
  );
}
