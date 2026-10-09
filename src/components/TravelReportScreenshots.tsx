import Image from 'next/image';
import { existsSync } from 'node:fs';
import { travelEvidenceFiles } from '@/lib/travel-evidence-media';

export function TravelReportScreenshots({ agent, name }: { agent: string; name: string }) {
  const recordings = Object.entries(travelEvidenceFiles).filter(([key]) =>
    key.replace(/^r\d+-/, '').replace(/-cancel$/, '') === agent
  );
  const available = process.env.NODE_ENV === 'development'
    ? recordings.filter(([, file]) => file.image && existsSync(file.image)) : [];
  return <details className="travel-report-recordings">
    <summary>Screenshots</summary>
    {agent === 'miso' ? <div className="travel-report-recording-grid">
      <figure>
        <a href="/travel-evidence/miso-refund-handoff.png" target="_blank" rel="noreferrer"><Image src="/travel-evidence/miso-refund-handoff.png" alt="Miso confirms cancellation and escalates the seat-fee refund to its human team." width={1124} height={820} unoptimized /></a>
        <figcaption>Cancellation and human handoff. The tester subsequently confirmed the refund was resolved.</figcaption>
      </figure>
      <figure>
        <a href="/travel-evidence/miso-fare.png" target="_blank" rel="noreferrer"><Image src="/travel-evidence/miso-fare.png" alt="Miso invoice showing a $258.40 total charge." width={826} height={58} unoptimized /></a>
        <figcaption>Economy fare: $258.40.</figcaption>
      </figure>
    </div> : available.length ? <>
      <p className="ag-sub">Local preview · Unredacted screenshots</p>
      <div className="travel-report-recording-grid">
        {available.map(([key]) => <figure key={key}>
          <a href={`/api/travel-evidence/${key}.png`} target="_blank" rel="noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/api/travel-evidence/${key}.png`} alt={`${name}: captured test evidence`} loading="lazy" />
          </a>
          <figcaption>{key.endsWith('-cancel') ? 'Cancellation' : key.startsWith('r1-') ? 'Booking' : key.startsWith('r3-') ? 'Updated booking and follow-up' : 'Booking and follow-up'}</figcaption>
        </figure>)}
      </div>
    </> : <p>Screenshots will be available here once personal and payment details have been redacted.</p>}
  </details>;
}
