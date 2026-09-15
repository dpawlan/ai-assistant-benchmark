import { Metadata } from 'next';
import Link from 'next/link';
import { getBenchmarkStats, getIndexData, getScoredCategories } from '@/lib/data';

export const metadata: Metadata = {
  title: 'About',
  description: 'Who runs Assistant Benchmark, how the testing works, and how it pays for itself.',
};

export default function AboutPage() {
  const index = getIndexData();
  const stats = getBenchmarkStats();
  const dimensions = getScoredCategories().length;

  return (
    <div className="wrap">
      <div className="page-head">
        <h1 className="page-title">About</h1>
        <p className="page-sub">
          A public scorecard for the assistants you can text. Every score comes from someone actually using the product, not from a press release.
        </p>
      </div>

      <section className="about-section">
        <h2>What this is</h2>
        <p className="about-p">
          There are more than {index.agent_count} assistants that claim to run your life by text. Almost none of them can be compared, because everyone
          demos a different task. So we wrote {dimensions} tasks, published them, and run the same ones against every product we can get access to.{' '}
          {stats.testedCount} assistants have at least one scored dimension so far, from {stats.runCount} logged runs.
        </p>
        <p className="about-p">
          A score is never a guess. It comes from a run: a real conversation, on a real account, with a published task and written anchors for what a 3,
          a 7 and a 10 look like. Each run links to its own evidence page. Where an assistant has not been tested, the cell is empty rather than
          filled in.
        </p>
        <p className="about-p">
          Alongside the benchmark we collect what people say in public. That is kept strictly separate: public opinion is a share of positive posts,
          never a score, and it never feeds the benchmark. Founder, vendor and paid posts are excluded.
        </p>
      </section>

      <section className="about-section">
        <h2>Who</h2>
        <div className="about-people">
          <article className="about-person">
            <h3>David Pawlan</h3>
            <p className="about-role">Runs the benchmark</p>
            <p className="about-p">
              Tests the assistants from his own accounts and threads, decides every score, and writes the tasks. The hands-on runs on this site are his
              conversations: the flights actually booked, the flowers actually ordered, the routines that never fired.
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
              to live with the consequences.&rdquo; She runs assistants against the published tasks and files the results.
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
        <h2>How it pays for itself</h2>
        <p className="about-p">
          It doesn&apos;t, yet. No sponsored placements, no paid rankings, no affiliate links. Vendors can{' '}
          <Link href="/request">request a test</Link> and{' '}
          <Link href="/use-cases/submit">submit a use case</Link>, and those arrive in the same queue as everyone else&apos;s, labelled so you know who
          sent them. If that ever changes it will be written here first.
        </p>
      </section>

      <section className="about-section">
        <h2>Corrections</h2>
        <p className="about-p">
          If a score is wrong, or your product has shipped something since we tested it, say so and we will retest. The task set and every run are
          public precisely so they can be argued with. <Link href="/dimensions#how">How scoring works</Link> lays out the rules.
        </p>
      </section>
    </div>
  );
}
