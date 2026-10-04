'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AgentIcon } from '@/components/AgentIcon';
import protocol from '../../data/travel-protocol-draft.json';
import { TRAVEL_PILOT, TRAVEL_NEXT, TRAVEL_STAGES, type TravelAgent } from '@/lib/travel-suite';

export function TravelBenchmark({ agents }: { agents: TravelAgent[] }) {
  const [stage, setStage] = useState('all');
  const [view, setView] = useState<'assistants' | 'protocol'>('assistants');
  const [cohort, setCohort] = useState('pilot');
  const [type, setType] = useState('all');
  const [query, setQuery] = useState('');
  const stages = stage === 'all' ? TRAVEL_STAGES : TRAVEL_STAGES.filter(s => s.key === stage);
  const tasks = protocol.filter(t => stage === 'all' || t.stage === stage);
  const order = cohort === 'pilot' ? TRAVEL_PILOT : [...TRAVEL_PILOT, ...TRAVEL_NEXT];
  const shown = order.flatMap(slug => agents.filter(a => a.slug === slug))
    .filter(a => (type === 'all' || (type === 'specialist' ? a.kind === 'travel' : a.kind !== 'travel')) && a.name.toLowerCase().includes(query.toLowerCase()));
  const selected = TRAVEL_STAGES.find(s => s.key === stage);

  return <>
    <div className="bs-preview"><span className="bs-dot" /> Design preview <span>Travel protocol in development · no new scores published</span></div>
    <header className="bs-hero">
      <div><p className="bs-eyebrow">THE TRAVEL BENCHMARK</p><h1>A good trip starts with<br />the right assistant.</h1><p className="bs-intro">Who can find the flight, book it correctly, and help when plans change? The same travel tests, for specialists and everyday assistants alike.</p><a className="bs-text-link" href="#travel-results">Explore the pilot <span aria-hidden="true">↗</span></a></div>
      <aside className="bs-ticket" aria-label="Travel pilot overview">
        <div className="bs-ticket-top"><span>FIRST DEPARTURE</span><span className="bs-badge">Pilot planned</span></div>
        <div className="bs-flight" aria-hidden="true"><span>PLAN<small>The right option</small></span><svg viewBox="0 0 160 48" fill="none"><path d="M0 24h60m40 0h60" stroke="currentColor" strokeDasharray="3 5"/><path d="m66 24 12-3 5-15 5 0-2 15 12 3-12 3 2 15-5 0-5-15-12-3Z" fill="currentColor"/></svg><span>GO<small>Handled for you</small></span></div>
        <div className="bs-ticket-stats"><div><strong>05</strong><span>Pilot assistants</span></div><div><strong>17</strong><span>Proposed tests</span></div><div><strong>06</strong><span>Trip stages</span></div></div>
        <div className="bs-ticket-bottom">Booking first. The whole journey next.</div>
      </aside>
    </header>

    <div className="bs-section-head"><div><p className="bs-eyebrow">FOLLOW THE JOURNEY</p><h2>Every stage deserves a test.</h2></div><span>Choose a stage to explore</span></div>
    <div className="bs-stages" aria-label="Filter by trip stage">
      <button className={stage === 'all' ? 'is-active' : ''} aria-pressed={stage === 'all'} onClick={() => setStage('all')}><span className="bs-stage-num">ALL</span><strong>Full journey</strong><small>17 tests</small></button>
      {TRAVEL_STAGES.map((s, i) => <button key={s.key} className={stage === s.key ? 'is-active' : ''} aria-pressed={stage === s.key} onClick={() => setStage(s.key)}><span className="bs-stage-num">0{i + 1}</span><strong>{s.label}</strong><small>{protocol.filter(t => t.stage === s.key).length} tests</small></button>)}
    </div>

    <section className="bs-results" id="travel-results" aria-label="Travel benchmark results and protocol">
      <div className="bs-results-head"><div><h2>{selected?.label ?? 'Travel assistants'}</h2><p>{selected?.description ?? 'One shared benchmark. Different ways to get you there.'}</p></div><div className="bs-view" aria-label="View"><button aria-pressed={view === 'assistants'} className={view === 'assistants' ? 'is-active' : ''} onClick={() => setView('assistants')}>Assistants</button><button aria-pressed={view === 'protocol'} className={view === 'protocol' ? 'is-active' : ''} onClick={() => setView('protocol')}>Test protocol <span>{tasks.length}</span></button></div></div>
      {view === 'assistants' ? <>
        <div className="bs-filters"><label>Cohort<select value={cohort} onChange={e => setCohort(e.target.value)}><option value="pilot">First five</option><option value="all">All ten proposed</option></select></label><label>Assistant type<select value={type} onChange={e => setType(e.target.value)}><option value="all">All types</option><option value="specialist">Travel specialists</option><option value="general">General-purpose</option></select></label><label className="bs-search">Find an assistant<input type="search" placeholder="Search by name" value={query} onChange={e => setQuery(e.target.value)} /></label></div>
        <div className="bs-table-scroll" role="region" aria-label="Travel test coverage" tabIndex={0}><table className="bs-table"><caption className="bs-sr-only">Proposed cohort, not a ranking. All travel suite results are not tested.</caption><thead><tr><th scope="col">Assistant</th>{stages.map(s => <th key={s.key} scope="col">{s.short}<small>{protocol.filter(t => t.stage === s.key).length} tests</small></th>)}<th scope="col">Coverage</th></tr></thead><tbody>{shown.map(a => <tr key={a.slug}><th scope="row"><Link href={`/agents/${a.slug}`} className="bs-agent"><AgentIcon name={a.name} icon={a.icon} size={40} /><span><strong>{a.name}</strong><small>{a.kind === 'travel' ? 'Travel specialist' : 'General-purpose'}{TRAVEL_NEXT.includes(a.slug) ? ' · Next cohort' : ''}</small></span></Link></th>{stages.map(s => <td key={s.key}><span className="bs-unscored" aria-label={`${s.label}: not tested`} title="Not tested in the Travel suite">—</span></td>)}<td><span className="bs-coverage">0 / {tasks.length}</span><small>Not tested</small></td></tr>)}</tbody></table></div>
        {shown.length === 0 && <div className="bs-empty"><strong>No assistants match these filters.</strong><button className="bs-text-link" onClick={() => { setQuery(''); setType('all'); setCohort('pilot'); }}>Reset filters</button></div>}
        <div className="bs-table-note"><span><span className="bs-dot" /> {shown.length} assistants in view · no ranking yet</span><span>— Not tested, not a zero</span></div>
        <div className="bs-pilot-note"><span className="bs-note-icon" aria-hidden="true">↗</span><div><strong>Real bookings. Verifiable outcomes.</strong><p>The first pilot will focus on shopping, approval, ticketing and cancellation. Scores and evidence will appear here after testing. Existing General scores stay separate.</p><button className="bs-text-link" onClick={() => setView('protocol')}>See what each test measures →</button></div></div>
      </> : <div className="bs-protocol"><div className="bs-protocol-note"><strong>Draft protocol · 17 tests, six stages</strong><p>Proposed prompts and anchors from the supplied travel rubric. Multi-case tests and scoring rules still need final calibration. These are test specifications, not completed results.</p></div>{stages.map(s => <section key={s.key} className="bs-protocol-group"><h3>{s.label}<span>{s.description}</span></h3>{tasks.filter(t => t.stage === s.key).map(t => <details key={t.id} className="bs-task"><summary><span>{String(t.id).padStart(2, '0')}</span><strong>{t.title}</strong><span className="bs-task-plus" aria-hidden="true">+</span></summary><div className="bs-task-body"><p>{t.measures}</p><h4>Test prompt</h4><blockquote>{t.prompt}</blockquote>{t.setup && <><h4>Setup</h4><p>{t.setup}</p></>}<h4>Pass criteria</h4><ul>{t.pass.map((p, i) => <li key={i}>{p.replace(/^•\s*/, '')}</li>)}</ul><div className="bs-anchors">{Object.entries(t.anchors).map(([score, text]) => <div key={score}><strong>{score}<small>/10</small></strong><p>{text}</p></div>)}</div>{t.automaticOne && <p className="bs-failure"><strong>Automatic 1:</strong> {t.automaticOne}</p>}</div></details>)}</section>)}</div>}
    </section>
    <section className="bs-principles"><div><span>01 / Evidence</span><h3>Show what happened.</h3><p>Every future score should lead to a test, an outcome and supporting evidence.</p></div><div><span>02 / Comparability</span><h3>Compare the same work.</h3><p>Live execution, research and simulations should be labeled separately.</p></div><div><span>03 / Coverage</span><h3>Make the gaps visible.</h3><p>Untested capabilities remain unscored. A promise is not a completed booking.</p></div></section>
  </>;
}
