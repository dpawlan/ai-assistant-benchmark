import Link from 'next/link';
import { AgentIcon } from './AgentIcon';
import type { Agent } from '@/lib/types';
import styles from './TravelRecapVerdict.module.css';

const picks = [
  { slug: 'miso', reason: 'Excelled across the trip. Fast, with human backup.', limit: 'No Basic Economy', detail: 'A major limitation for budget travel.', canChange: true },
  { slug: 'instinct', reason: 'Best fast Basic Economy alternative', limit: 'No flight changes', detail: 'Duffel support required.', canChange: false },
];

function CapabilityIcon({ kind }: { kind: 'book' | 'seats' | 'change' | 'cancel' }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {kind === 'book' ? <><path d="M3 7h18v4a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4V7Z" /><path d="M9 8v2m0 3v2m0 2v1m4-6h5" /></> : kind === 'seats' ? <><path d="M6 3h5v10h7v5H7a3 3 0 0 1-3-3V6a3 3 0 0 1 2-3Zm1 15v3m10-3v3M13 8h5v5" /></> : kind === 'change' ? <><path d="M4 8h16m-4-4 4 4-4 4M20 16H4m4-4-4 4 4 4" /></> : <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="m8 8 8 8m0-8-8 8" /></>}
  </svg>;
}

function CapabilityStrip({ canChange }: { canChange: boolean }) {
  const capabilities = [
    { kind: 'book' as const, label: 'Book', handled: true },
    { kind: 'seats' as const, label: 'Seats', handled: true },
    { kind: 'change' as const, label: 'Changes', handled: canChange },
    { kind: 'cancel' as const, label: 'Cancel', handled: true },
  ];
  return <ul className={styles.capabilities} aria-label="Trip capabilities">
    {capabilities.map(capability => <li key={capability.kind} data-handled={capability.handled} aria-label={`${capability.label}: ${capability.handled ? 'completed' : 'not completed'}`}>
      <span className={styles.capabilityIcon}><CapabilityIcon kind={capability.kind} /><i aria-hidden="true">{capability.handled ? '✓' : '×'}</i></span>
      <span>{capability.label}</span>
    </li>)}
  </ul>;
}

function ClockStamp() {
  return <span className={styles.clockStamp}>
    <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><circle cx="14" cy="15" r="10" /><path d="M11 2h6m-3 0v3m7 2 2-2M14 9v6l4 2" /></svg>
    <span>Under 10 min</span>
  </span>;
}

export function TravelRecapVerdict({ assistants }: { assistants: Agent[] }) {
  return <div className={styles.verdict} aria-label="Miso performed best overall, with a major Basic Economy limitation. Instinct is the fast Basic Economy alternative, but cannot change the flight.">
    <ol className={styles.passes}>
      {picks.map(pick => {
        const assistant = assistants.find(candidate => candidate.slug === pick.slug);
        if (!assistant) return null;
        return <li className={styles.pass} key={pick.slug} data-agent={pick.slug}>
          <div className={styles.passBody}>
            <div className={styles.passHeading}>
              <Link href={`/agents/${pick.slug}`} className={styles.identity}><AgentIcon name={assistant.name} icon={assistant.icon} size={40} className={styles.logo} /><strong>{assistant.name}</strong></Link>
              <span className={styles.reason}>{pick.reason}</span>
            </div>
            <CapabilityStrip canChange={pick.canChange} />
            <div className={styles.limitation}><strong>{pick.limit}</strong><span>{pick.detail}</span></div>
          </div>
          <div className={styles.passStub}>
            <span className={styles.score} aria-label={`${assistant.travel.score?.toFixed(1)} out of ten reviewed travel score`}><strong>{assistant.travel.score?.toFixed(1)}</strong><span>/ 10</span></span>
            <span className={styles.scoreLabel}>Travel score</span>
            <ClockStamp />
          </div>
        </li>;
      })}
    </ol>
    <Link className={styles.compare} href="#comparison">Compare all five <span aria-hidden="true">↓</span></Link>
  </div>;
}
