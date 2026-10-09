import { existsSync } from 'node:fs';
import { travelEvidenceFiles } from '@/lib/travel-evidence-media';

export function TravelReportRecordings({ agent, name }: { agent: string; name: string }) {
  const recordings = Object.entries(travelEvidenceFiles).filter(([key]) =>
    key.replace(/^r\d+-/, '').replace(/-cancel$/, '') === agent
  );
  const available = process.env.NODE_ENV === 'development'
    ? recordings.filter(([, file]) => existsSync(file.video)) : [];
  return <details className="travel-report-recordings">
    <summary>Screen recordings</summary>
    {available.length ? <>
      <p className="ag-sub">Local preview · Unredacted recordings</p>
      <div className="travel-report-recording-grid">
        {available.map(([key]) => <figure key={key}>
          <video controls playsInline preload="none" poster={`/travel-posters/${agent}.svg`} src={`/api/travel-evidence/${key}.mp4`} aria-label={`${name}: ${key.endsWith('-cancel') ? 'Cancellation' : key.startsWith('r1-') ? 'Booking' : key.startsWith('r3-') ? 'Updated booking and follow-up' : 'Booking and follow-up'}`}>
            <track kind="captions" />
          </video>
          <figcaption>{key.endsWith('-cancel') ? 'Cancellation' : key.startsWith('r1-') ? 'Booking' : key.startsWith('r3-') ? 'Updated booking and follow-up' : 'Booking and follow-up'}</figcaption>
        </figure>)}
      </div>
    </> : <p>Recordings will be available here once personal and payment details have been redacted.</p>}
  </details>;
}
