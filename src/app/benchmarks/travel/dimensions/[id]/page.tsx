import Link from 'next/link';
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
  return <div className="wrap">
    <div className="ag-top"><Link className="back" href="/benchmarks/travel/dimensions">← Travel dimensions</Link></div>
    <div className="page-head"><p className="cat-kicker">Dimension {task.id} of {protocol.length} · Draft</p><h1 className="page-title">{task.title}</h1><p className="page-sub">{task.measures}</p></div>
    <section className="task-card"><div className="task-head"><h2 className="ag-h2">The test</h2></div><blockquote className="task-prompt">{task.prompt}</blockquote>
      {task.setup && <><h3 className="group-title">Setup</h3><p className="ag-sub">{task.setup}</p></>}
      <h3 className="group-title">Passes when</h3><ul className="task-list">{task.pass.map((p, i) => <li key={i}>{p.replace(/^•\s*/, '')}</li>)}</ul>
      <h3 className="group-title">Scoring anchors</h3>{Object.entries(task.anchors).map(([score, text]) => <p className="ag-sub" key={score}><strong>{score}/10:</strong> {text}</p>)}
      {task.automaticOne && <p className="ag-sub"><strong>Automatic 1:</strong> {task.automaticOne}</p>}
    </section><p className="ag-sub">Testing coming soon. This is a draft specification; no scores have been published.</p>
  </div>;
}
