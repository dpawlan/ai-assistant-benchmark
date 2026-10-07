'use client';

import Link from 'next/link';
import { useState } from 'react';
import { compareTravelRank } from '@/lib/travel-rollup';
import { AgentIcon } from './AgentIcon';
import { BenchmarkNav, CategoryDescription } from './BenchmarkNav';
import { OpinionCell } from './OpinionCell';
import { TravelTestCard } from './TravelTestCard';
import { SpeedCell } from './SpeedCell';
import { ScoreCell } from './ScoreCell';
import protocol from '../../data/travel-protocol-v1.json';
import { ViewSwitch } from './ViewSwitch';
import type { TravelAgent } from '@/lib/travel-suite';

export function TravelBenchmark({ agents, grid = false }: { agents: TravelAgent[]; grid?: boolean }) {
  const [opinion, setOpinion] = useState(false);
  const shown = agents.filter(a => a.travel.completed >= 3).sort(compareTravelRank);

  return <>
    <div className="page-head home-head">
      <div>
        <h1 className="page-title">Which assistant should book your trip?</h1>
      </div>
      <ViewSwitch />
    </div>
    <div className="rank">
      <div className="rank-bar">
        <BenchmarkNav active="travel" />
        <div className="seg" role="tablist" aria-label="Score source">
          <button role="tab" aria-selected={!opinion} className={!opinion ? 'on' : ''} onClick={() => setOpinion(false)}>Scores</button>
          <button role="tab" aria-selected={opinion} className={opinion ? 'on' : ''} onClick={() => setOpinion(true)}>Public opinion</button>
        </div>
      </div>
      <CategoryDescription category="travel" />
      {grid ? <div className="matrix-wrap" role="region" aria-label="Travel scores by dimension" tabIndex={0}>
        <table className="matrix travel-matrix"><colgroup><col className="c-name" />{!opinion && <col className="c-agg" />}<col className="c-agg" />{protocol.map(t => <col key={t.id} className="travel-dimension-col" />)}</colgroup><thead><tr><th scope="col" className="mx-name">Assistant</th>{!opinion && <th scope="col" title="Median reply time from existing measured conversations, shared with General. Not included in the Travel score.">Median reply</th>}<th scope="col">Travel</th>{protocol.map(t => <th scope="col" key={t.id}><Link href={`/benchmarks/travel/dimensions/${t.id}`}>{t.title}</Link></th>)}</tr></thead>
          <tbody>{shown.map(a => <tr key={a.slug}><th scope="row" className="mx-name"><Link className="mx-agent" href={`/agents/${a.slug}`}><AgentIcon name={a.name} icon={a.icon} size={28} className="mx-icon" /><span className="mx-nm">{a.name}</span></Link></th>{!opinion && <td><SpeedCell usage={a.usage} /></td>}<td>{opinion ? <OpinionCell stat={a.travelOpinion} /> : <ScoreCell value={a.travel.score} aggregate />}</td>{protocol.map(t => <td key={t.id}><Link href={`/benchmarks/travel/dimensions/${t.id}#${a.slug}`}>{opinion ? <OpinionCell stat={undefined} compact /> : <>{a.travel.scores[t.id] !== undefined ? <ScoreCell value={a.travel.scores[t.id]} /> : <span className="travel-test-status">{a.slug === 'muse' && t.id === 5 ? 'Blocked' : 'Not tested'}</span>}</>}</Link></td>)}</tr>)}</tbody>
        </table>
      </div> : <>
        <div className="rk-head" aria-hidden="true"><span /><span /><span>Assistant</span><span className="rk-slots">{opinion ? <span>Positive</span> : <><span>Reply</span><span>Travel</span></>}</span></div>
        <div className="rk-list">{shown.map(a => <Link href={`/agents/${a.slug}`} key={a.slug} className="rk-row">
          <span /><AgentIcon name={a.name} icon={a.icon} size={36} className="rk-icon" />
          <span className="rk-body"><span className="rk-name">{a.name}</span><span className="rk-best">{a.kind === 'travel' ? 'Travel specialist' : 'Everyday assistant'}</span></span>
          <span className="rk-slots">{opinion ? <OpinionCell stat={a.travelOpinion} /> : <><SpeedCell usage={a.usage} /><ScoreCell value={a.travel.score} aggregate /></>}</span>
        </Link>)}</div>
      </>}
    </div>
    <TravelTestCard />
  </>;
}
