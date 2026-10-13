import { getTravelTranscript } from '@/lib/travel-transcripts';
import { TravelScreenshot } from './TravelScreenshot';
import { travelScreenshots } from '@/lib/travel-screenshots';

export function TravelEvidenceMedia({ agent, name, round, dimension }: { agent: string; name: string; round: number; dimension: number }) {
  const transcript = getTravelTranscript(agent, round);
  const screenshot = travelScreenshots[agent];
  return <div className="travel-session-media">
    {screenshot?.dimensions.includes(dimension) && <TravelScreenshot agent={agent} />}
    {transcript.length > 0 ? <section className="travel-transcript" aria-label={`${name} transcript`}>
      <h3 className="ag-h2">Full transcript · {name}</h3>
      <p className="ag-sub">Personal details and private links redacted. Attachments are noted in place.</p>
      <ol>{transcript.map((message, index) => <li key={index}>
        <p className="travel-transcript-speaker">{message.role === 'user' ? 'Tester' : name}{message.reaction ? ' · Reaction' : ''}{message.time ? ` · ${message.time.replace(/^[^·]+·\s*/, '')}` : ''}</p>
        <p className="travel-transcript-message">{message.text}</p>
      </li>)}</ol>
    </section> : <p className="ag-sub">A redacted public transcript is not yet available.</p>}
  </div>;
}
