import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatDate, getAgents, getCategory, rankByCategory } from '@/lib/data';
import { getReport, getReports, primaryPick, updatePath, type Report } from '@/lib/reports';
import { comparePath } from '@/lib/compare-shared';
import { AgentIcon } from '@/components/AgentIcon';
import { ScoreCell } from '@/components/ScoreCell';
import { SpeedCell } from '@/components/SpeedCell';
import { CostMark } from '@/components/CostMark';
import { ReportCover } from '@/components/ReportCover';
import { ReportCoverIcons } from '@/components/ReportCoverIcons';
import { Markdown } from '@/components/Markdown';
import { getArticleForUpdate, getArticlesForReport } from '@/lib/articles';
import { ArticleCard } from '@/components/ArticleCard';
import { getAuthor } from '@/lib/authors';
import { AuthorAvatar } from '@/components/AuthorAvatar';
import type { Agent } from '@/lib/types';

interface Props {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ design?: string }>;
}

/**
 * PREVIEW: three layouts of the same report, switched with ?design=a|b|c.
 *  a  original: logo-row cover, contents rail, sticky ranking rail
 *  b  thread cover, ranking strip under the picks, contents rail + single column
 *  c  editorial: one centred column, full-width hero, picks as rows, ranking as a table with run notes
 */
const DESIGNS = [
  { id: 'a', label: 'A. Original' },
  { id: 'b', label: 'B. Thread cover' },
  { id: 'c', label: 'C. Editorial' },
] as const;
type Design = (typeof DESIGNS)[number]['id'];

