import Link from 'next/link';
import { TravelEvidenceMedia } from './TravelEvidenceMedia';
import { AgentIcon } from './AgentIcon';
import { TravelCompletionTime } from './TravelCompletionTime';
import type { Usage } from '@/lib/types';
import allProtocol from '../../data/travel-protocol-v1.json';
const protocol = allProtocol.filter(t => t.id !== 19 && t.id !== 20);

type TestAgent = { slug: string; name: string; icon: string | null; usage: Usage | null };
import { travelSessionPreview as results } from '@/lib/travel-session-preview';

export function TravelTestReport({ agents, initialDimension, selectedAgent }: { agents: TestAgent[]; initialDimension: number; selectedAgent?: string }) {
  const selected = results.some(r => r.slug === selectedAgent) ? selectedAgent! : 'grok-bot';
  const dimension = protocol.some(t => t.id === initialDimension) ? initialDimension : 5;
  const result = results.find(r => r.slug === selected)!;
  const agent = agents.find(a => a.slug === selected);
  const index = protocol.findIndex(t => t.id === dimension);
  return <>
    <p className="ag-sub">Layout preview using the supplied session summary. New dimension scores have not been assigned.</p>
    <section className="shelf"><h2 className="ag-h2">The request</h2><blockquote className="travel-test-prompt">I want to book a one way flight to chicago from NYC this weekend. I want to leave Friday night and get in at a reasonable time.</blockquote><p className="ag-sub">Tested October 6 · Requested departure October 9, 2026 · NYC → Chicago</p></section>
    <section className="shelf"><h2 className="ag-h2">Results at a glance</h2>
      <div className="matrix-wrap" role="region" aria-label="Flight booking outcomes" tabIndex={0}><table className="matrix travel-test-table"><thead><tr><th scope="col">Assistant</th><th scope="col">Outcome</th><th scope="col">Paid</th><th scope="col">Time to complete</th><th scope="col">Session length</th><th scope="col">Evidence</th></tr></thead><tbody>{results.map(r => { const a = agents.find(a => a.slug === r.slug); return <tr key={r.slug}><th scope="row"><span className="mx-agent"><AgentIcon name={a?.name ?? r.slug} icon={a?.icon ?? null} size={28} /><span>{a?.name ?? r.slug}<span className="run-line">{r.channel}</span></span></span></th><td>{r.outcome}</td><td>{r.price}</td><td><TravelCompletionTime agent={r.slug} round={1} /></td><td>{r.duration}</td><td><a href={`?assistant=${r.slug}&dimension=${dimension}#assistant-evidence`}>View test →</a></td></tr>; })}</tbody></table></div>
      <p className="ag-sub">Booking time measures the selected-flight booking request through confirmation, including all checkout questions, setup, approvals and verification. Session length is the recording duration. This table covers round one only; subsequent results appear in the dimension pages. Basic and standard Economy fares are different products.</p>
    </section>
    <section className="shelf" id="assistant-evidence"><h2 className="ag-h2">Test details</h2>
      <div className="travel-test-controls" aria-label="Choose an assistant">{results.map(r => <a key={r.slug} aria-current={selected === r.slug ? "true" : undefined} href={`?assistant=${r.slug}&dimension=${dimension}#assistant-evidence`}>{agents.find(a => a.slug === r.slug)?.name ?? r.slug}</a>)}</div>
      <div className="travel-test-controls" aria-label="Choose a dimension">{protocol.map(t => <a key={t.id} aria-current={dimension === t.id ? "true" : undefined} href={`?assistant=${selected}&dimension=${t.id}#assistant-evidence`}>{t.title}</a>)}</div>
      <h3 className="ag-h2">{agent?.name ?? selected} · {protocol[index].title}</h3><p>{result.notes[index]}</p>
      <p className="ag-sub">{dimension === 8 ? 'Not tested' : 'Score pending evidence review'} · <Link href={`/benchmarks/travel/dimensions/${dimension}#${selected}`}>View dimension results →</Link></p>
      <TravelEvidenceMedia agent={selected} name={agent?.name ?? selected} round={1} dimension={dimension} />
    </section>
  </>;
}
