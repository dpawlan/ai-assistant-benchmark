import Link from 'next/link';
import { AgentIcon } from './AgentIcon';
import { TravelRecapProfileCheckpoints } from './TravelRecapProfileCheckpoints';
import profileAudit from '../../data/travel-profile-request-audit.json';
import styles from './TravelRecapUtilityScenes.module.css';

export interface TravelRecapUtilityAssistant {
  slug: string;
  name: string;
  icon: string | null;
}

interface UtilitySceneProps {
  assistants: TravelRecapUtilityAssistant[];
}

function Check({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Agent({ assistant, dimension = 19, outcome }: { assistant: TravelRecapUtilityAssistant; dimension?: number; outcome: 'under' | 'over' }) {
  return <Link className={styles.agent} href={`/benchmarks/travel/dimensions/${dimension}#${assistant.slug}`} aria-label={`${assistant.name}: ${outcome} ten minutes for search, preferences and checkout, according to reviewer assessment. View booking speed evidence.`}>
    <AgentIcon name={assistant.name} icon={assistant.icon} size={44} className={styles.agentIcon} />
    <span className={styles.agentName}>{assistant.name}</span>
  </Link>;
}

export function ProfileScene({ assistants }: UtilitySceneProps) {
  return <TravelRecapProfileCheckpoints assistants={assistants} checkpoints={profileAudit.checkpoints} savedInformationNote={profileAudit.saved_information_note} />;
}

export function SpeedScene({ assistants }: UtilitySceneProps) {
  const withinWindow = assistants.filter(assistant => ['miso', 'instinct'].includes(assistant.slug));
  const outsideWindow = assistants.filter(assistant => !['miso', 'instinct'].includes(assistant.slug));

  return <figure className={`${styles.scene} ${styles.speedScene}`} aria-label="Reviewer assessment: Miso and Instinct completed search, preferences and checkout within ten minutes. Grok Bot, Muse and Dots took longer.">
    <ol className={styles.speedSteps} aria-label="The assessed booking flow"><li>Search</li><li>Preferences</li><li>Checkout</li></ol>
    <div className={styles.speedComparison}>
      <div className={`${styles.speedGroup} ${styles.withinWindow}`}>
        <h3>Under 10 min</h3>
        <ul className={styles.withinAgents} aria-label="Under ten minutes">
          {withinWindow.map(assistant => <li key={assistant.slug} data-agent={assistant.slug}><Agent assistant={assistant} outcome="under" /><Check className={styles.speedCheck} /></li>)}
        </ul>
      </div>
      <div className={styles.stopwatch}>
        <div className={styles.watchCrown} aria-hidden="true" />
        <div className={styles.watchBody}>
          <svg className={styles.watchDial} viewBox="0 0 400 400" fill="none" aria-hidden="true" focusable="false">
            <circle cx="200" cy="200" r="184" />
            {Array.from({ length: 40 }, (_, index) => <path key={index} d={index % 4 === 0 ? 'M200 24v15' : 'M200 25v7'} transform={`rotate(${index * 9} 200 200)`} data-major={index % 4 === 0} />)}
            <g className={styles.watchOrbit} data-speed-loop="rim">
              <circle className={styles.orbitArc} cx="200" cy="200" r="184" pathLength="1" transform="rotate(-90 200 200)" />
              <circle className={styles.orbitDot} cx="200" cy="16" r="5" />
            </g>
          </svg>
          <div className={styles.watchFace}>
            <strong className={styles.watchTime} aria-label="Ten-minute booking threshold">10<span>min</span></strong>
          </div>
        </div>
      </div>
      <div className={`${styles.speedGroup} ${styles.outsideWindow}`}>
        <h3>Over 10 min</h3>
        <ul className={styles.outsideAgents} aria-label="Over ten minutes">{outsideWindow.map(assistant => <li key={assistant.slug} data-agent={assistant.slug}><Agent assistant={assistant} outcome="over" /></li>)}</ul>
      </div>
    </div>
  </figure>;
}
