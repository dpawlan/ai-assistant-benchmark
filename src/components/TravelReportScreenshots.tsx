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
    {available.length ? <>
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
