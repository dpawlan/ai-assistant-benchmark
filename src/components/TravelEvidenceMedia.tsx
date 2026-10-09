import { existsSync, readFileSync } from 'node:fs';
import { travelEvidenceFiles } from '@/lib/travel-evidence-media';

export function TravelEvidenceMedia({ agent, name, round, dimension }: { agent: string; name: string; round: number; dimension: number }) {
  const key = `r${round}-${agent}${round === 2 && agent === 'muse' && dimension === 8 ? '-cancel' : ''}`;
  const file = travelEvidenceFiles[key];
  if (!file) return null;
  const transcriptPath = `/tmp/travel-evidence-transcripts/r${round}-${agent}.json`;
  const transcript: { role: string; reaction?: boolean; time?: string; text: string }[] = process.env.NODE_ENV === 'development' && existsSync(transcriptPath)
    ? JSON.parse(readFileSync(transcriptPath, 'utf8')) : [];
  const local = process.env.NODE_ENV === 'development';
  const showStill = local && file.image && existsSync(file.image);
  const publicScreenshot = agent === "miso" && [5, 8, 19].includes(dimension) ? dimension === 8 ? "miso-refund-handoff" : "miso-fare" : null;
  return <div className="travel-session-media">
    {publicScreenshot ? <figure>
      <a href={`/travel-evidence/${publicScreenshot}.png`} target="_blank" rel="noreferrer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/travel-evidence/${publicScreenshot}.png`} alt={dimension === 8 ? "Miso confirms cancellation and hands the seat refund to human support" : "Miso invoice total: $258.40"} style={{ maxWidth: "100%", height: "auto" }} loading="lazy" />
      </a>
      <figcaption>{dimension === 8 ? "Cancellation and human handoff" : "Booking invoice"} · Click to enlarge</figcaption>
    </figure> : showStill ? <>
      <p className="ag-sub">Local preview · Unredacted screenshot.</p>
      <div className="travel-evidence-grid">
        {showStill && <figure>
          <a href={`/api/travel-evidence/${key}.png`} target="_blank" rel="noreferrer">
            {/* The original local evidence frame must bypass the public image optimizer. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/api/travel-evidence/${key}.png`} alt={`${name}: screen near the end of the round ${round} session`} loading="lazy" />
          </a>
          <figcaption>End-of-session screenshot · Click to enlarge</figcaption>
        </figure>}
      </div>
    </> : <p className="ag-sub">A redacted public screenshot is not yet available.</p>}
    {transcript.length > 0 ? <details className="travel-transcript">
      <summary>Full transcript · {name}</summary>
      <p className="ag-sub">Local preview · Unredacted transcript.</p>
      <ol>{transcript.map((message, index) => <li key={index}>
        <p className="travel-transcript-speaker">{message.role === 'user' ? 'Tester' : name}{message.reaction ? ' · Reaction' : ''}{message.time ? ` · ${message.time.replace(/^[^·]+·\s*/, '')}` : ''}</p>
        <p className="travel-transcript-message">{message.text}</p>
      </li>)}</ol>
    </details> : <p className="ag-sub">A redacted public transcript is not yet available.</p>}
  </div>;
}
