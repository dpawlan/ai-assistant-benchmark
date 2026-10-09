import { existsSync, readFileSync } from 'node:fs';
import { travelEvidenceFiles } from '@/lib/travel-evidence-media';

export function TravelEvidenceMedia({ agent, name, round, dimension }: { agent: string; name: string; round: number; dimension: number }) {
  const key = `r${round}-${agent}${round === 2 && agent === 'muse' && dimension === 8 ? '-cancel' : ''}`;
  const file = travelEvidenceFiles[key];
  if (!file) return null;
  const transcriptPath = `/tmp/travel-evidence-transcripts/r${round}-${agent}.json`;
  const transcript: { role: string; reaction?: boolean; time?: string; text: string }[] = process.env.NODE_ENV === 'development' && existsSync(transcriptPath)
    ? JSON.parse(readFileSync(transcriptPath, 'utf8')) : [];
  const local = process.env.NODE_ENV === 'development' && existsSync(file.video);
  const showStill = local && file.image && existsSync(file.image) && (round === 1 && dimension === 5 || round === 2 && (dimension === 8 || agent === 'muse' && [6, 9].includes(dimension)) || round === 3 && (agent === 'soar' && dimension === 5 || agent === 'instinct' && dimension === 8));
  return <div className="travel-session-media">
    {local ? <>
      <p className="ag-sub">Local evidence preview · Original recording. Personal details are unredacted; these files are not included in the published site.</p>
      <div className="travel-evidence-grid">
        <figure>
          <video controls playsInline preload="none" poster={`/travel-posters/${agent}.svg`} aria-label={`${name}, round ${round}, full session recording`} src={`/api/travel-evidence/${key}.mp4`}>
            <track kind="captions" />
          </video>
          <figcaption>{name} · Round {round} · Full session, including the task described above. Use the player to review the surrounding steps.</figcaption>
        </figure>
        {showStill && <figure>
          <a href={`/api/travel-evidence/${key}.png`} target="_blank" rel="noreferrer">
            {/* The original local evidence frame must bypass the public image optimizer. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/api/travel-evidence/${key}.png`} alt={`${name}: screen near the end of the round ${round} session`} loading="lazy" />
          </a>
          <figcaption>Original frame near the end of this session. Open to inspect at full size.</figcaption>
        </figure>}
      </div>
    </> : <p className="ag-sub">A redacted public recording is not yet available.</p>}
    {transcript.length > 0 ? <details className="travel-transcript">
      <summary>Full transcript · {name}</summary>
      <p className="ag-sub">Original supplied transcript, including any prior conversation retained in this session export. Local preview only; contains unredacted personal information.</p>
      <ol>{transcript.map((message, index) => <li key={index}>
        <p className="travel-transcript-speaker">{message.role === 'user' ? 'Tester' : name}{message.reaction ? ' · Reaction' : ''}{message.time ? ` · ${message.time.replace(/^[^·]+·\s*/, '')}` : ''}</p>
        <p className="travel-transcript-message">{message.text}</p>
      </li>)}</ol>
    </details> : <p className="ag-sub">A redacted public transcript is not yet available.</p>}
  </div>;
}
