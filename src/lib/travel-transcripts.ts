import grokBot from '../../data/travel-transcripts/grok-bot.json';
import miso from '../../data/travel-transcripts/miso.json';
import muse from '../../data/travel-transcripts/muse.json';
import dots from '../../data/travel-transcripts/dots.json';
import instinct from '../../data/travel-transcripts/instinct.json';

export type TravelTranscriptMessage = {
  role: string;
  text: string;
  reaction?: boolean;
  time?: string;
};

// Match reviewed public exports to scored sessions. Never read local raw
// transcripts or substitute another booking for an unmatched session.
const transcripts: Record<string, { rounds: readonly number[]; messages: readonly TravelTranscriptMessage[] }> = {
  'grok-bot': { rounds: [1, 2], messages: grokBot },
  miso: { rounds: [1, 2], messages: miso },
  muse: { rounds: [2], messages: muse },
  dots: { rounds: [2], messages: dots },
  instinct: { rounds: [3], messages: instinct },
};

export function getTravelTranscript(agent: string, round: number): readonly TravelTranscriptMessage[] {
  const transcript = Object.hasOwn(transcripts, agent) ? transcripts[agent] : undefined;
  return transcript?.rounds.includes(round) ? transcript.messages : [];
}
