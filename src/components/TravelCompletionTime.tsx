import timings from '../../data/travel-completion-times.json';
import { bookingSpeedScore } from '@/lib/travel-speed';
import { ScoreCell } from './ScoreCell';

export const MISO_SETUP_NOTE = "Miso’s traveler profile was already set up before this test. Timing includes checkout and payment entry, but excludes prior onboarding.";

export function TravelCompletionTime({ agent, dimension = 5, round, detail = false }: { agent: string; dimension?: number; round?: number; detail?: boolean }) {
  const timing = timings.filter(t => t.agent === agent && t.dimension === dimension && (round === undefined || t.round === round)).sort((a, b) => b.round - a.round)[0];
  const label = !timing ? 'Not measured' : timing.status === 'confirmation_unresolved' ? '~32 min†' : timing.status === 'not_completed' ? 'Not completed' : timing.minutes === null ? 'Not measured' : `~${timing.minutes} min`;
  const priorSetup = agent === 'miso' && dimension === 5 && timing?.round === 1;
  const note = (timing?.note ?? 'No task completion timing recorded.') + (priorSetup ? ` ${MISO_SETUP_NOTE}` : '');
  const score = dimension === 5 && timing ? bookingSpeedScore(timing.minutes, timing.status) : null;
  return <span className={detail ? undefined : 'travel-completion-value'} title={note}>
    <span className="travel-time-score">
      <span>{detail ? `Time to complete: ${label}` : label}{priorSetup && <sup aria-label="Prior onboarding excluded">*</sup>}</span>
      {score !== null && <span aria-label={`Booking speed: ${score} out of 10`} title={`Booking speed: ${score}/10 · provisional fixed thresholds · equal-weight Travel dimension`}><ScoreCell value={score} /></span>}
    </span>
    {timing?.status === 'confirmation_unresolved' && <span className="run-line">First confirmation; later contradicted</span>}
    {detail && timing && <span className="run-line">{note}</span>}
  </span>;
}
