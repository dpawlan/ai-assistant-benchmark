import Link from 'next/link';
import { AuthorAvatar } from './AuthorAvatar';
import { TravelRecapComparison } from './TravelRecapComparison';
import type { Agent } from '@/lib/types';
import type { Author } from '@/lib/authors';
import styles from './TravelReportArticle.module.css';

export function TravelReportArticle({ assistants, author }: { assistants: Agent[]; author: Author | null }) {
  return <div className={styles.page}>
    <article className={styles.article}>
      <header id="recap-top" className={styles.header}>
        <h1>Would you let AI book your next flight?</h1>
        {author && <Link className={styles.byline} href={`/authors/${author.slug}`}><AuthorAvatar author={author} size={28} /><span>By {author.name}</span></Link>}
        <p>We tested five AI assistants with real flight bookings: Miso, Grok Bot, Dots, Instinct and Muse. All five could book a flight. The differences became clear when we asked them to choose seats, change plans and finish quickly.</p>
        <p>The goal was simple: handle the whole trip in less than ten minutes, from search and preferences to checkout.</p>
      </header>
      <section id="approaches" data-article-chapter>
        <h2>Three ways to book</h2>
        <p>Grok Bot, Dots, Instinct and Muse use browser automation to work on airline websites. Instinct and Muse also use booking APIs. Miso operates as an online travel agency, with a human travel team available in the chat. These approaches overlap; an assistant may use more than one.</p>
      </section>
      <section id="book" data-article-chapter>
        <h2>Can they book the flight?</h2>
        <p>All five completed a booking, but the experience varied. Miso and Instinct were fast. Grok Bot stalled and needed the traveler to complete some browser actions, while its lengthy responses made the process cumbersome. Dots completed the tasks but took more than thirty minutes. Muse was strong at planning, though the booking process was slower.</p>
      </section>
      <section id="seats" data-article-chapter>
        <h2>Can they change or upgrade a seat?</h2>
        <p>Miso, Dots and Instinct confirmed paid seat upgrades. Grok Bot also completed an upgrade, but the traveler had to click the agreement and purchase controls after its browser stalled. Muse could not complete or confirm the upgrade.</p>
        <p><Link href="/benchmarks/travel/dimensions/6">View the seat-selection evidence.</Link></p>
      </section>
      <section id="change" data-article-chapter>
        <h2>Can they reschedule?</h2>
        <p>Miso, Grok Bot and Dots moved the trip. Miso cancelled and rebooked; Dots completed the change without an extra charge. Grok Bot needed the traveler to click “Change flight” after its browser stalled.</p>
        <p>Instinct could not make the change through its Duffel booking provider and required Duffel support. Muse’s booking tool could not change the flight. Those limitations matter if your plans may shift.</p>
      </section>
      <section id="fares" data-article-chapter>
        <h2>Can they book Basic Economy?</h2>
        <p>Grok Bot, Dots, Instinct and Muse had access to Basic Economy fares. Miso did not. This describes available inventory, not the fare each assistant ultimately purchased. Miso’s restriction is a major limitation for budget travel.</p>
      </section>
      <section id="cancel" data-article-chapter>
        <h2>Can they cancel?</h2>
        <p>All five cancelled the flight. Miso’s human team confirmed an $85.99 seat refund. Grok Bot needed the traveler to re-enter their birth date and click “Cancel trip.” Dots left a $60.01 credit unresolved, and Instinct’s $35 seat-refund request failed. Muse confirmed a full $354.40 refund.</p>
        <p><Link href="/benchmarks/travel/dimensions/8">View the cancellation evidence.</Link></p>
      </section>
      <section id="profile" data-article-chapter>
        <h2>Which traveler details did they request?</h2>
        <p>All five collected or reused traveler details. Grok Bot, Instinct and Muse asked for identity or contact details in the supplied chats. Miso used a saved profile, and Dots used airline sign-in.</p>
        <p>Miso, Dots and Muse proactively asked about airline loyalty. Miso was the only service to collect a Known Traveler Number unprompted: it uses its app beforehand to collect traveler information, then applies saved PreCheck to the booking. None of the services asked for the number over text.</p>
      </section>
      <section id="speed" data-article-chapter>
        <h2>Can they finish in less than ten minutes?</h2>
        <p>Only Miso and Instinct met the reviewer’s ten-minute threshold for the full flow, including search and preferences through checkout. Grok Bot, Dots and Muse did not. This assessment covers more of the process than the separately scored interval from flight selection to confirmation.</p>
      </section>
      <section id="verdict" data-article-chapter>
        <h2>Best overall: Miso</h2>
        <p>Miso excelled across the trip: fast execution, support for seats and changes, and human backup when needed. Its lack of Basic Economy is a major hindrance for budget travelers.</p>
        <h3>The fast Basic Economy alternative: Instinct</h3>
        <p>Instinct combined Basic Economy access with a fast booking experience and confirmed paid seat upgrades. Its main limitation is flight changes: Duffel support was required. Instinct ranks second under the benchmark’s weighting: booking speed counts for 40%, and the other seven dimensions share 60% equally.</p>
        <p>Grok Bot could complete every task but needed browser help and was slow and verbose. Dots was capable but too slow for practical use in this test. Muse’s planning was strong, but its seat-upgrade and rescheduling limitations weakened the overall result.</p>
      </section>
    </article>
    <TravelRecapComparison assistants={assistants} />
  </div>;
}
