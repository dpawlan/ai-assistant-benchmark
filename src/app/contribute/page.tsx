import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contribute runs',
  description: 'Submit reviewed excerpts from your assistant conversations. David confirms scores and publication.',
};
export default function ContributePage() {
  return (
    <div className="wrap mid">
      <div className="page-head">
        <h1 className="page-title">Contribute runs</h1>
        <p className="page-sub">Help us test assistants with evidence from your own experience. You choose what to share; David reviews the evidence and confirms any public score.</p>
      </div>
      <section className="cb-section">
        <h2 className="ag-h2">Install the contribution skill</h2>
        <p className="cb-p">Install the contribution skill for Codex or Claude Code using the tested version in the guide. No invitation or account is required; every submission is reviewed before publication.</p>
        <p className="cb-p">Interested? <a href="/downloads/contributor-install.txt">Read the installation guide</a>.</p>
      </section>
      <section className="cb-section">
        <h2 className="ag-h2">How it works</h2>
        <ol className="cb-steps">
          <li>Select an assistant conversation and date range. Messages on a Mac, WhatsApp text exports and dated text imports are supported in the pilot.</li>
          <li>The local scripts prepare redacted excerpts and timing signals. Review names and other sensitive details that automatic redaction may miss.</li>
          <li>See the complete submission, including your public attribution and affiliations, and choose whether excerpts may be published. Nothing is submitted without your confirmation.</li>
          <li>Receive a submission ID. David independently reviews the evidence, decides the score and approves the public result.</li>
        </ol>
        <p className="cb-p">Pilot contributions are labelled and do not change headline rankings or Speed. A submitted conversation is not independently authenticated merely because it has been reviewed.</p>
      </section>
      <section className="cb-section">
        <h2 className="ag-h2">What is shared</h2>
        <p className="cb-p">The workflow processes your selected conversation on your device. Your agent provider may process the redacted excerpts you ask the agent to review. With permission, the exact previewed excerpts, timing signals, notes, attribution, context and disclosures go to our private intake.</p>
        <p className="cb-p">Attribution is self-reported. To limit spam, we temporarily store a keyed hash of your network address, with hourly and daily submission limits. Private submissions expire from intake after 90 days. Only results approved by David are published, and public excerpts additionally require your permission. Approved public results remain until corrected or withdrawn; copies may persist elsewhere.</p>
        <p className="cb-p">For a correction or withdrawal, email davidmpawlan@gmail.com with the receipt ID. Do not email raw conversations. Full Disk Access is needed only for the Mac Messages route. Telegram is not supported yet.</p>
      </section>
    </div>
  );
}
