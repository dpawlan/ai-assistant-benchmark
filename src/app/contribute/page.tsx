import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contribute runs',
  description: 'Add your own conversations with an assistant to the benchmark as reviewed test runs. Your agent does the work; the transcript never leaves your machine.',
};

const SKILL = 'https://raw.githubusercontent.com/dpawlan/ai-assistant-benchmark/main/skills/contribute-runs/SKILL.md';

export default function ContributePage() {
  return (
    <div className="wrap mid">
      <div className="page-head">
        <h1 className="page-title">Contribute runs</h1>
        <p className="page-sub">
          Already texting one of these assistants? Your threads are evidence. Install one skill, and your agent turns them into test runs for the benchmark, without sending the conversations anywhere.
        </p>
      </div>

      <section className="cb-section">
        <h2 className="ag-h2">Install the skill</h2>
        <p className="cb-p">Give your agent the skill file. Claude Code, Cursor, Openclaw and most agents that read a SKILL.md work. Then ask it to contribute your runs.</p>
        <pre className="cb-code"><code>{`# Claude Code
mkdir -p ~/.claude/skills/contribute-runs && curl -fsSL ${SKILL} -o ~/.claude/skills/contribute-runs/SKILL.md

# Any other agent: paste this URL and say "follow this skill"
${SKILL}`}</code></pre>
        <p className="cb-p">Then say: <b>&ldquo;Contribute my runs to the Assistant Benchmark.&rdquo;</b></p>
      </section>

      <section className="cb-section">
        <h2 className="ag-h2">What happens</h2>
        <ol className="cb-steps">
          <li><b>It finds your threads.</b> One-to-one conversations with assistants on the roster, matched by the assistant&apos;s number. Threads with people are never touched.</li>
          <li><b>It redacts and analyzes locally.</b> Emails, numbers, names and links are stripped. The thread is split into episodes and matched to the published tests, with timing.</li>
          <li><b>You review every draft.</b> Your agent shows each episode, the test it matched, and a proposed score. You drop anything you do not want to share.</li>
          <li><b>You see exactly what is sent, then say yes.</b> Redacted excerpts, reply-time stats, your handle and a disclosure. The transcript stays on your machine.</li>
          <li><b>We review.</b> Every run is scored against the same rubric as our own before it appears. Approved runs show on the assistant&apos;s profile with &ldquo;Run by @you&rdquo; on the evidence page.</li>
        </ol>
      </section>

      <section className="cb-section">
        <h2 className="ag-h2">What you need</h2>
        <ul className="cb-list">
          <li>A Mac with your Messages history for iMessage or SMS threads. WhatsApp and Telegram exports work on any computer.</li>
          <li>Node 22.13 or newer. Nothing else to install.</li>
          <li>Full Disk Access for your terminal, so the script can read Messages. Your agent will tell you if it is missing.</li>
          <li>A handle we can credit, and an honest line about any ties to an assistant. Ties are fine; they are labelled.</li>
        </ul>
      </section>

      <section className="cb-section">
        <h2 className="ag-h2">What we will never do</h2>
        <ul className="cb-list">
          <li>Receive or store your conversations. The bundle carries excerpts that have been redacted twice, once on your machine and once on ours.</li>
          <li>Let a contribution set a score. Contributors propose; the benchmark decides, against the <Link href="/dimensions#how">published rubric</Link>.</li>
          <li>Publish without review, or take money to rank anyone. Nothing on this site is sponsored.</li>
        </ul>
        <p className="cb-p">Questions or a channel we do not support yet? <Link href="/request">Tell us</Link>.</p>
      </section>
    </div>
  );
}
