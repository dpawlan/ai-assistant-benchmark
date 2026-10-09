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
    <section className="shelf"><h2 className="ag-h2">Time to complete</h2><p className="ag-sub">Booking time starts when the tester selects a flight and asks to book it, and stops at booking confirmation. All checkout questions, fare clarification, traveler details, payment setup, approvals, waiting and verification count. Other dimensions retain their separately labeled request-to-outcome timings. Times are approximate, and missing measurements are labeled. Unfinished tasks have no completion time. Cancellation timing ends at confirmation, not bank settlement; outstanding refunds are documented separately. Booking speed is an equal dimension in Travel overall, ranking and tested-dimension coverage. Only onboarding and search before the selected-flight booking request are excluded. An explicit restart begins a separate attempt; earlier failed attempts remain documented, and gaps between attempts are excluded.</p><h3 className="ag-h2">Booking speed · provisional v1</h3><p className="ag-sub">Fixed thresholds apply equally to every completed booking. Scores use the displayed approximate minutes and may change with more precise measurements. Unfinished or unmeasured bookings receive no speed score. These thresholds apply to booking only.</p><div className="info-list">{BOOKING_SPEED_BANDS.map((band, index) => <div className="info-row" key={band.score}><span className="il">{index === 0 ? `Up to ${band.maxMinutes} minutes` : `Over ${BOOKING_SPEED_BANDS[index - 1].maxMinutes}, up to ${band.maxMinutes} minutes`}</span><span className="iv">{band.score}/10</span></div>)}<div className="info-row"><span className="il">Over 120 minutes</span><span className="iv">1/10</span></div></div></section>
    <section className="how" id="how">
      <h2 className="ag-h2">How scoring works</h2>
      <BenchmarkNav active="travel" section="scoring" />
      <p className="ag-sub">Each travel dimension is scored from 1–10 against the actual request and outcome. Only reviewed results with supporting evidence count. Open a dimension above for its results and test documentation.</p>
      <p className="ag-sub">The latest reviewed result counts for each dimension. The equal-weight average of tested dimensions, including booking speed, becomes the Travel score, rounded to one decimal. The same score appears in General’s Travel dimension and counts once toward its overall score.</p>
      <p className="ag-sub">Observed tasks are scored against what was actually requested: 10/10 requires completing the task without avoidable user effort. Successful tasks requiring retries, repeated entry, troubleshooting or recovery takeovers receive 7/10; unresolved confirmation or refund details also prevent a perfect score. Ordinary choices, approvals and secure credential/payment entry do not reduce scores. A user’s own account mismatch is not penalized, but broken recovery flows are. The same friction is attributed to its primary dimension rather than deducted again elsewhere. Untested dimensions and unrequested variants stay blank and do not lower the score.</p>
      <p className="ag-sub">Assistants appear in the Travel category after at least three dimensions have reviewed scores. Travel rankings also account for how much has been tested. We add three neutral results at 5/10 when calculating the ranking: (sum of tested dimension scores + 15) ÷ (number of tested dimensions + 3). Strong results across more dimensions rank higher than the same average from fewer tests. The displayed score remains the actual average; ranking ties are alphabetical.</p>
      <p className="ag-sub">Proactiveness assesses useful, accurate unprompted initiative across the opportunities available, not question count. Travel profile assesses accurate collection and use of traveler details during checkout, as well as demonstrated saving, retrieval or updates. Long-term memory is not required.</p>
      <div className="info-list">
        <div className="info-row"><span className="il">A tested score</span><span className="iv">1 – 10</span></div>
        <div className="info-row"><span className="il">Not tested yet</span><span className="iv empty">—</span></div>
        <div className="info-row"><span className="il">Travel overall</span><span className="iv">Mean of tested dimensions</span></div>
        <div className="info-row"><span className="il">Protocol</span><span className="iv">travel-v1 · Draft</span></div>
      </div>
    </section>
  </div>;
}
