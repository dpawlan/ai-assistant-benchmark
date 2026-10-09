import { existsSync } from 'node:fs';
import Link from 'next/link';
import { travelEvidenceFiles } from '@/lib/travel-evidence-media';
import { TravelReportRecordings } from './TravelReportRecordings';
import { Markdown } from './Markdown';
import timings from '../../data/travel-completion-times.json';

export function MisoReportReview({ body }: { body: string }) {
  const local = process.env.NODE_ENV === 'development' && existsSync(travelEvidenceFiles['r2-miso'].video);
  const timing = timings.filter(t => t.agent === 'miso' && t.dimension === 5).sort((a, b) => b.round - a.round)[0];
  return <div className="miso-review">
    <div className="miso-review-stats">
      <div><span>Our pick for</span><strong>Premium support</strong></div>
      <Link href="/benchmarks/travel/dimensions/19#miso"><span>Time to book</span><strong>~{timing.minutes} min</strong></Link>
      <div><span>Fare booked</span><strong>$258.40 <small>Economy</small></strong></div>
    </div>
    <p className="miso-timing-note">To initial confirmation; excludes prior profile setup and confirmation-page troubleshooting.</p>
    <div className="miso-review-layout">
      <figure className="miso-review-feature">
        {local ? <video controls playsInline preload="none" poster="/travel-posters/miso.svg" src="/api/travel-evidence/r2-miso.mp4" aria-label="Miso booking and follow-up recording"><track kind="captions" /></video> : <div className="miso-recording-placeholder"><span aria-hidden="true">▶</span><strong>Inside the Miso experience</strong><span>Recording available after redaction</span></div>}
        <figcaption><strong>A trip managed through chat</strong><span>Booking, changes and seat selection—with human support for exceptions.</span>{local && <small>Full session · Local, unredacted recording</small>}</figcaption>
      </figure>
      <div className="miso-review-findings">
        <h3>Where it worked</h3>
        <ul><li>Used saved traveler details and handled changes through iMessage.</li><li>Human support recovered the seat map and resolved the seat-fee refund.</li></ul>
        <h3>Where it missed</h3>
        <ul><li>No Basic Economy in the available inventory.</li><li>The seat-fee refund needed a human handoff.</li></ul>
        <Link href="/benchmarks/travel/dimensions/8#miso">See cancellation evidence →</Link>
      </div>
    </div>
    <div className="miso-review-takeaway"><span>Our takeaway</span><p>A strong fit if you want someone to manage the details—and a human to step in when needed.</p></div>
    <details className="travel-report-recordings"><summary>Full assessment and evidence</summary><Markdown body={body} /></details>
    <TravelReportRecordings agent="miso" name="Miso" />
  </div>;
}