export function generateStaticParams() {
  return getReports().map(r => ({ key: r.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { key } = await params;
  const r = getReport(key);
  return { title: r ? r.title : 'Report' };
}

export default async function ReportPage({ params, searchParams }: Props) {
  const { key } = await params;
  const { design: d } = await searchParams;
  const design: Design = d === 'a' || d === 'c' ? d : 'b';
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
    ...(design === 'b' ? [{ id: 'everyone', label: 'Everyone tested' }] : []),
    ...report.sections.map(s =>
      s.type === 'who' ? { id: 'who', label: 'Who this is for' }
      : s.type === 'how' ? { id: 'how', label: 'How we tested' }
      : s.type === 'pick' ? { id: `pick-${s.section.slug}`, label: s.section.heading }
      : s.type === 'competition' ? { id: 'competition', label: 'The competition' }
      : s.type === 'ahead' ? { id: 'ahead', label: 'What to look forward to' }
      : { id: s.id, label: s.heading }),
    ...(design === 'c' ? [{ id: 'everyone', label: 'Everyone tested' }] : []),
    ...(report.updates.length ? [{ id: 'updates', label: 'Updates' }] : []),
    ...(articles.length ? [{ id: 'writing', label: 'Writing about this report' }] : []),
  ];

  const Cover = design === 'a' ? ReportCoverIcons : ReportCover;

  const rankingTable = (
    <section id="everyone" className="rp-section rp-tbl-wrap">
      <h2>Everyone tested</h2>
      <p className="rp-muted">{category?.label ?? report.dimension}, newest run per assistant, ranked by score. The note is what happened in that run. <Link href={`/dimensions/${report.dimension}`}>The test and how it is scored</Link></p>
      <div className="rp-tbl-scroll">
        <table className="rp-tbl">
          <thead>
            <tr><th>#</th><th>Assistant</th><th>Reply</th><th>Score</th><th>Newest run</th></tr>
          </thead>
          <tbody>
            {ranked.map((a, i) => {
              const run = a.latestRuns[report.dimension];
              return (
                <tr key={a.slug}>
                  <td className="rp-tbl-rank">{i + 1}</td>
                  <td>
                    <Link href={`/agents/${a.slug}`} className="rp-tbl-name">
                      <AgentIcon name={a.name} icon={a.icon} size={26} className="rp-board-icon" />
                      {a.name}
                      <CostMark pricing={a.access?.pricing} />
                    </Link>
                  </td>
                  <td><SpeedCell usage={a.usage} /></td>
                  <td><ScoreCell value={a.scores[report.dimension]} /></td>
                  <td className="rp-tbl-note">{run?.notes ?? ''}{run?.evidence_url && <> <Link href={run.evidence_url}>Thread</Link></>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );

  const rankingStrip = (
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
  );

  const rankingRail = (
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
  );

  const picksBox = (
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
  );

  const picksRows = (
    <section className="rp-picks-stack" aria-label="Our picks">
      {report.picks.map(p => {
        const a = bySlug[p.slug];
        if (!a) return null;
        const run = a.latestRuns[report.dimension];
        return (
          <div key={p.slug} className={`rp-prow ${p === report.picks[0] ? 'lead' : ''}`}>
            <AgentIcon name={a.name} icon={a.icon} size={64} className="rp-prow-icon" />
            <div className="rp-prow-main">
              <span className="rp-pick-label">{p.label}</span>
              <span className="rp-prow-name">{a.name} <ScoreCell value={a.scores[report.dimension]} /></span>
              <span className="rp-prow-why">{p.why}</span>
              {run?.notes && <span className="rp-prow-note">In the newest run: {run.notes}</span>}
            </div>
            <div className="rp-prow-actions">
              <Link href={`/agents/${a.slug}`} className="rp-btn">Profile</Link>
              {pickAgent && pickAgent.slug !== a.slug && <Link href={comparePath(pickAgent.slug, a.slug, [report.dimension])} className="rp-btn ghost">vs {pickAgent.name}</Link>}
              {run?.evidence_url && <Link href={run.evidence_url} className="rp-btn ghost">Read the thread</Link>}
            </div>
          </div>
        );
      })}
    </section>
  );

  const body = (
    <article className="rp-article">
      {report.sections.map((sec, i) => {
        if (sec.type === 'who') return <section key={i} id="who" className="rp-section"><h2>Who this is for</h2><Markdown body={sec.body} /></section>;
        if (sec.type === 'how') return (
          <section key={i} id="how" className="rp-section">
            <h2>How we tested</h2>
            <Markdown body={sec.body} />
            {design === 'c' && rankingTable}
          </section>
        );
        if (sec.type === 'ahead') return <section key={i} id="ahead" className="rp-section"><h2>What to look forward to</h2><Markdown body={sec.body} /></section>;
        if (sec.type === 'extra') return <section key={i} id={sec.id} className="rp-section"><h2>{sec.heading}</h2><Markdown body={sec.body} /></section>;
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
              {ps.flaws && (<><h3>Flaws but not dealbreakers</h3><Markdown body={ps.flaws} /></>)}
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
                      <Link href={comparePath(pickAgent.slug, a.slug, [report.dimension])} className="rp-competitor-link">{pickAgent.name} vs {a.name}</Link>
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
                    {getArticleForUpdate(report.key, u.slug) && <Link href={`/articles/${getArticleForUpdate(report.key, u.slug)!.slug}`} className="rp-take">Read our take</Link>}
                    {u.agents.map(s => bySlug[s]).filter(Boolean).map(a => <Link key={a.slug} href={`/agents/${a.slug}`} className="chip">{a.name}</Link>)}
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
  );

  const switcher = (
    <div className="rp-switch" role="navigation" aria-label="Design variants (preview)">
      <span>Design</span>
      {DESIGNS.map(x => (
        <Link key={x.id} href={`/reports/${report.key}?design=${x.id}`} className={`rp-switch-btn${design === x.id ? ' on' : ''}`}>{x.label}</Link>
      ))}
    </div>
  );

  const back = (
    <div className="ag-top">
      <Link href="/reports" className="back">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5l-5 5 5 5" /></svg>
        Reports
      </Link>
    </div>
  );

  const byline = (
    <div className="rp-author">
      {author && <AuthorAvatar author={author} size={32} />}
      <span className="rp-author-text">
        {author ? <Link href={`/authors/${author.slug}`}>By {author.name}</Link> : null}
        <span>Updated {formatDate(report.updated)}. Published {formatDate(report.published)}.</span>
      </span>
    </div>
  );

  if (design === 'c') {
    return (
      <div className="wrap mid rp v-c">
        {back}
        {switcher}
        <div className="rp-c">
          <header className="rp-c-head">
            <p className="rp-eyebrow">{category?.label ?? report.dimension}</p>
            <h1 className="rp-title">{report.title}</h1>
            <p className="rp-dek">{report.question}</p>
            {byline}
            {report.preview && <p className="rp-preview">Preview with placeholder prose. Scores are real; the write-up is illustrative.</p>}
          </header>
          <figure className="rp-c-hero">
            <ReportCover report={report} bySlug={bySlug} size="hero" />
            <figcaption>The purchasing test as {pickAgent?.name ?? 'our pick'} ran it. {ranked.length} assistants tested, {runCount} runs of the same task.</figcaption>
          </figure>
          <div className="rp-intro rp-c-intro"><Markdown body={report.intro} /></div>
          {picksRows}
          <nav className="rp-c-toc" aria-label="In this report">
            <span>In this report</span>
            {toc.map(t => <a key={t.id} href={`#${t.id}`}>{t.label}</a>)}
          </nav>
          {body}
        </div>
      </div>
    );
  }

  return (
    <div className={`wrap mid rp v-${design}`}>
      {back}
      {switcher}
      <header className="rp-hero">
        <div className="rp-hero-text">
          <p className="rp-eyebrow">{category?.label ?? report.dimension}</p>
          <h1 className="rp-title">{report.title}</h1>
          <p className="rp-dek">{report.question}</p>
          {byline}
          <p className="rp-byline">{ranked.length} assistants tested, {runCount} runs of the same task.</p>
          {report.preview && <p className="rp-preview">Preview with placeholder prose. Scores are real; the write-up is illustrative.</p>}
        </div>
        <Cover report={report} bySlug={bySlug} size="hero" />
      </header>

      <div className="rp-intro"><Markdown body={report.intro} /></div>
      {picksBox}
      {design === 'b' && rankingStrip}

      <div className="rp-body">
        <nav className="rp-toc" aria-label="In this report">
          <p className="rp-toc-head">In this report</p>
          {toc.map(t => <a key={t.id} href={`#${t.id}`}>{t.label}</a>)}
          {design === 'a' && <p className="rp-toc-foot"><Link href={`/dimensions/${report.dimension}`}>The test and how it is scored</Link></p>}
        </nav>
        {body}
        {design === 'a' && rankingRail}
      </div>
    </div>
  );
}
