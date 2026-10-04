import Link from 'next/link';
import { BenchmarkNav } from '@/components/BenchmarkNav';
import { getAgents } from '@/lib/data';
import { ScoreCell } from '@/components/ScoreCell';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import protocol from '../../../../../../data/travel-protocol-draft.json';

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
    <div className="page-head"><p className="cat-kicker">Dimension {task.id} of {protocol.length} · Draft</p><h1 className="page-title">{task.title}</h1><p className="page-sub">{task.measures}</p></div>
    <BenchmarkNav active="travel" section="dimensions" />
    <section className="task-card"><div className="task-head"><h2 className="ag-h2">The test</h2></div><blockquote className="task-prompt">{task.prompt}</blockquote>
      {task.setup && <><h3 className="group-title">Setup</h3><p className="ag-sub">{task.setup}</p></>}
      <h3 className="group-title">Passes when</h3><ul className="task-list">{task.pass.map((p, i) => <li key={i}>{p.replace(/^•\s*/, '')}</li>)}</ul>
      <h3 className="group-title">Scoring anchors</h3>{Object.entries(task.anchors).map(([score, text]) => <p className="ag-sub" key={score}><strong>{score}/10:</strong> {text}</p>)}
      {task.automaticOne && <p className="ag-sub"><strong>Automatic 1:</strong> {task.automaticOne}</p>}
    </section><section className="shelf"><h2 className="ag-h2">Results</h2>{tested.length === 0 ? <p className="ag-sub">Not tested yet. This is a draft specification.</p> : tested.map(a => {
      const run = a.travel.runs[task.id];
      return <div className="info-row" id={a.slug} key={a.slug}><span className="il"><Link href={`/agents/${a.slug}`}>{a.name}</Link> · {run.date} · <a href={run.evidence_url}>Evidence</a></span><ScoreCell value={run.score} /></div>;
    })}</section>
  </div>;
}
