'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Agent, Category } from '@/lib/types';
import { AgentIcon } from './AgentIcon';
import { OpinionCell } from './OpinionCell';
import { ScoreCell } from './ScoreCell';
import { opinionRank } from '@/lib/score';

interface MatrixProps {
  agents: Agent[];
  categories: Category[];
  short: Record<string, string>;
}

type View = 'benchmark' | 'opinion';
type SortKey = 'core' | 'endorsed' | string;

function benchValue(agent: Agent, key: SortKey): number {
  if (key === 'core') return agent.core ?? -1;
  if (key === 'endorsed') return agent.endorsed ?? -1;
  const v = agent.scores[key];
  return typeof v === 'number' ? v : v === 'n/a' ? -2 : -1;
}

function opinionValue(agent: Agent, key: SortKey): number {
  if (key === 'endorsed') return agent.opinionOverall.n;
  return opinionRank(key === 'core' ? agent.opinionOverall : agent.opinion[key]);
}

function sortAgents(list: Agent[], key: SortKey, view: View): Agent[] {
  const value = view === 'opinion' ? opinionValue : benchValue;
  return [...list].sort(
    (a, b) =>
      value(b, key) - value(a, key) ||
      (view === 'opinion' ? (b.opinion[key]?.n ?? 0) - (a.opinion[key]?.n ?? 0) : 0) ||
      (b.core ?? -1) - (a.core ?? -1) ||
      b.feedbackCount - a.feedbackCount ||
      a.name.localeCompare(b.name),
  );
}

