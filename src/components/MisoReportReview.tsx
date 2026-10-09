import Image from 'next/image';
import Link from 'next/link';
import { Markdown } from './Markdown';
import timings from '../../data/travel-completion-times.json';

export function MisoReportReview({ body }: { body: string }) {
  const timing = timings.filter(t => t.agent === 'miso' && t.dimension === 5).sort((a, b) => b.round - a.round)[0];
  return <div className="miso-review">
    <div className="miso-review-stats">
      <div><span>Our pick for</span><strong>Premium support</strong></div>
      <Link href="/benchmarks/travel/dimensions/19#miso"><span>Time to book</span><strong>~{timing.minutes} min</strong></Link>
      <div><span>Fare booked</span><strong>$258.40 <small>Economy</small></strong></div>
    </div>
    <p className="miso-timing-note">To initial confirmation; excludes prior profile setup and confirmation-page troubleshooting.</p>
    <div className="miso-review-layout">
      <div className="miso-review-screenshots">
        <figure className="miso-review-feature">
          <a href="/travel-evidence/miso-refund-handoff.png" target="_blank" rel="noreferrer"><Image src="/travel-evidence/miso-refund-handoff.png" alt="Miso confirms the flight cancellation and escalates the separate seat-fee refund to its team." width={1124} height={820} unoptimized /></a>
          <figcaption><strong>Cancellation confirmed. Seat refund handed to the team.</strong><span>This captured exchange shows the handoff; the tester subsequently confirmed that human support resolved the refund.</span></figcaption>
        </figure>
        <figure className="miso-review-feature">
          <Image src="/travel-evidence/miso-fare.png" alt="Booking invoice showing a total charge of $258.40." width={826} height={58} unoptimized />
          <figcaption><strong>The actual fare: $258.40</strong><span>Economy; Basic Economy was not available in Miso’s inventory.</span></figcaption>
        </figure>
      </div>
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
  </div>;
}
