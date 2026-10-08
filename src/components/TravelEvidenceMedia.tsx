import { existsSync } from 'node:fs';
import { travelEvidenceFiles } from '@/lib/travel-evidence-media';

export function TravelEvidenceMedia({ agent, name, round, dimension }: { agent: string; name: string; round: number; dimension: number }) {
  const key = `r${round}-${agent}${round === 2 && agent === 'muse' && dimension === 8 ? '-cancel' : ''}`;
  const file = travelEvidenceFiles[key];
  if (!file) return null;
  const source = `https://stmy6z4b3h.s.stableupload.dev/${round === 1 ? '' : `round${round}.html`}`;
  const local = process.env.NODE_ENV === 'development' && existsSync(file.video);
  const showStill = local && file.image && existsSync(file.image) && (round === 1 && dimension === 5 || round === 2 && (dimension === 8 || agent === 'muse' && [6, 9].includes(dimension)) || round === 3 && (agent === 'soar' && dimension === 5 || agent === 'instinct' && dimension === 8));
  return <div className="travel-session-media">
    {local ? <>
      <p className="ag-sub">Local evidence preview · Original recording. Personal details are unredacted; these files are not included in the published site.</p>
      <div className="travel-evidence-grid">
        <figure>
          <video controls playsInline preload="none" aria-label={`${name}, round ${round}, full session recording`} src={`/api/travel-evidence/${key}.mp4`}>
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
    </> : <p className="ag-sub">Recording available in the password-protected source. A redacted public copy is not yet available.</p>}
    <p><a href={`${source}#videos`} target="_blank" rel="noreferrer">Source recordings →</a> · <a href={`${source}#transcripts`} target="_blank" rel="noreferrer">Full transcript →</a></p>
  </div>;
}
