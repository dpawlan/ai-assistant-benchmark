import { TRAVEL_REPORT_AGENTS } from '@/lib/travel-suite';
import Link from 'next/link';
import { BOOKING_SPEED_BANDS } from '@/lib/travel-speed';
import { BenchmarkNav } from '@/components/BenchmarkNav';
import type { Metadata } from 'next';
import { getAgents } from '@/lib/data';
import protocol from '../../../../../data/travel-protocol-v1.json';

export const metadata: Metadata = { title: 'Travel dimensions', robots: { index: false, follow: false } };

export default function TravelDimensionsPage() {
  const agents = getAgents().filter(a => TRAVEL_REPORT_AGENTS.includes(a.slug));
  return <div className="wrap">
    <div className="ag-top"><Link className="back" href="/benchmarks/travel">← Travel assistants</Link></div>
    <div className="page-head"><h1 className="page-title">Dimensions</h1><p className="page-sub">Eight v1 dimensions. Open one to see results and test documentation. Observed results are labeled separately from the prescribed tests.</p></div>
    <BenchmarkNav active="travel" section="dimensions" />
    <section className="shelf"><h2 className="shelf-title"><span className="shelf-head">{protocol.length} dimensions</span></h2><div className="cat-list">
      {protocol.map((t, index) => { const tested = agents.filter(a => a.travel.scores[t.id] !== undefined).length; return <Link key={t.id} href={`/benchmarks/travel/dimensions/${t.id}`} className="cat-row"><span className="cat-num">{index + 1}</span><span className="cat-body"><span className="cat-label">{t.title}</span><span className="cat-desc">{t.measures}</span></span><span className="row-slot"><span className={`pill${tested ? '' : ' muted'}`}>{tested ? `${tested} tested` : 'Untested'}</span></span></Link>; })}
    </div></section>
    <section className="shelf"><h2 className="ag-h2">Time to complete</h2><p className="ag-sub">Booking time runs from flight selection to confirmation, including checkout, approvals and handoffs. Times are approximate.</p><details className="travel-assessment"><summary>Booking speed thresholds</summary><div className="info-list">{BOOKING_SPEED_BANDS.map((band, index) => <div className="info-row" key={band.score}><span className="il">{index === 0 ? `Up to ${band.maxMinutes} minutes` : `Over ${BOOKING_SPEED_BANDS[index - 1].maxMinutes}, up to ${band.maxMinutes} minutes`}</span><span className="iv">{band.score}/10</span></div>)}<div className="info-row"><span className="il">Over 120 minutes</span><span className="iv">1/10</span></div></div></details></section>
    <section className="how" id="how">
      <h2 className="ag-h2">How scoring works</h2>
      <BenchmarkNav active="travel" section="scoring" />
      <p className="ag-sub">We score each task from 1–10. The latest reviewed result counts; untested tasks stay blank. Travel overall is the average of tested dimensions.</p>
      <details className="travel-assessment"><summary>Scoring and ranking details</summary>
        <p>10 means the task completed without avoidable troubleshooting; 7 reflects recovery work or unresolved details; 3 means it was not completed. Routine choices, payment approval and secure sign-in are not penalties. Proactiveness and booking speed use their own criteria.</p>
        <p>Rankings account for coverage by adding three neutral scores of 5: (total scores + 15) ÷ (tested dimensions + 3). Displayed averages are unchanged. Assistants need at least three scored dimensions to appear.</p>
      </details>
      <div className="info-list">
        <div className="info-row"><span className="il">A tested score</span><span className="iv">1 – 10</span></div>
        <div className="info-row"><span className="il">Not tested yet</span><span className="iv empty">—</span></div>
        <div className="info-row"><span className="il">Travel overall</span><span className="iv">Mean of tested dimensions</span></div>
        <div className="info-row"><span className="il">Protocol</span><span className="iv">travel-v1 · Draft</span></div>
      </div>
    </section>
  </div>;
}
