import Link from 'next/link';

export function TravelTestCard() {
  return <section className="shelf travel-test-card">
    <p className="cat-kicker">Consumer report · Travel</p>
    <h2 className="ag-h2"><Link href="/reports/consumer-ai-travel">The Consumer AI Travel Report →</Link></h2>
    <p className="ag-sub">Six assistants tested on booking, changes, upgrades and cancellations, with follow-up retests. Read our recommendations and where each service fell short.</p>
  </section>;
}
