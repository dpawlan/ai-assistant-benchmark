import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORY_DESCRIPTIONS, formatDate, getAgents, getCategories, getCategory, getQuotesForCategory, getTask, rankByCategory, rankByOpinion } from '@/lib/data';
import { AgentIcon } from '@/components/AgentIcon';
import { ScoreCell } from '@/components/ScoreCell';
import { QuoteItem } from '@/components/QuoteItem';
import { OpinionCell } from '@/components/OpinionCell';

interface Props {
  params: Promise<{ key: string }>;
}

export function generateStaticParams() {
  return getCategories().map(c => ({ key: c.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { key } = await params;
  const category = getCategory(key);
  if (!category) return { title: 'Not found' };
  return {
    title: category.label,
    description: `${CATEGORY_DESCRIPTIONS[key] ?? ''} Every assistant ranked on this one test.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { key } = await params;
  const category = getCategory(key);
  if (!category) notFound();

  const task = getTask(key);
  const categories = getCategories();
  const n = categories.findIndex(c => c.key === key) + 1;
  const agents = rankByCategory(getAgents(), key);
  const scored = agents.filter(a => typeof a.scores[key] === 'number');
  const untested = agents.filter(a => a.scores[key] === null || a.scores[key] === undefined);
  const na = agents.filter(a => a.scores[key] === 'n/a');
  const prev = categories[n - 2];
  const next = categories[n];
  const said = getQuotesForCategory(key, 8);
  const opinion = rankByOpinion(agents, key).slice(0, 10);
  const categoryLabels = Object.fromEntries(categories.map(c => [c.key, c.label]));

  return (
    <div className="wrap">
      <div className="ag-top">
        <Link href="/categories" className="back">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5l-5 5 5 5" />
          </svg>
          Categories
        </Link>
      </div>

      <div className="page-head" style={{ paddingTop: 18 }}>
        <p className="cat-kicker">
          {category.group === 'core' ? 'Core' : 'Endorsed'} · {n} of {categories.length}
        </p>
        <h1 className="page-title">{category.label}</h1>
        <p className="page-sub">{CATEGORY_DESCRIPTIONS[key]}</p>
      </div>

      {task && (
        <section className="task-card">
          <div className="task-head">
            <h2 className="ag-h2">The test: {task.task}</h2>
            <p className="ag-sub">Same wording for every assistant. Scored 1–10 against the anchors below.</p>
          </div>
          <blockquote className="task-prompt">{task.prompt}</blockquote>
          <div className="task-cols">
            <div>
              <h3 className="group-title">Passes when</h3>
              <ul className="task-list">
                {task.pass.map(p => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="group-title">Anchors</h3>
              <div className="info-list">
                {Object.entries(task.anchors).map(([score, text]) => (
                  <div key={score} className="info-row anchor-row">
                    <span className="il">{text}</span>
                    <ScoreCell value={Number(score)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="shelf">
        <h2 className="shelf-title">
          <span className="shelf-head">Ranking</span>
        </h2>
        <p className="shelf-sub">
          {scored.length === 0
            ? 'No assistant has been tested on this yet. Rankings appear as runs are logged.'
            : `${scored.length} tested. Ties keep the more-discussed assistant first.`}
        </p>
        {scored.length > 0 && (
          <div className="chart-list rank-list">
            {scored.map((agent, i) => {
              const run = agent.latestRuns[key];
              return (
                <Link key={agent.slug} href={`/agents/${agent.slug}`} className="chart-row">
                  <span className="chart-rank">{i + 1}</span>
                  <AgentIcon name={agent.name} icon={agent.icon} />
                  <span className="row-body">
                    <span className="row-name">{agent.name}</span>
                    <span className="row-tag">
                      {run ? `${run.outcome === 'pass' ? 'Pass' : run.outcome === 'partial' ? 'Partial' : 'Fail'} · ${formatDate(run.date, 'short')}${run.notes ? ` · ${run.notes}` : ''}` : agent.tagline}
                    </span>
                  </span>
                  <span className="row-slot">
                    <ScoreCell value={agent.scores[key]} />
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {opinion.length > 0 && (
        <section className="shelf">
          <h2 className="shelf-title">
            <span className="shelf-head">Public opinion</span>
          </h2>
          <p className="shelf-sub">
            Share of public quotes about this that are positive, per assistant. Founder posts excluded; a score needs at least 3 signed quotes.
          </p>
          <div className="chart-list rank-list">
            {opinion.map((agent, i) => {
              const st = agent.opinion[key];
              return (
                <Link key={agent.slug} href={`/agents/${agent.slug}#quotes=${key}`} className="chart-row">
                  <span className="chart-rank">{i + 1}</span>
                  <AgentIcon name={agent.name} icon={agent.icon} />
                  <span className="row-body">
                    <span className="row-name">{agent.name}</span>
                    <span className="row-tag">
                      {st.n} {st.n === 1 ? 'quote' : 'quotes'} · {st.pos} positive · {st.neg} negative
                    </span>
                  </span>
                  <span className="row-slot">
                    <OpinionCell stat={st} />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {untested.length > 0 && (
        <section className="shelf">
          <h2 className="shelf-title">
            <span className="shelf-head">Not yet tested</span>
          </h2>
          <p className="shelf-sub">{untested.length} assistants waiting on this run.</p>
          <div className="name-cloud">
            {untested.map(a => (
              <Link key={a.slug} href={`/agents/${a.slug}`} className="name-chip">
                <AgentIcon name={a.name} icon={a.icon} size={22} className="chip-icon" />
                {a.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {na.length > 0 && (
        <section className="shelf">
          <h2 className="shelf-title">
            <span className="shelf-head">Doesn&apos;t apply</span>
          </h2>
          <p className="shelf-sub">Stretch products where this category is out of scope. They score N/A rather than zero.</p>
          <div className="name-cloud">
            {na.map(a => (
              <Link key={a.slug} href={`/agents/${a.slug}`} className="name-chip muted">
                <AgentIcon name={a.name} icon={a.icon} size={22} className="chip-icon" />
                {a.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {said.total > 0 && (
        <section className="shelf">
          <h2 className="shelf-title">
            <span className="shelf-head">What people say</span>
          </h2>
          <p className="shelf-sub">
            {said.total} public {said.total === 1 ? 'quote' : 'quotes'} about this, across every assistant. Sentiment, not score.
          </p>
          <div className="quote-list">
            {said.items.map(q => (
              <QuoteItem key={q.quote.id} quote={q.quote} agent={q.agent} categories={q.categories.filter(c => c !== key)} categoryLabels={categoryLabels} clamp />
            ))}
          </div>
        </section>
      )}

      <nav className="pager">
        {prev ? (
          <Link href={`/categories/${prev.key}`} className="btn ghost">
            ‹ {prev.label}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/categories/${next.key}`} className="btn ghost">
            {next.label} ›
          </Link>
        )}
      </nav>
    </div>
  );
}
