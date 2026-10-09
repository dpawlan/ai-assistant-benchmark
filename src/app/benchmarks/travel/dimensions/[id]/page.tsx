import { TRAVEL_REPORT_AGENTS } from '@/lib/travel-suite';
import Link from 'next/link';
import { TravelEvidenceMedia } from '@/components/TravelEvidenceMedia';
import { TravelCompletionTime } from '@/components/TravelCompletionTime';
import { AgentIcon } from '@/components/AgentIcon';
import timings from '../../../../../../data/travel-completion-times.json';
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
  const latestMinutes = (slug: string) => timings.filter(t => t.agent === slug && t.dimension === 5).sort((a, b) => b.round - a.round)[0]?.minutes ?? Infinity;
  const agents = getAgents().filter(a => TRAVEL_REPORT_AGENTS.includes(a.slug)).sort((a, b) =>
    (b.travel.scores[task.id] ?? -1) - (a.travel.scores[task.id] ?? -1)
    || (task.id === 19 ? latestMinutes(a.slug) - latestMinutes(b.slug) : 0)
    || a.name.localeCompare(b.name)
  );
  return <div className="wrap">
    <div className="ag-top"><Link className="back" href="/benchmarks/travel/dimensions">← Travel dimensions</Link></div>
    <div className="page-head"><h1 className="page-title">{task.title}</h1><p className="page-sub">{task.measures}</p></div>
    <BenchmarkNav active="travel" section="dimensions" />
    {task.id === 19 && <p className="ag-sub">We time each booking from flight selection to confirmation, including checkout, approvals and handoffs. Times are approximate; the speed score uses fixed time bands out of 10.</p>}
    <section className="shelf">
      {agents.map(a => {
        const run = a.travel.runs[task.id];
        if (!run) return null;
        const timing = timings.filter(t => t.agent === a.slug && t.dimension === 5).sort((a, b) => b.round - a.round)[0];
        const round = task.id === 19 ? timing?.round ?? 1 : run.date >= '2026-10-08' ? 3 : run.date >= '2026-10-07' ? 2 : 1;
        return <article className="travel-dimension-evidence" id={a.slug} key={a.slug}>
          <div className="travel-evidence-heading"><AgentIcon name={a.name} icon={a.icon} size={32} /><h2 className="ag-h2">{a.name}</h2>{task.id !== 19 && <ScoreCell value={run.score} />}</div>
          {task.id === 19 ? <>
            <TravelCompletionTime agent={a.slug} labeled />
            <details className="travel-assessment"><summary>Timing details</summary><p>{timing?.note}</p></details>
          </> : <p>{run.notes?.replace(/ Source (booking|seat|cancellation|rebooking) phase: [\d.]+\/5\./g, '')}</p>}
          <TravelEvidenceMedia agent={a.slug} name={a.name} round={round} dimension={task.id === 19 ? 5 : task.id} />
        </article>;
      })}
      <p><Link href="/benchmarks/travel/dimensions#how">Scoring methodology →</Link> · <Link href="/reports/consumer-ai-travel">Consumer travel report →</Link></p>
    </section>
  </div>;
}
