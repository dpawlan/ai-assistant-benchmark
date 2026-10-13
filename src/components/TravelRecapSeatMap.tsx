import Link from 'next/link';
import type { CSSProperties } from 'react';
import { AgentIcon } from './AgentIcon';
import styles from './TravelRecapSeatMap.module.css';

export type SeatMapAssistant = { slug: string; name: string; icon: string | null };

const results = [
  { slug: 'miso', action: 'Paid upgrade confirmed', confirmed: true },
  { slug: 'grok-bot', action: 'Upgrade needed browser help', confirmed: true },
  { slug: 'dots', action: 'Paid upgrade confirmed', confirmed: true },
  { slug: 'instinct', action: 'Paid upgrade confirmed', confirmed: true },
  { slug: 'muse', action: 'Couldn’t complete the upgrade', confirmed: false },
];

const occupants = [
  { slug: 'miso', row: 2, seat: 2, mobileRow: 1 },
  { slug: 'grok-bot', row: 6, seat: 5, mobileRow: 3 },
  { slug: 'dots', row: 10, seat: 0, mobileRow: 5 },
  { slug: 'instinct', row: 14, seat: 3, mobileRow: 7 },
];

export function TravelRecapSeatMap({ assistants }: { assistants: SeatMapAssistant[] }) {
  const bySlug = Object.fromEntries(assistants.map(assistant => [assistant.slug, assistant]));

  function cabin(mobile: boolean) {
    const rowCount = mobile ? 9 : 18;
    return <div className={`${styles.cabin} ${mobile ? styles.mobileCabin : styles.desktopCabin}`}>
      {Array.from({ length: rowCount }, (_, row) => <div className={styles.seatRow} key={row}>
        {Array.from({ length: 7 }, (_, position) => {
          if (position === 3) return <span className={styles.aisle} key="aisle" aria-hidden="true" />;
          const seat = position > 3 ? position - 1 : position;
          const occupant = occupants.find(item => (mobile ? item.mobileRow : item.row) === row && item.seat === seat);
          const assistant = occupant ? bySlug[occupant.slug] : undefined;
          const style = { '--seat-step': row / rowCount, '--logo-step': occupant ? occupants.indexOf(occupant) : 0 } as CSSProperties;
          return <span key={seat} className={`${styles.seat} ${assistant ? styles.occupied : ''}`} style={style} data-agent={assistant?.slug} aria-hidden="true">
            {assistant && <AgentIcon name={assistant.name} icon={assistant.icon} size={32} className={styles.seatIcon} />}
          </span>;
        })}
      </div>)}
    </div>;
  }

  return <figure className={styles.seatScene}>
    <ul className={styles.resultList} aria-label="Seat-change and upgrade results">
      {results.map(result => {
        const assistant = bySlug[result.slug];
        if (!assistant) return null;
        return <li key={result.slug} data-agent={result.slug} data-confirmed={result.confirmed}>
          <Link href={`/benchmarks/travel/dimensions/6#${assistant.slug}`} className={styles.resultLink} aria-label={`${assistant.name}: ${result.action}. View the seat-selection test.`}>
            <AgentIcon name={assistant.name} icon={assistant.icon} size={36} className={styles.resultIcon} />
            <span className={styles.resultCopy}><strong>{assistant.name}</strong><span>{result.action}</span></span>
          </Link>
        </li>;
      })}
    </ul>
    <div className={styles.plane} role="img" aria-label="Illustrative seat layout, with Miso, Grok Bot, Dots and Instinct shown in seats. Logo positions do not represent the seats purchased. Muse did not complete its upgrade.">
      <svg className={styles.airframe} viewBox="0 0 1200 400" fill="none" preserveAspectRatio="none" aria-hidden="true">
        <path className={styles.wing} d="M472 93 716 9H780L667 97M472 307 716 391H780L667 303M984 113 1102 61H1140L1070 145M984 287 1102 339H1140L1070 255" />
        <path className={styles.fuselage} d="M24 200C24 158 84 99 170 89C338 75 773 81 1020 98C1097 103 1162 158 1176 200C1162 242 1097 297 1020 302C773 319 338 325 170 311C84 301 24 242 24 200Z" />
        <path className={styles.cockpit} d="M71 173l34-27 24 12-27 31-31-16ZM71 227l34 27 24-12-27-31-31 16Z" />
        <path className={styles.bulkhead} d="M164 118V282M1040 127V273" />
        <rect className={styles.door} x="143" y="95" width="22" height="8" rx="3" /><rect className={styles.door} x="143" y="297" width="22" height="8" rx="3" />
        <rect className={styles.door} x="1008" y="105" width="22" height="8" rx="3" /><rect className={styles.door} x="1008" y="287" width="22" height="8" rx="3" />
        {Array.from({ length: 23 }, (_, index) => {
          const x = 205 + index * 35;
          return <g className={styles.windows} key={x}><rect x={x} y="96" width="13" height="4" rx="2" /><rect x={x} y="300" width="13" height="4" rx="2" /></g>;
        })}
        <path className={styles.aisleLine} d="M183 200H1030" />
      </svg>
      {cabin(false)}
      {cabin(true)}
    </div>
  </figure>;
}
