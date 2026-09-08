import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  displayDomain,
  formatDate,
  formatSeconds,
  getAgentDetail,
  getAllSlugs,
  getCategories,
  getIndexData,
  getRelatedAgents,
  getTagMap,
  productClassLabel,
  quoteCategories,
} from '@/lib/data';
import { AgentIcon } from '@/components/AgentIcon';
import { AgentRow } from '@/components/AgentRow';
import { ScoreRows } from '@/components/ScoreRows';
import { ScoreCell } from '@/components/ScoreCell';
import { OpinionCell } from '@/components/OpinionCell';
import { QuoteList } from '@/components/QuoteList';
import { KIND_LABEL, KINDS } from '@/lib/kinds';

interface AgentPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: AgentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const agent = getAgentDetail(slug);
  if (!agent) return { title: 'Not found' };
  return {
    title: agent.name,
    description: `${agent.name}: ${agent.tagline}. Scores across 14 categories and ${agent.feedbackCount} public quotes.`,
    openGraph: {
      title: `${agent.name} | Assistant Benchmark`,
      description: agent.tagline,
      images: [{ url: `/og/${agent.slug}.png`, width: 1200, height: 630, alt: agent.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${agent.name} | Assistant Benchmark`,
      description: agent.tagline,
      images: [`/og/${agent.slug}.png`],
    },
  };
}

const SIGNAL_LABEL: Record<string, string> = {
  low: 'Low public signal',
  medium: 'Medium public signal',
  high: 'High public signal',
};

export default async function AgentPage({ params }: AgentPageProps) {
  const { slug } = await params;
  const agent = getAgentDetail(slug);
  if (!agent) notFound();

  const categories = getCategories();
  const index = getIndexData();
  const related = getRelatedAgents(slug, 6);
  const kindLabel = KIND_LABEL[agent.kind] ?? 'General';
  const kindHref = agent.kind === 'general' ? '/' : `/?kind=${agent.kind}`;
  const kindPlural = KINDS.find(k => k.key === agent.kind)?.plural ?? 'assistants';
  const domain = displayDomain(agent.site);
  const productClass = productClassLabel(agent.meta?.product_class);
  const signal = agent.publicSignal && agent.publicSignal !== 'unknown' ? SIGNAL_LABEL[agent.publicSignal] : null;
  const tagMap = getTagMap();
  const quotes = (agent.feedback ?? []).map(q => ({ ...q, categories: quoteCategories(slug, q, tagMap) }));
  const categoryLabels = Object.fromEntries(categories.map(c => [c.key, c.label]));
  const quoteCounts: Record<string, number> = {};
  for (const q of quotes) for (const k of q.categories) quoteCounts[k] = (quoteCounts[k] ?? 0) + 1;

  return (
    <div className="wrap">
      <div className="ag-top">
        <Link href="/" className="back">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5l-5 5 5 5" />
          </svg>
          Leaderboard
        </Link>
      </div>

      <div className="ag-page">
        <div className="ag-id">
          <AgentIcon name={agent.name} icon={agent.icon} size={96} className="ag-id-icon" />
          <div className="ag-id-main">
            <h1 className="ag-name">{agent.name}</h1>
            <p className="ag-tag">{agent.tagline}</p>
            {agent.site && domain && (
              <a className="ag-dev" href={agent.site} target="_blank" rel="noopener noreferrer">
                {domain}
              </a>
            )}
            <div className="ag-chips">
              <Link href={kindHref} className="chip blue">{kindLabel}</Link>
              {productClass && <span className="chip">{productClass}</span>}
              {signal && <span className="chip">{signal}</span>}
            </div>
            <div className="ag-stats">
              <span className="ag-stat">
                <ScoreCell value={agent.overall} aggregate />
                Overall
              </span>
              <span className="ag-stat">
                {agent.testedCount === 0
                  ? 'Not tested yet'
                  : `${agent.testedCount} of ${categories.length} tested`}
              </span>
              {agent.opinionOverall.n > 0 && (
                <span className="ag-stat ag-stat-op">
                  <OpinionCell stat={agent.opinionOverall} />
                  Public opinion
                </span>
              )}
            </div>
          </div>
          <div className="ag-actions">
            {agent.site && (
              <a className="btn primary" href={agent.site} target="_blank" rel="noopener noreferrer">
                Visit site
              </a>
            )}
            <Link className="btn ghost" href="/request">
              Request a test
            </Link>
          </div>
        </div>

        <section className="ag-scores">
          <h2 className="ag-h2">Scores</h2>
          <ScoreRows scores={agent.scores} runs={agent.latestRuns} categories={categories} quoteCounts={quoteCounts} />
        </section>

        <section className="ag-quotes">
          <h2 className="ag-h2">What people say</h2>
          <p className="ag-sub">
            {quotes.length === 0
              ? 'No public quotes collected yet.'
              : `${quotes.length} ${quotes.length === 1 ? 'quote' : 'quotes'}, linked to source.`}
          </p>
          <QuoteList feedback={quotes} categoryLabels={categoryLabels} />
        </section>

        <aside className="ag-info">
          {agent.usage && (
            <section className="hands-on">
              <h2 className="ag-h2">Hands-on</h2>
              <p className="ag-sub">From the reviewer&apos;s own thread. Messages stay private.</p>
              <div className="info-list">
                <div className="info-row">
                  <span className="il">Messages exchanged</span>
                  <span className="iv">{agent.usage.messages}</span>
                </div>
                <div className="info-row">
                  <span className="il">Days active</span>
                  <span className="iv">{agent.usage.days_active}</span>
                </div>
                <div className="info-row">
                  <span className="il">Median reply</span>
                  <span className={`iv${agent.usage.median_reply_s === null ? ' empty' : ''}`}>{formatSeconds(agent.usage.median_reply_s)}</span>
                </div>
                <div className="info-row">
                  <span className="il">Slowest 10% of replies</span>
                  <span className={`iv${agent.usage.p90_reply_s === null ? ' empty' : ''}`}>{formatSeconds(agent.usage.p90_reply_s)}</span>
                </div>
                <div className="info-row">
                  <span className="il">Messages never answered</span>
                  <span className={`iv${agent.usage.unanswered ? '' : ' empty'}`}>{agent.usage.unanswered}</span>
                </div>
                <div className="info-row">
                  <span className="il">Unprompted messages from it</span>
                  <span className={`iv${agent.usage.proactive_messages ? '' : ' empty'}`}>{agent.usage.proactive_messages}</span>
                </div>
              </div>
            </section>
          )}
          <h2 className="ag-h2">Information</h2>
          <div className="info-list" style={{ marginTop: 8 }}>
            <div className="info-row">
              <span className="il">Group</span>
              <span className="iv">{kindLabel}</span>
            </div>
            {productClass && (
              <div className="info-row">
                <span className="il">Product class</span>
                <span className="iv">{productClass}</span>
              </div>
            )}
            <div className="info-row">
              <span className="il">Website</span>
              {agent.site && domain ? (
                <a className="iv" href={agent.site} target="_blank" rel="noopener noreferrer">
                  {domain}
                </a>
              ) : (
                <span className="iv empty">None on file</span>
              )}
            </div>
            <div className="info-row">
              <span className="il">Public signal</span>
              <span className={`iv${signal ? '' : ' empty'}`}>
                {agent.publicSignal && agent.publicSignal !== 'unknown' ? capitalize(agent.publicSignal) : 'Not rated'}
              </span>
            </div>
            <div className="info-row">
              <span className="il">Quotes collected</span>
              <span className="iv">{agent.feedbackCount}</span>
            </div>
            <div className="info-row">
              <span className="il">Categories scored</span>
              <span className={`iv${agent.testedCount ? '' : ' empty'}`}>{agent.testedCount} of {categories.length}</span>
            </div>
            <div className="info-row">
              <span className="il">Last tested</span>
              <span className={`iv${agent.lastTested ? '' : ' empty'}`}>{agent.lastTested ? formatDate(agent.lastTested) : 'Never'}</span>
            </div>
            <div className="info-row">
              <span className="il">Data updated</span>
              <span className="iv">{formatDate(index.updated)}</span>
            </div>
          </div>
          <div className="note-card">
            Built {agent.name}? <Link href="/request">Send a correction</Link>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="shelf">
          <h2 className="shelf-title">
            <Link href={kindHref} className="shelf-head">
              Keep exploring
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M8 5l5 5-5 5" />
              </svg>
            </Link>
          </h2>
          <p className="shelf-sub">More {kindPlural}</p>
          <div className="shelf-grid">
            {related.map(a => (
              <AgentRow key={a.slug} agent={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
