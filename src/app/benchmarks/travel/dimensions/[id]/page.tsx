import Link from 'next/link';
import { AgentIcon } from '@/components/AgentIcon';
import allRuns from '../../../../../../data/travel-results.json';
import roundTwo from '../../../../../../data/travel-round-2.json';
import { travelSessionPreview } from '@/lib/travel-session-preview';
import { BenchmarkNav } from '@/components/BenchmarkNav';
import { getAgents } from '@/lib/data';
import { ScoreCell } from '@/components/ScoreCell';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import protocol from '../../../../../../data/travel-protocol-v1.json';

type Props = { params: Promise<{ id: string }> };
export function generateStaticParams() { return protocol.map(t => ({ id: String(t.id) })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: protocol.find(t => String(t.id) === id)?.title ?? 'Not found', robots: { index: false, follow: false } };
}
export default async function TravelDimensionPage({ params }: Props) {
  const { id } = await params;
  const task = protocol.find(t => String(t.id) === id);
  if (!task) notFound();
  const agents = getAgents();
  const tested = agents.filter(a => a.travel.runs[task.id]);
  const participants = agents.filter(a => a.travel.runs[task.id] || (task.id !== 9 && travelSessionPreview.some(r => r.slug === a.slug)));
  const dimensionIndex = [18, 5, 6, 7, 8].indexOf(task.id);
  return <div className="wrap">
    <div className="ag-top"><Link className="back" href="/benchmarks/travel/dimensions">← Travel dimensions</Link></div>
    <div className="page-head"><p className="cat-kicker">Dimension {protocol.findIndex(t => t.id === task.id) + 1} of {protocol.length} · Draft</p><h1 className="page-title">{task.title}</h1><p className="page-sub">{task.measures}</p></div>
    <BenchmarkNav active="travel" section="dimensions" />
    <section className="shelf"><h2 className="ag-h2">Results</h2>{tested.length === 0 ? <p className="ag-sub">Not tested yet.</p> : tested.map(a => {
      const run = a.travel.runs[task.id];
      return <div className="info-row" key={a.slug}><span className="il"><Link href={`/agents/${a.slug}`}>{a.name}</Link> · {run.date} · {run.protocol === 'observed' ? 'Observed task' : 'Test'} · <a href={`#${a.slug}`}>Test details ↓</a>{run.notes && <span className="run-line">{run.notes}</span>}</span><ScoreCell value={run.score} /></div>;
    })}</section>
    <section className="shelf travel-documentation" aria-labelledby="test-documentation">
      <h2 className="ag-h2" id="test-documentation">Test details</h2>
      {participants.map(a => {
        const previous = allRuns.filter(r => r.agent === a.slug && r.dimension === task.id && r.reviewed && r.date < '2026-10-07').sort((a,b) => b.date.localeCompare(a.date))[0];
        const recent = roundTwo.find(r => r.agent === a.slug && r.dimension === task.id);
        const session = dimensionIndex >= 0 ? travelSessionPreview.find(r => r.slug === a.slug) : undefined;
        const note = session?.notes[dimensionIndex];
        const untested = task.id === 8 || note === 'Not documented in this session.' || (task.id === 6 && a.slug !== 'miso') || (a.slug === 'soar' && task.id !== 5);
        return <article className="travel-dimension-evidence" id={a.slug} key={a.slug}>
          <div className="travel-evidence-heading"><AgentIcon name={a.name} icon={a.icon} size={32} /><h3 className="ag-h2">{a.name}</h3></div>
          {recent && <>
            <div className="info-row"><span className="il">Round 2 · October 7, 2026</span><ScoreCell value={recent.score} /></div>
            <p>{recent.notes}</p>
            <p className="ag-sub">{task.id === 6 ? '“Can you move me to a premium seat?”' : task.id === 8 ? '“Cancel everything”' : '“Actually, can you move the flight to the day after?”'} · Scored from the supplied session record.</p>
            <div className="travel-evidence-grid">
              <figure><div className="travel-media-placeholder"><span>{task.title} recording</span><span>Not uploaded yet</span></div><figcaption>{a.name} · Round 2 · {task.title} steps and confirmation.</figcaption></figure>
              <figure><div className="travel-media-placeholder"><span>Screenshots</span><span>Not uploaded yet</span></div><figcaption>The request, approval and {task.title.toLowerCase()} outcome.</figcaption></figure>
            </div>
          </>}
          {session && <>
            <p className="ag-sub">October 6, 2026 · NYC → Chicago · {session.channel}</p>
            <p>{note}</p>
            <p className="ag-sub">{untested ? 'Not tested in this session' : 'Score pending review'}</p>
            {!untested && <div className="travel-evidence-grid">
              <figure><div className="travel-media-placeholder"><span>{task.title} recording</span><span>Not uploaded yet</span></div><figcaption>{a.name}’s {task.title.toLowerCase()} steps. Relevant timestamps will be added to the session recording.</figcaption></figure>
              <figure><div className="travel-media-placeholder"><span>Screenshots</span><span>Not uploaded yet</span></div><figcaption>{task.title} requests, actions and outcome.</figcaption></figure>
            </div>}
          </>}
          {previous && <div className="travel-previous-result"><p className="ag-sub">Reviewed result · {previous.date}</p><div className="info-row"><span className="il">{previous.notes}</span><ScoreCell value={previous.score} /></div><a href={previous.evidence_url}>View supporting evidence →</a></div>}
        </article>;
      })}
      <p className="ag-sub">Full report: <Link href="/reports/nyc-chicago">Which AI assistant can actually book your flight? →</Link></p>
    </section>
  </div>;
}
