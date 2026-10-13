import Link from 'next/link';
import { AgentIcon } from './AgentIcon';
import { TravelRecapBookingBoard } from './TravelRecapBookingBoard';
import { TravelRecapCancellationDesks } from './TravelRecapCancellationDesks';
import { TravelRecapFarePlane } from './TravelRecapFarePlane';
import styles from './TravelRecapSystemScenes.module.css';

export type TravelRecapSceneAssistant = { slug: string; name: string; icon: string | null };
type SceneProps = { assistants: TravelRecapSceneAssistant[] };

const tripDetails: Record<string, {
  oldDay: number;
  newDay: number;
  changed: boolean;
  change: string;
}> = {
  miso: { oldDay: 9, newDay: 10, changed: true, change: 'Cancelled and rebooked' },
  'grok-bot': { oldDay: 9, newDay: 10, changed: true, change: 'You clicked “Change flight” after its browser stalled.' },
  dots: { oldDay: 9, newDay: 10, changed: true, change: 'No extra charge' },
  instinct: { oldDay: 16, newDay: 17, changed: false, change: 'Duffel support required' },
  muse: { oldDay: 9, newDay: 10, changed: false, change: 'Booking tool couldn’t change the flight' },
};

function AssistantIdentity({ assistant }: { assistant: TravelRecapSceneAssistant }) {
  return <span className={styles.identity}><AgentIcon name={assistant.name} icon={assistant.icon} size={32} className={styles.icon} /><strong>{assistant.name}</strong></span>;
}

function MethodIcon({ method }: { method: string }) {
  return <svg viewBox="0 0 72 56" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {method === 'browser' ? <>
      <rect x="10" y="7" width="49" height="36" rx="4" />
      <path d="M10 17h49M17 12h1m5 0h1m5 0h1M21 25h19m-19 7h12" />
      <path d="m44 29 3 20 5-6 7 3 3-6-7-3 5-5-16-3Z" fill="white" />
    </> : method === 'api' ? <>
      <rect x="22" y="13" width="28" height="30" rx="5" />
      <path d="m32 23-5 5 5 5m8-10 5 5-5 5M22 28H12m38 0h10M36 13V7m0 36v6" />
      <circle cx="8" cy="28" r="4" /><circle cx="64" cy="28" r="4" /><circle cx="36" cy="4" r="3" /><circle cx="36" cy="52" r="3" />
    </> : <>
      <circle cx="27" cy="15" r="7" />
      <path d="M15 35v-4a12 12 0 0 1 24 0v4M10 35h52v13H10V35Zm7 13v4m38-4v4" />
      <path d="m47 9 16 4-16 4 3-4-3-4Zm3 4H40m-21 28h11" />
    </>}
  </svg>;
}

export function ApproachScene({ assistants }: SceneProps) {
  const engines = [
    { method: 'browser', name: 'Browser automation', mechanism: 'Works on the airline website', slugs: ['dots', 'grok-bot', 'instinct', 'muse'] },
    { method: 'api', name: 'Booking APIs', mechanism: 'Connects to booking tools', slugs: ['instinct', 'muse'] },
    { method: 'agency', name: 'Online travel agency', mechanism: 'Booking service + human travel team', slugs: ['miso'] },
  ];

  return <figure className={styles.systemScene} data-scene="approach" aria-label="Three booking approaches, with some assistants using more than one">
    <ol className={styles.methodTickets}>
      {engines.map(engine => <li className={styles.methodTicket} key={engine.name}>
        <div className={styles.methodBody}>
          <h3>{engine.name}</h3>
          <span className={styles.methodSubtitle}>{engine.mechanism}</span>
          <ul className={styles.methodStamps} aria-label={`${engine.name} assistants`}>
            {engine.slugs.map(slug => assistants.find(assistant => assistant.slug === slug)).filter((assistant): assistant is TravelRecapSceneAssistant => !!assistant).map(assistant => <li key={assistant.slug}>
              <Link className={styles.methodStamp} href={`/benchmarks/travel/dimensions/5#${assistant.slug}`} aria-label={`${assistant.name} uses ${engine.name.toLowerCase()}. View booking evidence.`}>
                <AgentIcon name={assistant.name} icon={assistant.icon} size={28} className={styles.stampLogo} />
                <span>{assistant.name}</span>
              </Link>
            </li>)}
          </ul>
        </div>
        <div className={styles.methodStub}><MethodIcon method={engine.method} /></div>
      </li>)}
    </ol>
  </figure>;
}

export function BookingScene({ assistants }: SceneProps) {
  return <TravelRecapBookingBoard assistants={assistants} />;
}

export function ChangeScene({ assistants }: SceneProps) {
  return <figure className={styles.systemScene} data-scene="changes" aria-label="Moving the flight to the following day: three completed changes and two blocked changes">
    <ol className={styles.changeFlights}>
      {assistants.map(assistant => {
        const trip = tripDetails[assistant.slug];
        return <li className={styles.animated} key={assistant.slug} data-agent={assistant.slug}>
          <Link className={styles.changeFlight} data-completed={trip.changed} href={`/benchmarks/travel/dimensions/9#${assistant.slug}`} aria-label={`${assistant.name}: ${trip.changed ? 'date changed' : 'date not changed'}. ${trip.change}. View change evidence.`}>
            <span className={styles.changeIdentity}><AssistantIdentity assistant={assistant} /></span>
            <span className={styles.date} aria-label={`Original date: Friday, October ${trip.oldDay}`}><span>Oct</span><strong>{trip.oldDay}</strong></span>
            <span className={styles.changePath} aria-hidden="true"><span className={styles.routeRail} /><i>{trip.changed ? '→' : '×'}</i><span className={styles.planeCarrier}><span className={styles.planeMarker}><svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 10.5a1.5 1.5 0 0 1 0 3h-7.5L8 21H5.5l3.2-7.5H4l-2 3H.5l1.2-4.5L.5 7.5H2l2 3h4.7L5.5 3H8l5.5 7.5H21Z" /></svg></span></span></span>
            <span className={`${styles.date} ${styles.newDate}`} aria-label={`${trip.changed ? 'Confirmed' : 'Requested, not completed'} date: Saturday, October ${trip.newDay}`}><span>Oct</span><strong>{trip.newDay}</strong></span>
            <span className={styles.changeResult}><strong>{trip.changed ? 'Moved' : 'Not moved'}</strong><span>{trip.change}</span></span>
          </Link>
        </li>;
      })}
    </ol>
  </figure>;
}

export function FareScene({ assistants }: SceneProps) {
  return <TravelRecapFarePlane assistants={assistants} />;
}

export function CancellationScene({ assistants }: SceneProps) {
  return <TravelRecapCancellationDesks assistants={assistants} />;
}
