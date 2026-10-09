import { existsSync, readFileSync } from 'node:fs';
import { TravelScreenshot } from './TravelScreenshot';
import { travelScreenshots } from '@/lib/travel-screenshots';

export function TravelEvidenceMedia({ agent, name, round, dimension }: { agent: string; name: string; round: number; dimension: number }) {
  const transcriptPath = `/tmp/travel-evidence-transcripts/r${round}-${agent}.json`;
  const transcript: { role: string; reaction?: boolean; time?: string; text: string }[] = process.env.NODE_ENV === 'development' && existsSync(transcriptPath)
    ? JSON.parse(readFileSync(transcriptPath, 'utf8')) : [];
  const screenshot = travelScreenshots[agent];
  return <div className="travel-session-media">
    {screenshot?.dimensions.includes(dimension) && <TravelScreenshot agent={agent} />}
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
