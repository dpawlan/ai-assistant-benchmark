'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AgentIcon } from './AgentIcon';
import { BenchmarkNav, CategoryDescription } from './BenchmarkNav';
import { ScoreCell } from './ScoreCell';
import protocol from '../../data/travel-protocol-draft.json';
import { TRAVEL_PILOT, TRAVEL_NEXT, TRAVEL_STAGES, type TravelAgent } from '@/lib/travel-suite';

export function TravelBenchmark({ agents }: { agents: TravelAgent[] }) {
  const [stage, setStage] = useState('all');
  const [view, setView] = useState<'assistants' | 'tests'>('assistants');
  const [all, setAll] = useState(false);
  const tasks = protocol.filter(t => stage === 'all' || t.stage === stage);
  const cohort = all ? [...TRAVEL_PILOT, ...TRAVEL_NEXT] : TRAVEL_PILOT;
  const shown = cohort.flatMap(slug => agents.filter(a => a.slug === slug));

  return <>
    <div className="page-head home-head">
      <div>
        <h1 className="page-title">Which assistant should plan your trip?</h1>
      </div>
    </div>
    <div className="rank">
      <div className="rank-bar">
        <BenchmarkNav active="travel" />
        <div className="seg" aria-label="Travel view">
          <button className={view === 'assistants' ? 'on' : ''} aria-pressed={view === 'assistants'} onClick={() => setView('assistants')}>Assistants</button>
          <button className={view === 'tests' ? 'on' : ''} aria-pressed={view === 'tests'} onClick={() => setView('tests')}>Tests</button>
        </div>
      </div>
      <CategoryDescription category="travel" />
      <div className="travel-controls">
        <label>Dimension <select value={stage} onChange={e => setStage(e.target.value)}><option value="all">All travel tasks</option>{TRAVEL_STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}</select></label>
        <span>{tasks.length} proposed tests · no scores yet</span>
      </div>
      {view === 'assistants' ? <>
        <div className="rk-head" aria-hidden="true"><span /><span /><span>Assistant</span><span>Travel</span></div>
        <div className="rk-list">{shown.map(a => <Link href={`/agents/${a.slug}`} key={a.slug} className="rk-row">
          <span /><AgentIcon name={a.name} icon={a.icon} size={36} className="rk-icon" />
          <span className="rk-body"><span className="rk-name">{a.name}</span><span className="rk-best">{a.kind === 'travel' ? 'Travel specialist' : 'Everyday assistant'} · Not tested yet</span></span>
          <ScoreCell value={null} />
        </Link>)}</div>
        <div className="rk-pending"><button className="rk-toggle" aria-expanded={all} onClick={() => setAll(!all)}>{all ? 'Show first five' : 'Show all ten proposed assistants'}</button></div>
      </> : <section className="travel-protocol" aria-label="Draft travel tests">
        <p className="page-sub">Draft test specifications. These are proposed tasks and scoring anchors, not completed results.</p>
        {tasks.map(t => <details key={t.id}>
          <summary>{t.title}</summary>
          <p>{t.measures}</p><h3>Prompt</h3><blockquote>{t.prompt}</blockquote>
          {t.setup && <><h3>Setup</h3><p>{t.setup}</p></>}
          <h3>Pass criteria</h3><ul>{t.pass.map((p, i) => <li key={i}>{p.replace(/^•\s*/, '')}</li>)}</ul>
          <h3>Scoring anchors</h3>{Object.entries(t.anchors).map(([score, text]) => <p key={score}><strong>{score}/10:</strong> {text}</p>)}
          {t.automaticOne && <p><strong>Automatic 1:</strong> {t.automaticOne}</p>}
        </details>)}
      </section>}
    </div>
  </>;
}
