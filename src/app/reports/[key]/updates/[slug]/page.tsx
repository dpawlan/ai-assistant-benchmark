import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatDate, getAgents } from '@/lib/data';
import { getReports, getUpdate, primaryPick } from '@/lib/reports';
import { comparePath } from '@/lib/compare-shared';
import { AgentIcon } from '@/components/AgentIcon';
import { Markdown } from '@/components/Markdown';
import { getArticleForUpdate } from '@/lib/articles';

interface Props {
  params: Promise<{ key: string; slug: string }>;
}

export function generateStaticParams() {
  return getReports().flatMap(r => r.updates.map(u => ({ key: r.key, slug: u.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { key, slug } = await params;
  const hit = getUpdate(key, slug);
  return { title: hit ? `${hit.update.title} | ${hit.report.title}` : 'Update' };
}

export default async function UpdatePage({ params }: Props) {
  const { key, slug } = await params;
  const hit = getUpdate(key, slug);
  if (!hit) notFound();
  const { report, update } = hit;
  const agents = getAgents();
  const bySlug = Object.fromEntries(agents.map(a => [a.slug, a]));
  const runsById = new Map(agents.flatMap(a => Object.values(a.latestRuns).map(r => [r.id, { run: r, agent: a }] as const)));
  const involved = update.agents.map(s => bySlug[s]).filter(Boolean);
  const pick = primaryPick(report);
  const pairs: [string, string][] = [];
  for (let i = 0; i < update.agents.length; i++) for (let j = i + 1; j < update.agents.length; j++) pairs.push([update.agents[i], update.agents[j]]);
  const others = report.updates.filter(u => u.slug !== update.slug);
  const take = getArticleForUpdate(report.key, update.slug);

  return (
    <div className="wrap mid rp">
      <div className="ag-top">
        <Link href={`/reports/${report.key}`} className="back">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5l-5 5 5 5" />
          </svg>
          {report.title}
        </Link>
      </div>

      <div className="rp-update-page">
        <p className="rp-eyebrow">Update, {formatDate(update.date)}</p>
        <h1 className="rp-title">{update.title}</h1>
        <p className="rp-dek">An update to <Link href={`/reports/${report.key}`}>{report.title}</Link>.</p>
        {report.preview && <p className="rp-preview">Preview with placeholder prose.</p>}

        <div className="rp-update-involved">
          {involved.map(a => (
            <Link key={a.slug} href={`/agents/${a.slug}`} className="rp-update-agent">
              <AgentIcon name={a.name} icon={a.icon} size={28} />
              {a.name}
              {a.slug === pick && <span className="chip blue">Our pick</span>}
            </Link>
          ))}
        </div>

        <article className="rp-article rp-article-solo">
          <Markdown body={update.body} />
        </article>

        {take && (
          <Link href={`/articles/${take.slug}`} className="rp-take-card">
            <span className="rp-eyebrow">Our take</span>
            <span className="rp-take-title">{take.title}</span>
            <span className="rp-take-dek">{take.dek}</span>
          </Link>
        )}

        {update.runs.length > 0 && (
          <section className="rp-section">
            <h2>Runs behind this update</h2>
            <div className="rp-runs">
              {update.runs.map(id => {
                const r = runsById.get(id);
                return r ? (
                  <Link key={id} href={r.run.evidence_url ?? `/agents/${r.agent.slug}`} className="chip">
                    {r.agent.name} run, {formatDate(r.run.date, 'short')}
                  </Link>
                ) : (
                  <span key={id} className="chip">{id}</span>
                );
              })}
            </div>
          </section>
        )}

        {pairs.length > 0 && (
          <section className="rp-section">
            <h2>Head to heads this affects</h2>
            <div className="rp-runs">
              {pairs.map(([a, b]) => bySlug[a] && bySlug[b] && (
                <Link key={a + b} href={comparePath(a, b, [report.dimension])} className="chip">
                  {bySlug[a].name} vs {bySlug[b].name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {others.length > 0 && (
          <section className="rp-section">
            <h2>Other updates to this report</h2>
            <ul className="rp-other-updates">
              {others.map(u => (
                <li key={u.slug}>
                  <span className="rp-update-date">{formatDate(u.date, 'short')}</span>
                  <Link href={`/reports/${report.key}/updates/${u.slug}`}>{u.title}</Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
