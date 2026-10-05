import Link from 'next/link';
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
  const tested = getAgents().filter(a => a.travel.runs[task.id]);
  return <div className="wrap">
    <div className="ag-top"><Link className="back" href="/benchmarks/travel/dimensions">← Travel dimensions</Link></div>
    <div className="page-head"><p className="cat-kicker">Dimension {protocol.findIndex(t => t.id === task.id) + 1} of {protocol.length} · Draft</p><h1 className="page-title">{task.title}</h1><p className="page-sub">{task.measures}</p></div>
    <BenchmarkNav active="travel" section="dimensions" />
    <section className="task-card"><div className="task-head"><h2 className="ag-h2">The test</h2></div><blockquote className="task-prompt">{task.prompt}</blockquote>
      {task.setup && <><h3 className="group-title">Setup</h3><p className="ag-sub">{task.setup}</p></>}
      <h3 className="group-title">Passes when</h3><ul className="task-list">{task.pass.map((p, i) => <li key={i}>{p.replace(/^•\s*/, '')}</li>)}</ul>
      <h3 className="group-title">Scoring anchors</h3>{Object.entries(task.anchors).map(([score, text]) => <p className="ag-sub" key={score}><strong>{score}/10:</strong> {text}</p>)}
      {task.automaticOne && <p className="ag-sub"><strong>Automatic 1:</strong> {task.automaticOne}</p>}
    </section><section className="shelf"><h2 className="ag-h2">Results</h2>{tested.length === 0 ? <p className="ag-sub">Not tested yet. This is a draft specification.</p> : tested.map(a => {
      const run = a.travel.runs[task.id];
      return <div className="info-row" id={a.slug} key={a.slug}><span className="il"><Link href={`/agents/${a.slug}`}>{a.name}</Link> · {run.date} · {run.protocol === 'observed' ? 'Observed task' : 'Test'} · <a href={run.evidence_url}>Evidence</a>{run.notes && <span className="run-line">{run.notes}</span>}</span><ScoreCell value={run.score} /></div>;
    })}</section>
    <section className="shelf travel-documentation" aria-labelledby="test-documentation">
      <h2 className="ag-h2" id="test-documentation">Test details</h2>
      <p className="ag-sub">Recordings, screenshots and a walkthrough of each assistant’s test will appear here.</p>
      <div className="travel-evidence-grid">
        <figure>
          <div className="travel-media-placeholder"><span>Screen recording</span><span>Not added yet</span></div>
          <figcaption>The recorded test, with timestamps for key steps.</figcaption>
        </figure>
        <figure>
          <div className="travel-media-placeholder"><span>Screenshots</span><span>Not added yet</span></div>
          <figcaption>Key moments, with captions explaining what happened.</figcaption>
        </figure>
      </div>
      <dl className="info-list">
        <div className="info-row"><dt className="il">Request &amp; setup</dt><dd className="iv">Actual request and starting conditions — to be added</dd></div>
        <div className="info-row"><dt className="il">Outcome &amp; score</dt><dd className="iv">Result, any intervention and scoring rationale — to be added</dd></div>
      </dl>
    </section>
  </div>;
}
