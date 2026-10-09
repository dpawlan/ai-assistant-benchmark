import { TRAVEL_REPORT_AGENTS } from '@/lib/travel-suite';
import Link from 'next/link';
import { TravelEvidenceMedia } from '@/components/TravelEvidenceMedia';
import { TravelCompletionTime } from '@/components/TravelCompletionTime';
import { AgentIcon } from '@/components/AgentIcon';
import allRuns from '../../../../../../data/travel-results.json';
import roundOne from '../../../../../../data/travel-round-1.json';
import timings from '../../../../../../data/travel-completion-times.json';
import roundThree from '../../../../../../data/travel-round-3.json';
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
  const agents = getAgents().filter(a => TRAVEL_REPORT_AGENTS.includes(a.slug));
  const tested = agents.filter(a => a.travel.runs[task.id]);
  const participants = agents.filter(a => a.travel.runs[task.id] || (a.slug === 'soar' && [6, 8, 9, 19].includes(task.id)) || (task.id !== 9 && task.id !== 19 && task.id !== 20 && travelSessionPreview.some(r => r.slug === a.slug)));
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
        const timing = timings.filter(t => t.agent === a.slug && t.dimension === 5).sort((a, b) => b.round - a.round)[0];
        const previous = allRuns.filter(r => r.agent === a.slug && r.dimension === task.id && r.reviewed && r.date < '2026-10-06').sort((a,b) => b.date.localeCompare(a.date))[0];
        const firstRound = roundOne.find(r => r.agent === a.slug && r.dimension === task.id && r.reviewed);
        const latest = roundThree.find(r => r.agent === a.slug && r.dimension === task.id);
        const recent = roundTwo.find(r => r.agent === a.slug && r.dimension === task.id && r.reviewed);
        const session = dimensionIndex >= 0 ? travelSessionPreview.find(r => r.slug === a.slug) : undefined;
        const note = session?.notes[dimensionIndex];
        const untested = (task.id === 7 && ['instinct', 'grok-bot'].includes(a.slug)) || task.id === 8 || note === 'Not documented in this session.' || (task.id === 6 && a.slug !== 'miso') || (a.slug === 'soar' && task.id !== 5);
        return <article className="travel-dimension-evidence" id={a.slug} key={a.slug}>
          <div className="travel-evidence-heading"><AgentIcon name={a.name} icon={a.icon} size={32} /><h3 className="ag-h2">{a.name}</h3></div>
          {a.slug === 'soar' && [8, 9].includes(task.id) && <p className="ag-sub">Not reached in the latest retest: the session ended during booking-confirmation troubleshooting. No score has been assigned for this task. <a href="https://stmy6z4b3h.s.stableupload.dev/round3.html#transcripts">See the latest session →</a></p>}
          {a.slug === 'soar' && task.id === 6 && <><p className="ag-sub">Seat selection is not yet verified. The full latest transcript describes a fare with a Main Cabin seat included, but does not identify a chosen seat number or confirm a seat-selection action. The booking itself has been verified directly with AA by the reviewer.</p><TravelEvidenceMedia agent={a.slug} name={a.name} round={3} dimension={6} /></>}
          {latest && <>
            <div className="info-row"><span className="il">Round 3 · October 8, 2026 · NYC → Miami</span><ScoreCell value={latest.score} /></div>
            <p>{latest.notes}</p>
            {task.id === 5 && <p className="ag-sub"><TravelCompletionTime agent={a.slug} round={3} detail /></p>}
            <p className="ag-sub">Latest observed result assessed against the benchmark’s 10-point criteria. The source’s separate 1–5 phase scores are retained in the notes where applicable; they are not directly averaged into this benchmark.</p>
            <TravelEvidenceMedia agent={a.slug} name={a.name} round={3} dimension={task.id} />
          </>}
          {task.id === 20 && !latest && <><p>{a.travel.runs[20]?.notes}</p><p className="ag-sub">Observed initiative across the available October 6–7 sessions. Actions requested by the tester are not credited as unprompted.</p><a href={a.travel.runs[20]?.evidence_url}>View source report and transcripts →</a><TravelEvidenceMedia agent={a.slug} name={a.name} round={1} dimension={20} /><TravelEvidenceMedia agent={a.slug} name={a.name} round={2} dimension={20} /></>}
          {task.id === 19 && <><p>{a.travel.runs[19]?.notes}</p><p className="ag-sub"><TravelCompletionTime agent={a.slug} dimension={5} detail /></p><Link href={`/benchmarks/travel/dimensions/5#${a.slug}`}>View booking test details →</Link><p><Link href="/benchmarks/travel/dimensions#how">Scoring methodology →</Link></p>{!latest && <TravelEvidenceMedia agent={a.slug} name={a.name} round={timing?.round ?? 1} dimension={5} />}</>}
          {recent && <>
            <div className="info-row"><span className="il">Round 2 · October 7, 2026</span><ScoreCell value={recent.score} /></div>
            <p>{recent.notes}</p><p className="ag-sub"><TravelCompletionTime agent={a.slug} dimension={task.id} round={2} detail /></p>
            <p className="ag-sub">{task.id === 5 ? '“Book a one-way flight from NYC to Chicago”' : task.id === 18 ? 'Account and traveler setup before booking' : task.id === 7 ? 'Traveler details used during the booking flow' : task.id === 6 ? '“Can you move me to a premium seat?”' : task.id === 8 ? '“Cancel everything”' : '“Actually, can you move the flight to the day after?”'} · Scored from the supplied session record.</p>
            <TravelEvidenceMedia agent={a.slug} name={a.name} round={2} dimension={task.id} />
          </>}
          {session && <>
            <div className="info-row"><span className="il">Round 1 · October 6, 2026 · {session.channel}</span>{firstRound && <ScoreCell value={firstRound.score} />}</div>
            <p>{firstRound?.notes ?? note}</p><p className="ag-sub"><TravelCompletionTime agent={a.slug} dimension={task.id} round={1} detail /></p>
            {!firstRound && <p className="ag-sub">{untested ? 'Not tested in this session' : a.slug === 'muse' && task.id === 5 ? 'Unscored · Payment connection blocked' : 'Score pending review'}</p>}
            {!untested && <TravelEvidenceMedia agent={a.slug} name={a.name} round={1} dimension={task.id} />}
          </>}
          {previous && <div className="travel-previous-result"><p className="ag-sub">Reviewed result · {previous.date}</p><div className="info-row"><span className="il">{previous.notes}</span><ScoreCell value={previous.score} /></div><a href={previous.evidence_url}>View supporting evidence →</a></div>}
        </article>;
      })}
      <p className="ag-sub">Full report: <Link href="/reports/nyc-chicago">Which AI assistant can actually book your flight? →</Link></p>
    </section>
  </div>;
}
