import Link from 'next/link';
import { AgentIcon } from './AgentIcon';
import { AuthorAvatar } from './AuthorAvatar';
import { ChapterIcon, TravelRecapFrame, TravelRecapScene } from './TravelRecapFrame';
import { ApproachScene, BookingScene, ChangeScene, FareScene, CancellationScene } from './TravelRecapSystemScenes';
import { TravelRecapSeatMap } from './TravelRecapSeatMap';
import { ProfileScene, SpeedScene } from './TravelRecapUtilityScenes';
import { TravelRecapVerdict } from './TravelRecapVerdict';
import { TravelRecapComparison } from './TravelRecapComparison';
import { TravelReportMode } from './TravelReportMode';
import { TravelReportArticle } from './TravelReportArticle';
import { compareTravelRank } from '@/lib/travel-rollup';
import { TRAVEL_REPORT_AGENTS } from '@/lib/travel-suite';
import type { Agent } from '@/lib/types';
import type { Author } from '@/lib/authors';
import styles from './TravelRecap.module.css';

export function TravelReportJourney({ agents, author }: { agents: Agent[]; author: Author | null }) {
  const assistants = agents.filter(agent => TRAVEL_REPORT_AGENTS.includes(agent.slug)).sort(compareTravelRank);

  const hero = <header id="recap-top" className={styles.hero}>
    <svg className={styles.heroFlights} viewBox="0 0 1400 680" fill="none" aria-hidden="true" focusable="false">
      {[
        { path: 'M -50 440 Q 600 -40 1450 320', delay: '-7s', duration: '29s' },
        { path: 'M 1450 440 Q 800 -40 -50 260', delay: '-16s', duration: '34s' },
        { path: 'M -50 560 Q 700 260 1450 520', delay: '-20s', duration: '38s' },
        { path: 'M 1450 140 Q 650 190 -50 300', delay: '-4s', duration: '41s' },
        { path: 'M -50 220 Q 650 490 1450 410', delay: '-25s', duration: '36s' },
        { path: 'M 1450 600 Q 750 490 -50 590', delay: '-12s', duration: '44s' },
      ].map((route, index) => <g key={route.path}>
        <g className={styles.heroFlight} style={{ offsetPath: `path("${route.path}")`, animationDelay: route.delay, animationDuration: route.duration, offsetDistance: `${(25 + index * 17) % 100}%` }}>
          <path d="m12 0 3 9 9 5v3l-9-2v6l3 2v1l-6-1-6 1v-1l3-2v-6l-9 2v-3l9-5z" transform="translate(-8 -8) scale(.65) rotate(90 12 12)" />
        </g>
      </g>)}
    </svg>
    <div className={styles.heroInner}>
      <h1>Would you let AI<br /><span>book your next flight?</span></h1>
      <ul className={styles.heroRoster} aria-label="The five tested assistants">{assistants.map(assistant => <li key={assistant.slug}><AgentIcon name={assistant.name} icon={assistant.icon} size={40} className={styles.rosterIcon} /><span>{assistant.name}</span></li>)}</ul>
      {author && <Link className={styles.byline} href={`/authors/${author.slug}`}><AuthorAvatar author={author} size={28} /><span>By {author.name}</span></Link>}
    </div>
  </header>;

  const intro = <section className={styles.standards} aria-labelledby="travel-goal-title">
      <div className={styles.goal}>
        <h2 id="travel-goal-title">The Goal: Handle the whole trip in <span>less than 10 minutes.</span></h2>
        <ol className={styles.goalStages} aria-label="The whole trip: booking, seats, changes and cancellation">
          <li><ChapterIcon id="book" /><span>Booking</span></li>
          <li><ChapterIcon id="seats" /><span>Seats</span></li>
          <li><ChapterIcon id="change" /><span>Changes</span></li>
          <li><ChapterIcon id="cancel" /><span>Cancellation</span></li>
        </ol>
      </div>
    </section>;

  const animated = <TravelRecapFrame hero={hero} intro={intro} comparison={<TravelRecapComparison assistants={assistants} />}>
    <TravelRecapScene id="approaches" title="Three ways to book." wide tone="soft"><ApproachScene assistants={assistants} /></TravelRecapScene>
    <TravelRecapScene id="book" title="Can it book the flight?" wide><BookingScene assistants={assistants} /></TravelRecapScene>
    <TravelRecapScene id="seats" title="Can it change or upgrade your seat?" wide tone="soft"><TravelRecapSeatMap assistants={assistants} /></TravelRecapScene>
    <TravelRecapScene id="change" title="Can it reschedule?" wide><ChangeScene assistants={assistants} /></TravelRecapScene>
    <TravelRecapScene id="fares" title="Can it book Basic Economy?" wide tone="soft"><FareScene assistants={assistants} /></TravelRecapScene>
    <TravelRecapScene id="cancel" title="Can it cancel?" answer="Yes—all five could cancel." wide><CancellationScene assistants={assistants} /></TravelRecapScene>
    <TravelRecapScene id="profile" title="Which details did they ask for?" answer={<span>A TSA-style line through what each assistant collected or requested.</span>} wide tone="soft"><ProfileScene assistants={assistants} /></TravelRecapScene>
    <TravelRecapScene id="speed" title="Search to checkout in under ten?" wide><SpeedScene assistants={assistants} /></TravelRecapScene>

    <TravelRecapScene id="verdict" title="Best overall" wide tone="soft"><TravelRecapVerdict assistants={assistants} /></TravelRecapScene>
  </TravelRecapFrame>;

  return <TravelReportMode animated={animated} article={<TravelReportArticle assistants={assistants} author={author} />} />;
}
