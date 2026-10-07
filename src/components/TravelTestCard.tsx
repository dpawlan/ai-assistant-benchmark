import Link from 'next/link';

export function TravelTestCard() {
  return <section className="shelf travel-test-card">
    <p className="cat-kicker">Report · October 6, 2026</p>
    <h2 className="ag-h2"><Link href="/reports/nyc-chicago">Which AI assistant can actually book your flight? →</Link></h2>
    <p className="ag-sub">Five assistants. One NYC → Chicago request. Read the report for the outcomes, recordings and screenshots.</p>
    <div className="travel-test-facts"><span>5 assistants</span><span>3 reported bookings</span><span>Recordings pending upload</span></div>
  </section>;
}
