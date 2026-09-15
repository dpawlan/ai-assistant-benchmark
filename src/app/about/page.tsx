import { Metadata } from 'next';
import Link from 'next/link';
import { getBenchmarkStats, getIndexData, getScoredCategories } from '@/lib/data';

export const metadata: Metadata = {
  title: 'About',
  description: 'A free, independent scorecard for the assistants you can text. No sponsors, no paid rankings, ever.',
};

export default function AboutPage() {
  const index = getIndexData();
  const stats = getBenchmarkStats();
  const dimensions = getScoredCategories().length;

  return (
    <div className="wrap">
      <div className="page-head">
        <h1 className="page-title">About</h1>
        <p className="page-sub">A free scorecard for the assistants you can text.</p>
      </div>

      <section className="about-section">
        <p className="about-lead">
          {index.agent_count} assistants promise to run your life by text. Nobody could compare them, because everyone demos a different task. So we
          wrote {dimensions} tasks, published them, and run the same ones against every product we can get into.
        </p>
        <p className="about-p">
          Every score comes from a real conversation on a real account, and links to its own evidence. {stats.testedCount} assistants have been scored
          so far, across {stats.runCount} runs. Untested means blank, never a guess.
        </p>
      </section>

      <section className="about-section">
        <h2>Free, and staying that way</h2>
        <p className="about-p">
          This is free and it is for the people using these products, not the people selling them. No sponsors, no paid placements, no affiliate links,
          no pay-to-be-tested. Not now and not later. Vendors can <Link href="/request">request a test</Link> and{' '}
          <Link href="/use-cases/submit">submit a use case</Link> like anyone else, and their submissions are labelled so you know who sent them.
        </p>
      </section>

      <section className="about-section">
        <h2>Who</h2>
        <div className="about-people">
          <article className="about-person">
            <h3>David Pawlan</h3>
            <p className="about-role">Runs the benchmark</p>
            <p className="about-p">
              Tests the assistants from his own accounts, sets every score, and writes the tasks. The runs here are his actual threads: the flights
              booked, the flowers ordered, the routines that never fired.
            </p>
            <p className="about-links">
              <a href="https://x.com/DavidPawlan" target="_blank" rel="noopener noreferrer">
                @DavidPawlan
              </a>
            </p>
          </article>

          <article className="about-person">
            <h3>Autumn Moulder</h3>
            <p className="about-role">Testing and scores</p>
            <p className="about-p">
              Around twenty years building technology outside the big-tech bubble, most recently at Cohere. In her words: &ldquo;I have thoughts…and had
              to live with the consequences.&rdquo;
            </p>
            <p className="about-links">
              <a href="https://moulder.me" target="_blank" rel="noopener noreferrer">
                moulder.me
              </a>
            </p>
          </article>
        </div>
      </section>

      <section className="about-section">
        <p className="about-p">
          Think a score is wrong, or shipped something since we tested? Say so and we will retest. The tasks and the runs are public so they can be
          argued with. <Link href="/dimensions#how">How scoring works</Link>.
        </p>
      </section>
    </div>
  );
}
