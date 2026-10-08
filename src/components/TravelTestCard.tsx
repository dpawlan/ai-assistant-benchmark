import Link from 'next/link';

export function TravelTestCard() {
  return <section className="shelf travel-test-card">
    <p className="cat-kicker">Consumer report · Travel</p>
    <h2 className="ag-h2"><Link href="/reports/consumer-ai-travel">The Consumer AI Travel Report →</Link></h2>
    <p className="ag-sub">Six assistants across two rounds of booking, changes, upgrades and cancellations. Read our recommendations and where each service fell short.</p>
    <div className="travel-test-facts"><span>6 assistants</span><span>2 rounds</span><Link href="/reports/nyc-chicago">View booking benchmark evidence →</Link></div>
  </section>;
}
