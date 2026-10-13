import type { CSSProperties } from 'react';
import Link from 'next/link';
import { AgentIcon } from './AgentIcon';
import type { TravelRecapSceneAssistant } from './TravelRecapSystemScenes';
import styles from './TravelRecapProfileCheckpoints.module.css';

export type TravelRecapProfileCheckpoint = {
  id: string;
  title: string;
  criterion: string;
  slugs: string[];
  emptyNote?: string;
};

type ProfileCheckpointsProps = {
  assistants: TravelRecapSceneAssistant[];
  checkpoints: TravelRecapProfileCheckpoint[];
  summary?: string;
  savedInformationNote?: string;
};

function CheckpointGate({ count }: { count: number }) {
  return <svg className={styles.gate} viewBox="0 0 120 140" fill="none" aria-hidden="true" focusable="false">
    <path className={styles.archBody} d="M39 124V18a10 10 0 0 1 10-10h43a10 10 0 0 1 10 10v106H90V24H51v100H39Z" />
    <path className={styles.archEdge} d="M44 123V21a8 8 0 0 1 8-8h37a8 8 0 0 1 8 8v102M52 24h37" />
    <path className={styles.detectorMarks} d="M45 39h3m-3 16h3m-3 16h3m-3 16h3m-3 16h3m45-64h3m-3 16h3m-3 16h3m-3 16h3m-3 16h3" />
    <path className={styles.scannerStem} d="M15 95v28m-8 1h16" />
    <rect className={styles.scanner} x="3" y="65" width="25" height="29" rx="3" />
    <rect className={styles.idCard} x="8" y="71" width="15" height="13" rx="1.5" />
    <circle className={styles.idDetail} cx="12" cy="76" r="1.5" />
    <path className={styles.idDetail} d="M10 80h4m3-5h3m-3 4h3" />
    <path className={styles.floor} d="M36 124h69l7 7H29l7-7Z" />
    <text className={styles.gateCount} x="71" y="89" textAnchor="middle">{count}</text>
  </svg>;
}

function QueueRail() {
  return <svg className={styles.queueRail} viewBox="0 0 1000 48" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
    <path className={styles.rope} d="M26 9q129 31 258 0m102 0q114 31 228 0m102 0q129 31 258 0M284 9q51 17 102 0m228 0q51 17 102 0" pathLength="1" />
    {[26, 284, 386, 614, 716, 974].map(position => <g className={styles.stanchion} key={position}>
      <circle cx={position} cy="8" r="4" />
      <path d={`M${position} 12v29m-8 2h16`} />
    </g>)}
  </svg>;
}

export function TravelRecapProfileCheckpoints({ assistants, checkpoints, summary, savedInformationNote }: ProfileCheckpointsProps) {
  return <figure className={styles.profileScene} data-scene="profile-checkpoints" aria-label="Assistant information requests compared through an illustrated airport queue. The checkpoints represent booking details, not security screening.">
    <div className={styles.comparison}>
      <QueueRail />
      <ol className={styles.checkpoints}>
        {checkpoints.map((checkpoint, checkpointIndex) => {
          const matching = checkpoint.slugs.map(slug => assistants.find(assistant => assistant.slug === slug)).filter((assistant): assistant is TravelRecapSceneAssistant => !!assistant);
          return <li className={styles.checkpoint} key={checkpoint.id} data-checkpoint={checkpoint.id} data-empty={matching.length === 0} style={{ '--checkpoint-step': checkpointIndex } as CSSProperties}>
            <div className={styles.checkpointHeading}><h3>{checkpoint.title}</h3><span>{checkpoint.criterion}</span></div>
            <div className={styles.lane}><CheckpointGate count={matching.length} /><span className={styles.mobileQueue} aria-hidden="true" /></div>
            <div className={styles.result}>
              {matching.length > 0 ? <ul className={styles.roster} data-count={matching.length} aria-label={`${checkpoint.title}: ${checkpoint.criterion.toLowerCase()} by ${matching.length} assistants`}>
                {matching.map((assistant, assistantIndex) => <li key={assistant.slug} style={{ '--assistant-step': assistantIndex } as CSSProperties}>
                  <Link className={styles.assistant} href={`/benchmarks/travel/dimensions/7#${assistant.slug}`} aria-label={`${assistant.name}: ${checkpoint.title}, ${checkpoint.criterion.toLowerCase()}. View traveler-information evidence.`} title={`${assistant.name}: ${checkpoint.criterion.toLowerCase()}`}>
                    <AgentIcon name={assistant.name} icon={assistant.icon} size={30} className={styles.logo} /><span>{assistant.name}</span>
                  </Link>
                </li>)}
              </ul> : <span className={styles.emptyNote}>{checkpoint.emptyNote ?? 'No requests found.'}</span>}
              {checkpoint.id === 'known-traveler' && savedInformationNote && <span className={styles.savedNote}>{savedInformationNote}</span>}
            </div>
          </li>;
        })}
      </ol>
    </div>
    {summary && <figcaption className={styles.summary}>{summary}</figcaption>}
  </figure>;
}
