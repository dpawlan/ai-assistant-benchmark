import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatDate, getAgents, getCategory, rankByCategory } from '@/lib/data';
import { getReport, getReports } from '@/lib/reports';
import { comparePath } from '@/lib/compare';
import { AgentIcon } from '@/components/AgentIcon';
import { ScoreCell } from '@/components/ScoreCell';
import { SpeedCell } from '@/components/SpeedCell';
import { CostMark } from '@/components/CostMark';

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
  const pick = bySlug[report.pick];
  const runner = bySlug[report.runner_up];
  const runsById = new Map(agents.flatMap(a => Object.values(a.latestRuns).map(r => [r.id, { run: r, agent: a }] as const)));

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

      <div className="rp-head">
        <p className="rp-kicker">Report, updated {formatDate(report.updated)}</p>
        <h1 className="page-title">{report.question}</h1>
        <p className="rp-preview">Preview with placeholder prose. Scores are real; the write-up is illustrative.</p>
      </div>

      <section className="rp-verdict">
        <div className="rp-pick">
          {pick && (
            <Link href={`/agents/${pick.slug}`} className="rp-pick-card">
              <AgentIcon name={pick.name} icon={pick.icon} size={56} />
              <span>
                <span className="rp-pick-label">Our pick</span>
                <span className="rp-pick-name">{pick.name}</span>
                <span className="rp-pick-score"><ScoreCell value={pick.scores[report.dimension]} /> on this test</span>
              </span>
            </Link>
          )}
          {runner && (
            <Link href={`/agents/${runner.slug}`} className="rp-pick-card runner">
              <AgentIcon name={runner.name} icon={runner.icon} size={56} />
              <span>
                <span className="rp-pick-label">Runner-up</span>
                <span className="rp-pick-name">{runner.name}</span>
                <span className="rp-pick-score"><ScoreCell value={runner.scores[report.dimension]} /> on this test</span>
              </span>
            </Link>
          )}
        </div>
        <p className="rp-verdict-line">{report.verdict}</p>
        <p className="rp-summary">{report.summary}</p>
      </section>

      <div className="rp-body">
        <div className="rp-main">
          {report.changes.length > 0 && (
            <section className="rp-section">
              <h2 className="ag-h2">What changed</h2>
              <ol className="rp-changes">
                {report.changes.map(c => (
                  <li key={c.date + c.title} className="rp-change">
                    <span className="rp-change-date">{formatDate(c.date, 'short')}</span>
                    <span className="rp-change-body">
                      <span className="rp-change-title">{c.title}</span>
                      <span className="rp-change-text">{c.body}</span>
                      {c.runs.length > 0 && (
                        <span className="rp-change-runs">
                          {c.runs.map(id => {
                            const hit = runsById.get(id);
                            return hit ? (
                              <Link key={id} href={hit.run.evidence_url ?? `/agents/${hit.agent.slug}`} className="chip">
                                {hit.agent.name} run, {formatDate(hit.run.date, 'short')}
                              </Link>
                            ) : (
                              <span key={id} className="chip">{id}</span>
                            );
                          })}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {report.matchups.length > 0 && (
            <section className="rp-section">
              <h2 className="ag-h2">How they compare</h2>
              {report.matchups.map(m => {
                const a = bySlug[m.pair[0]];
                const b = bySlug[m.pair[1]];
                if (!a || !b) return null;
                return (
                  <div key={m.pair.join('-')} className="rp-matchup">
                    <h3 className="rp-matchup-title">
                      {a.name} vs {b.name}
                      <Link href={comparePath(a.slug, b.slug, [report.dimension])} className="rp-matchup-link">Full head to head</Link>
                    </h3>
                    <p>{m.body}</p>
                  </div>
                );
              })}
            </section>
          )}
        </div>

        <aside className="rp-side">
          <h2 className="ag-h2">Everyone tested</h2>
          <p className="ag-sub">{category?.label ?? report.dimension}, newest run per assistant.</p>
          <div className="rp-table">
            {ranked.map((a, i) => (
              <Link key={a.slug} href={`/agents/${a.slug}`} className="rp-row">
                <span className="rp-row-rank">{i + 1}</span>
                <AgentIcon name={a.name} icon={a.icon} size={28} className="rp-row-icon" />
                <span className="rp-row-name">
                  {a.name}
                  <CostMark pricing={a.access?.pricing} />
                </span>
                <span className="rp-row-cells">
                  <SpeedCell usage={a.usage} />
                  <ScoreCell value={a.scores[report.dimension]} />
                </span>
              </Link>
            ))}
          </div>
          <p className="rp-side-foot">
            <Link href={`/dimensions/${report.dimension}`}>The test and how it is scored</Link>
          </p>
        </aside>
      </div>
    </div>
  );
}
