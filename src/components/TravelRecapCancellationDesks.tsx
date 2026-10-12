import Link from 'next/link';
import { AgentIcon } from './AgentIcon';
import type { TravelRecapSceneAssistant } from './TravelRecapSystemScenes';
import styles from './TravelRecapCancellationDesks.module.css';

type CancellationDesksProps = { assistants: TravelRecapSceneAssistant[] };

const refundNotes: Record<string, string> = {
  miso: 'Human team confirmed the $85.99 seat refund.',
  'grok-bot': 'You re-entered your birth date and clicked “Cancel trip”.',
  dots: '$60.01 credit unresolved.',
  instinct: '$35 seat-refund request failed.',
  muse: 'Full $354.40 refund confirmed.',
};

function CancellationCheck() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 2.5 2.5L16 9" />
  </svg>;
}

export function TravelRecapCancellationDesks({ assistants }: CancellationDesksProps) {
  return <figure className={styles.cancellationScene} data-scene="cancellations" aria-label="Five airport service desks. All five assistants cancelled the flight; their refund follow-through differed.">
    <ol className={styles.desks}>
      {assistants.map(assistant => <li key={assistant.slug} data-agent={assistant.slug}>
        <Link className={styles.desk} href={`/benchmarks/travel/dimensions/8#${assistant.slug}`} aria-label={`${assistant.name}: flight cancelled. ${refundNotes[assistant.slug]} View cancellation evidence.`}>
          <span className={styles.identity}>
            <AgentIcon name={assistant.name} icon={assistant.icon} size={28} className={styles.logo} />
            <strong>{assistant.name}</strong>
          </span>
          <span className={styles.monitor}>
            <span className={styles.confirmation}><CancellationCheck /><strong>Cancelled</strong></span>
          </span>
          <span className={styles.monitorStand} aria-hidden="true" />
          <span className={styles.counter} aria-hidden="true">
            <span className={styles.counterTop} />
            <span className={styles.counterFront} />
            <span className={styles.counterSide} />
            <span className={styles.counterBase} />
          </span>
        </Link>
      </li>)}
    </ol>
  </figure>;
}