export function Matrix({ agents, categories, short }: MatrixProps) {
  const [view, setView] = useState<View>('benchmark');
  const [sort, setSort] = useState<SortKey>('core');
  const core = categories.filter(c => c.group === 'core');
  const endorsed = categories.filter(c => c.group === 'endorsed');
  const opinion = view === 'opinion';

  const groups = useMemo(
    () => [
      { title: 'Confirmed', rows: sortAgents(agents.filter(a => a.status === 'confirmed'), sort, view) },
      { title: 'Stretch', rows: sortAgents(agents.filter(a => a.status === 'stretch'), sort, view) },
    ],
    [agents, sort, view],
  );

  const testedIn = (key: string) => agents.filter(a => typeof a.scores[key] === 'number').length;
  const talkedAbout = (key: string) => agents.reduce((n, a) => n + (a.opinion[key]?.n ?? 0), 0);
  const anyOpinion = agents.some(a => a.opinionOverall.n > 0);

  const header = (key: SortKey, label: string, sub: string | undefined, cls: string, full = label) => {
    const active = sort === key;
    return (
      <th key={key} scope="col" className={`${cls}${active ? ' sorted' : ''}`.trim()} aria-sort={active ? 'descending' : 'none'}>
        <button type="button" onClick={() => setSort(key)} title={`Sort by ${full}`}>
          <span className="mx-label">
            {label}
            {active && (
              <svg className="mx-sort" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                <path d="M5 8L1 3h8z" />
              </svg>
            )}
          </span>
          {sub !== undefined && <span className="mx-sub">{sub}</span>}
        </button>
      </th>
    );
  };

  const catSub = (key: string) => {
    if (!opinion) return `${testedIn(key)} tested`;
    const n = talkedAbout(key);
    return `${n} ${n === 1 ? 'quote' : 'quotes'}`;
  };

  return (
    <div>
      <div className="mx-bar">
        <div className="seg" role="tablist" aria-label="Scorecard view">
          <button type="button" role="tab" aria-selected={!opinion} className={!opinion ? 'on' : ''} onClick={() => setView('benchmark')}>
            Benchmark
          </button>
          <button type="button" role="tab" aria-selected={opinion} className={opinion ? 'on' : ''} onClick={() => setView('opinion')}>
            Public opinion
          </button>
        </div>
        <p className="mx-caption">
          {opinion
            ? 'Share of public quotes that are positive, per category, read one by one. Founder posts excluded. Not a test result.'
            : 'One published test per category, scored 1–10 after real use. Nothing here comes from social posts.'}
        </p>
      </div>

      <div className="matrix-wrap">
        <table className={`matrix${opinion ? ' opinion' : ''}`}>
          <colgroup>
            <col className="c-name" />
            <col className="c-agg" />
            {core.map(c => (
              <col key={c.key} className="c-cat" />
            ))}
            <col className="c-agg" />
            {endorsed.map(c => (
              <col key={c.key} className="c-cat" />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="mx-name">
                <span className="mx-label">Assistant</span>
              </th>
              {opinion
                ? header('core', 'Overall', 'positive', 'mx-agg', 'overall sentiment')
                : header('core', 'Core', 'mean', 'mx-agg', 'core mean')}
              {core.map(c => header(c.key, short[c.key] ?? c.label, catSub(c.key), '', c.label))}
              {opinion
                ? header('endorsed', 'Quotes', 'read', 'mx-agg mx-div', 'number of quotes')
                : header('endorsed', 'Endorsed', 'mean', 'mx-agg mx-div', 'endorsed mean')}
              {endorsed.map(c => header(c.key, short[c.key] ?? c.label, catSub(c.key), '', c.label))}
            </tr>
          </thead>
          {groups.map(group => (
            <tbody key={group.title}>
              <tr className="mx-group">
                <th scope="rowgroup" colSpan={categories.length + 3}>
                  {group.title}
                  <span className="mx-count">{group.rows.length}</span>
                </th>
              </tr>
              {group.rows.map(agent => (
                <tr key={agent.slug}>
                  <th scope="row" className="mx-name">
                    <Link href={`/agents/${agent.slug}`} className="mx-agent">
                      <AgentIcon name={agent.name} icon={agent.icon} size={28} className="mx-icon" />
                      <span className="mx-nm">{agent.name}</span>
                    </Link>
                  </th>
                  <td className="mx-agg">
                    {opinion ? <OpinionCell stat={agent.opinionOverall} /> : <ScoreCell value={agent.core} aggregate />}
                  </td>
                  {core.map(c => (
                    <td key={c.key} className={sort === c.key ? 'sorted' : undefined}>
                      {opinion ? <OpinionCell stat={agent.opinion[c.key]} /> : <ScoreCell value={agent.scores[c.key]} />}
                    </td>
                  ))}
                  <td className="mx-agg mx-div">
                    {opinion ? (
                      <span className={`sc ${agent.opinionOverall.n ? 'sc-count' : 'sc-null'}`}>{agent.opinionOverall.n || '—'}</span>
                    ) : (
                      <ScoreCell value={agent.endorsed} aggregate />
                    )}
                  </td>
                  {endorsed.map(c => (
                    <td key={c.key} className={sort === c.key ? 'sorted' : undefined}>
                      {opinion ? <OpinionCell stat={agent.opinion[c.key]} /> : <ScoreCell value={agent.scores[c.key]} />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>

      {opinion ? (
        <p className="matrix-key">
          <span className="sc op sc-5">
            <span className="op-v">90%</span>
            <span className="op-n">12</span>
          </span>{' '}
          positive, from 12 quotes
          <span className="key-gap" />
          <span className="sc op sc-0">
            <span className="op-v">50%</span>
            <span className="op-n">6</span>
          </span>{' '}
          split
          <span className="key-gap" />
          <span className="sc op sc-n2">
            <span className="op-v">20%</span>
            <span className="op-n">5</span>
          </span>{' '}
          mostly negative
          <span className="key-gap" />
          <span className="sc op sc-thin">
            <span className="op-v">2</span>
            <span className="op-n">quotes</span>
          </span>{' '}
          too few to score
          <span className="key-gap" />
          <span className="sc sc-null">—</span> nothing said
          <span className="key-gap" />
          Sorted with a small-sample adjustment, so three quotes don&apos;t outrank thirty.
          {!anyOpinion && (
            <>
              <span className="key-gap" />
              No quotes classified yet.
            </>
          )}
        </p>
      ) : (
        <p className="matrix-key">
          <span className="sc sc-5">9</span> <span className="sc sc-3">6</span> <span className="sc sc-1">2</span> scored 1–10
          <span className="key-gap" />
          <span className="sc sc-null">—</span> not tested yet
          <span className="key-gap" />
          <span className="sc sc-na">N/A</span> doesn&apos;t apply
          <span className="key-gap" />
          <Link href="/categories#how">How scoring works</Link>
        </p>
      )}
    </div>
  );
}
