import Link from 'next/link';
import type { CSSProperties } from 'react';
import { AgentIcon } from './AgentIcon';
import type { TravelRecapSceneAssistant } from './TravelRecapSystemScenes';
import styles from './TravelRecapBookingBoard.module.css';

type Method = 'browser' | 'api' | 'agency';

const methods: Record<string, Method[]> = {
  miso: ['agency'],
  'grok-bot': ['browser'],
  dots: ['browser'],
  instinct: ['browser', 'api'],
  muse: ['browser', 'api'],
};

const methodNames: Record<Method, string> = {
  browser: 'Browser',
  api: 'Booking API',
  agency: 'Agency',
};

function MethodIcon({ method }: { method: Method }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {method === 'browser' ? <><rect x="3" y="4" width="18" height="15" rx="2" /><path d="M3 9h18M7 6.5h.01m3 0h.01m3 0h.01m-5 6 3 3 5-5" /></>
      : method === 'api' ? <><path d="m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16" /></>
        : <><circle cx="10" cy="7" r="3" /><path d="M4 17v-2a6 6 0 0 1 12 0v2M2 17h20v4H2zm16-13v8m-3-5h6" /></>}
  </svg>;
}

function FlapWord({ text, width, row, status = false }: { text: string; width: number; row: number; status?: boolean }) {
  return <span className={`${styles.word} ${status ? styles.status : ''}`} aria-hidden="true">
    {text.toUpperCase().padEnd(width, ' ').split('').map((character, index) => {
      const step = .04 + row * .045 + index * .009 + (status ? .11 : 0);
      return <span className={styles.tile} key={index} style={{ '--flap-step': step } as CSSProperties}>
        <span className={styles.finalCharacter}>{character === ' ' ? '\u00a0' : character}</span>
        <span className={styles.oldLower}><span>·</span></span>
        <span className={styles.flap}>
          <span className={styles.front}><span>·</span></span>
          <span className={styles.back}><span>{character === ' ' ? '\u00a0' : character}</span></span>
        </span>
      </span>;
    })}
  </span>;
}

export function TravelRecapBookingBoard({ assistants }: { assistants: TravelRecapSceneAssistant[] }) {
  return <figure className={styles.bookingScene} aria-label="All five assistants booked a flight using browser automation, booking APIs or a travel agency">
    <div className={styles.board}>
      <ol className={styles.rows}>
        {assistants.map((assistant, index) => <li key={assistant.slug}>
          <Link className={styles.row} href={`/benchmarks/travel/dimensions/5#${assistant.slug}`} aria-label={`${assistant.name}: booked. ${methods[assistant.slug].map(method => methodNames[method]).join(' and ')}. View booking evidence.`}>
            <AgentIcon name={assistant.name} icon={assistant.icon} size={28} className={styles.logo} />
            <FlapWord text={assistant.name} width={8} row={index} />
            <span className={styles.colon} aria-hidden="true">:</span>
            <FlapWord text="Booked" width={6} row={index} status />
            <span className={styles.rowMethods} aria-hidden="true">{methods[assistant.slug].map(method => <MethodIcon key={method} method={method} />)}</span>
          </Link>
        </li>)}
      </ol>
    </div>
    <ul className={styles.methodKey} aria-label="Booking approaches shown beside each assistant">
      {(['browser', 'api', 'agency'] as Method[]).map(method => <li key={method}><MethodIcon method={method} /><span>{methodNames[method]}</span></li>)}
    </ul>
    <figcaption className={styles.result}>All five booked.</figcaption>
  </figure>;
}
