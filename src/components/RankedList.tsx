'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import { Agent, Category } from '@/lib/types';
import { KINDS, isKind } from '@/lib/kinds';
import { AgentIcon } from './AgentIcon';
import { ScoreCell } from './ScoreCell';
import { OpinionCell } from './OpinionCell';
import { SpeedCell } from './SpeedCell';
import { CostMark } from './CostMark';

interface RankedListProps {
  agents: Agent[];
  categories: Category[];
  short: Record<string, string>;
}

type KindKey = (typeof KINDS)[number]['key'] | 'all';

function KindFromUrl({ onKind }: { onKind: (k: KindKey) => void }) {
  const params = useSearchParams();
  const k = params.get('kind');
  const want: KindKey = k && isKind(k) ? k : 'all';
  useMemo(() => onKind(want), [want, onKind]);
  return null;
}

/** "Best at email replies and purchasing": the agent's own top two scored dimensions, in plain words. */
function bestAt(agent: Agent, short: Record<string, string>): string | null {
  const top = Object.entries(agent.scores)
    .filter((e): e is [string, number] => typeof e[1] === 'number')
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([k]) => (short[k] ?? k).toLowerCase());
  if (!top.length) return null;
  return top.length === 1 ? `Best at ${top[0]}` : `Best at ${top[0]} and ${top[1]}`;
}

export function RankedList({ agents, categories, short }: RankedListProps) {
  const router = useRouter();
  const [kind, setKindState] = useState<KindKey>('all');
  const [opinion, setOpinion] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const scoredCount = categories.length;

  const setKind = (k: KindKey) => {
    setKindState(k);
    router.replace(k === 'all' ? '/' : `/?kind=${k}`, { scroll: false });
  };

  const counts: Record<string, number> = {};
  for (const a of agents) counts[a.kind] = (counts[a.kind] ?? 0) + 1;
  const inKind = kind === 'all' ? agents : agents.filter(a => a.kind === kind);

  const ranked = opinion
    ? [...inKind].sort((a, b) => (b.opinionOverall.score ?? -1) - (a.opinionOverall.score ?? -1) || b.opinionOverall.n - a.opinionOverall.n)
    : inKind;
  const tested = opinion ? ranked.filter(a => a.opinionOverall.n > 0) : ranked.filter(a => a.overall !== null);
  const pending = ranked.filter(a => !tested.includes(a));

  const row = (agent: Agent, rank: number | null) => {
    const picked = agent.bestAt?.map(k => (short[k] ?? k).toLowerCase());
    const line = picked && picked.length ? `Best at ${picked.join(' and ')}` : (bestAt(agent, short) ?? agent.tagline);
    return (
      <Link key={agent.slug} href={`/agents/${agent.slug}`} className="rk-row">
        <span className="rk-rank">{rank ?? ''}</span>
        <AgentIcon name={agent.name} icon={agent.icon} size={36} className="rk-icon" />
        <span className="rk-body">
          <span className="rk-name">
            {agent.name}
            <CostMark pricing={agent.access?.pricing} />
          </span>
          <span className="rk-best">{line}</span>
          {!opinion && (
            <span className="rk-cov" title={`${agent.testedCount} of ${scoredCount} dimensions scored`}>
              <span style={{ width: `${(agent.testedCount / scoredCount) * 100}%` }} />
            </span>
          )}
        </span>
        <span className="rk-slots">
          {opinion ? (
            <OpinionCell stat={agent.opinionOverall} />
          ) : (
            <>
              <SpeedCell usage={agent.usage} />
              <ScoreCell value={agent.overall} aggregate />
            </>
          )}
        </span>
      </Link>
    );
  };

  return (
    <div className="rank">
      <Suspense fallback={null}>
        <KindFromUrl onKind={setKindState} />
      </Suspense>

      <div className="rank-bar">
        <div className="kind-bar" role="tablist" aria-label="Group">
          <button type="button" role="tab" aria-selected={kind === 'all'} className={`kind${kind === 'all' ? ' on' : ''}`} onClick={() => setKind('all')}>
            All
            <span className="kind-n">{agents.length}</span>
          </button>
          {KINDS.filter(k => counts[k.key]).map(k => (
            <button key={k.key} type="button" role="tab" aria-selected={kind === k.key} className={`kind${kind === k.key ? ' on' : ''}`} onClick={() => setKind(k.key)}>
              {k.label}
              <span className="kind-n">{counts[k.key]}</span>
            </button>
          ))}
        </div>
        <div className="seg" role="tablist" aria-label="Score source">
          <button type="button" role="tab" aria-selected={!opinion} className={!opinion ? 'on' : ''} onClick={() => setOpinion(false)}>
            Scores
          </button>
          <button type="button" role="tab" aria-selected={opinion} className={opinion ? 'on' : ''} onClick={() => setOpinion(true)}>
            Public opinion
          </button>
        </div>
      </div>

      <div className="rk-head" aria-hidden="true">
        <span />
        <span />
        <span>Assistant</span>
        <span className="rk-slots">{opinion ? <span>Positive</span> : <><span>Reply</span><span>Overall</span></>}</span>
      </div>

      <div className="rk-list">
        {tested.map((a, i) => row(a, i + 1))}
        {tested.length === 0 && <p className="rk-empty">Nothing scored in this group yet.</p>}
      </div>

      {pending.length > 0 && (
        <div className="rk-pending">
          <button type="button" className="rk-toggle" aria-expanded={showPending} onClick={() => setShowPending(v => !v)}>
            {showPending ? 'Hide' : 'Show'} {pending.length} not yet {opinion ? 'discussed' : 'tested'}
          </button>
          {showPending && <div className="rk-list muted">{pending.map(a => row(a, null))}</div>}
        </div>
      )}
    </div>
  );
}
