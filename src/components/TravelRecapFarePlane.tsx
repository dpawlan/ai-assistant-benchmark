import Link from 'next/link';
import { AgentIcon } from './AgentIcon';
import type { TravelRecapSceneAssistant } from './TravelRecapSystemScenes';
import styles from './TravelRecapFarePlane.module.css';

type FarePlaneProps = { assistants: TravelRecapSceneAssistant[] };

function FareTag({ unavailable = false }: { unavailable?: boolean }) {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M4 7h15l9 9-9 9H4v-6a3 3 0 0 0 0-6V7Z" />
    <path d="M11 8v3m0 3v4m0 3v3" />
    {unavailable ? <path d="m17 13 6 6m0-6-6 6" /> : <path d="m16 16 3 3 5-6" />}
  </svg>;
}

function AirframeHalf({ half }: { half: 'upper' | 'lower' }) {
  const clip = `fare-airframe-${half}`;
  return <svg className={`${styles.airframe} ${half === 'upper' ? styles.upperShell : styles.lowerShell}`} viewBox="0 0 1000 380" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <defs><clipPath id={clip}><rect x="0" y={half === 'upper' ? 0 : 190} width="1000" height="190" /></clipPath></defs>
    <g clipPath={`url(#${clip})`}>
      <path className={styles.wing} d="M425 122 677 34h29l-105 99M425 258l252 88h29L601 247M849 150l78-72h22l-20 91M849 230l78 72h22l-20-91" />
      <rect className={styles.engine} x="642" y="89" width="78" height="23" rx="11" />
      <rect className={styles.engine} x="642" y="268" width="78" height="23" rx="11" />
      <path className={styles.fuselage} d="M30 190c0-43 111-78 192-78h548c85 0 161 39 204 78-43 39-119 78-204 78H222c-81 0-192-35-192-78Z" />
      <path className={styles.cockpit} d="m107 161 24-14 16 15-26 10-14-11Zm0 58 24 14 16-15-26-10-14 11Z" />
      <path className={styles.door} d="M174 129h13v17h-13zm0 105h13v17h-13zm622-105h13v17h-13zm0 105h13v17h-13z" />
      <g className={styles.windows}>
        {Array.from({ length: 29 }, (_, index) => <rect key={`top-${index}`} x={224 + index * 19} y="123" width="8" height="5" rx="2.5" />)}
        {Array.from({ length: 29 }, (_, index) => <rect key={`bottom-${index}`} x={224 + index * 19} y="252" width="8" height="5" rx="2.5" />)}
      </g>
      <path className={styles.cutEdge} d="M31 190h942" />
    </g>
  </svg>;
}

export function TravelRecapFarePlane({ assistants }: FarePlaneProps) {
  const available = ['grok-bot', 'dots', 'instinct', 'muse']
    .map(slug => assistants.find(assistant => assistant.slug === slug))
    .filter((assistant): assistant is TravelRecapSceneAssistant => !!assistant);
  const miso = assistants.find(assistant => assistant.slug === 'miso');

  return <figure className={styles.fareScene} data-scene="fares" aria-label="Basic Economy fare availability: Grok Bot, Dots, Instinct and Muse offered it. Miso did not. The aircraft is an illustration of fare access, not a seating chart.">
    <div className={styles.composition}>
      <div className={styles.plane}>
        <AirframeHalf half="upper" />
        <AirframeHalf half="lower" />
        <div className={styles.fareCard}>
          <h3><FareTag /><span>Basic Economy</span></h3>
          <ul className={styles.stamps} aria-label="Assistants offering Basic Economy">
            {available.map(assistant => <li key={assistant.slug}>
              <Link className={styles.stamp} href={`/benchmarks/travel/dimensions/5#${assistant.slug}`} aria-label={`${assistant.name}: Basic Economy offered. View fare evidence.`}>
                <AgentIcon name={assistant.name} icon={assistant.icon} size={30} className={styles.stampLogo} />
                <span>{assistant.name}</span>
              </Link>
            </li>)}
          </ul>
        </div>
      </div>
      {miso && <div className={styles.excluded}>
        <FareTag unavailable />
        <Link className={styles.excludedIdentity} href="/benchmarks/travel/dimensions/5#miso" aria-label="Miso: Basic Economy not offered. View fare evidence.">
          <AgentIcon name={miso.name} icon={miso.icon} size={32} className={styles.misoLogo} />
          <strong>{miso.name}</strong>
        </Link>
        <span>No Basic Economy</span>
      </div>}
    </div>
  </figure>;
}
