'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AgentIcon } from './AgentIcon';
import { BenchmarkNav, CategoryDescription } from './BenchmarkNav';
import { ScoreCell } from './ScoreCell';
import protocol from '../../data/travel-protocol-draft.json';
import { ViewSwitch } from './ViewSwitch';
import { TRAVEL_PILOT, TRAVEL_NEXT, type TravelAgent } from '@/lib/travel-suite';

export function TravelBenchmark({ agents, grid = false }: { agents: TravelAgent[]; grid?: boolean }) {
  const [all, setAll] = useState(false);
  const cohort = all ? [...TRAVEL_PILOT, ...TRAVEL_NEXT] : TRAVEL_PILOT;
  const shown = cohort.flatMap(slug => agents.filter(a => a.slug === slug));

  return <>
    <div className="page-head home-head">
      <div>
        <h1 className="page-title">Which assistant should plan your trip?</h1>
      </div>
      <ViewSwitch />
    </div>
    <div className="rank">
      <div className="rank-bar">
        <BenchmarkNav active="travel" />
      </div>
      <CategoryDescription category="travel" />
      {grid ? <div className="matrix-wrap" role="region" aria-label="Travel scores by dimension" tabIndex={0}>
        <table className="matrix travel-matrix"><colgroup><col className="c-name" />{protocol.map(t => <col key={t.id} className="travel-dimension-col" />)}</colgroup><thead><tr><th scope="col" className="mx-name">Assistant</th>{protocol.map(t => <th scope="col" key={t.id}><Link href={`/benchmarks/travel/dimensions/${t.id}`}>{t.title}</Link></th>)}</tr></thead>
          <tbody>{shown.map(a => <tr key={a.slug}><th scope="row" className="mx-name"><Link className="mx-agent" href={`/agents/${a.slug}`}><AgentIcon name={a.name} icon={a.icon} size={28} className="mx-icon" /><span className="mx-nm">{a.name}</span></Link></th>{protocol.map(t => <td key={t.id}><ScoreCell value={null} /></td>)}</tr>)}</tbody>
        </table>
      </div> : <>
        <div className="rk-head" aria-hidden="true"><span /><span /><span>Assistant</span><span>Travel</span></div>
        <div className="rk-list">{shown.map(a => <Link href={`/agents/${a.slug}`} key={a.slug} className="rk-row">
          <span /><AgentIcon name={a.name} icon={a.icon} size={36} className="rk-icon" />
          <span className="rk-body"><span className="rk-name">{a.name}</span><span className="rk-best">{a.kind === 'travel' ? 'Travel specialist' : 'Everyday assistant'} · Not tested yet</span></span>
          <ScoreCell value={null} />
        </Link>)}</div>
      </>}
      <div className="rk-pending"><button className="rk-toggle" aria-expanded={all} onClick={() => setAll(!all)}>{all ? 'Show first five' : 'Show all ten proposed assistants'}</button></div>
    </div>
  </>;
}
