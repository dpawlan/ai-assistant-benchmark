import Link from 'next/link';
import { AgentIcon } from './AgentIcon';
import { compareTravelRank, TRAVEL_WEIGHTING_DESCRIPTION } from '@/lib/travel-rollup';
import { TRAVEL_REPORT_AGENTS } from '@/lib/travel-suite';
import type { Agent } from '@/lib/types';
import protocol from '../../data/travel-protocol-v1.json';
import profileAudit from '../../data/travel-profile-request-audit.json';
import styles from './TravelRecapComparison.module.css';

type Result = {
  label: string;
  detail?: string;
  status?: 'yes' | 'no' | 'unobserved';
};

type ComparisonRow = {
  title: string;
  dimension: number;
  result: (assistant: Agent) => Result;
};

const profileFindings = new Map(profileAudit.findings.map(finding => [finding.agent, finding]));

const methods: Record<string, Result> = {
  miso: { label: 'Travel agency' },
  'grok-bot': { label: 'Browser' },
  dots: { label: 'Browser' },
  instinct: { label: 'Browser + booking API' },
  muse: { label: 'Browser + booking API' },
};

const rescheduling: Record<string, Result> = {
  miso: { label: 'Yes', detail: 'Cancel + rebook', status: 'yes' },
  'grok-bot': { label: 'Yes', detail: 'You clicked “Change flight”', status: 'yes' },
  dots: { label: 'Yes', detail: 'No extra charge', status: 'yes' },
  instinct: { label: 'Not completed', detail: 'Duffel support required', status: 'no' },
  muse: { label: 'Not completed', detail: 'Booking tool could not change it', status: 'no' },
};

const cancellation: Record<string, Result> = {
  miso: { label: 'Cancelled', detail: 'Human team confirmed seat refund', status: 'yes' },
  'grok-bot': { label: 'Cancelled', detail: 'You re-entered birth date and clicked “Cancel trip”', status: 'yes' },
  dots: { label: 'Cancelled', detail: '$60.01 credit unresolved', status: 'yes' },
  instinct: { label: 'Cancelled', detail: '$35 seat-refund request failed', status: 'yes' },
  muse: { label: 'Cancelled', detail: 'Full refund confirmed', status: 'yes' },
};

const profileHandling: Record<string, string> = {
  miso: 'Saved profile',
  'grok-bot': 'Asked in chat',
  dots: 'Airline sign-in',
  instinct: 'Asked; later reused profile',
  muse: 'Asked in chat',
};

function requestResult(assistant: Agent, field: 'asked_traveler_details' | 'asked_loyalty' | 'asked_known_traveler_number'): Result {
  const finding = profileFindings.get(assistant.slug);
  const inApp = field === 'asked_known_traveler_number' && finding && 'asked_known_traveler_number_in_app' in finding && finding.asked_known_traveler_number_in_app === true;
  const requested = inApp || finding?.[field] === true;
  return {
    label: inApp ? 'Asked in app' : requested ? 'Asked' : 'Not found',
    status: requested ? 'yes' : 'unobserved',
    detail: field === 'asked_known_traveler_number' ? inApp ? 'Before booking; not over text' : 'No text request' : undefined,
  };
}

const tripRows: ComparisonRow[] = [
  { title: 'Booking approach', dimension: 5, result: assistant => methods[assistant.slug] ?? { label: 'Not recorded' } },
  { title: 'Book the flight', dimension: 5, result: () => ({ label: 'Booked', status: 'yes' }) },
  {
    title: 'Paid seat upgrade', dimension: 6,
    result: assistant => assistant.slug === 'muse'
      ? { label: 'Not confirmed', status: 'no' }
      : { label: 'Confirmed', status: 'yes', detail: assistant.slug === 'grok-bot' ? 'You completed browser steps' : undefined },
  },
  { title: 'Reschedule', dimension: 9, result: assistant => rescheduling[assistant.slug] ?? { label: 'Not recorded' } },
  {
    title: 'Basic Economy available¹', dimension: 5,
    result: assistant => ({ label: assistant.slug === 'miso' ? 'Not available' : 'Available', status: assistant.slug === 'miso' ? 'no' : 'yes' }),
  },
  { title: 'Cancel the flight', dimension: 8, result: assistant => cancellation[assistant.slug] ?? { label: 'Not recorded' } },
  {
    title: 'Traveler details collected or reused', dimension: 7,
    result: assistant => ({ label: profileFindings.get(assistant.slug)?.handled_traveler_details ? 'Yes' : 'Not found', detail: profileHandling[assistant.slug], status: profileFindings.get(assistant.slug)?.handled_traveler_details ? 'yes' : 'unobserved' }),
  },
  { title: 'Traveler details asked unprompted³', dimension: 7, result: assistant => requestResult(assistant, 'asked_traveler_details') },
  { title: 'Airline loyalty asked unprompted³', dimension: 7, result: assistant => requestResult(assistant, 'asked_loyalty') },
  { title: 'Known Traveler Number asked unprompted³', dimension: 7, result: assistant => requestResult(assistant, 'asked_known_traveler_number') },
  {
    title: 'Search to checkout under 10 min²', dimension: 19,
    result: assistant => ({ label: ['miso', 'instinct'].includes(assistant.slug) ? 'Under 10 min' : 'Over 10 min', status: ['miso', 'instinct'].includes(assistant.slug) ? 'yes' : 'no' }),
  },
];

function ResultMark({ status }: { status: NonNullable<Result['status']> }) {
  return <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false" className={styles.resultMark}>
    {status === 'yes'
      ? <path d="m3 8 3 3 7-7" />
      : status === 'no'
        ? <path d="m4 4 8 8m0-8-8 8" />
        : <path d="M4 8h8" />}
  </svg>;
}

export function TravelRecapComparison({ assistants }: { assistants: Agent[] }) {
  const ranked = assistants.filter(assistant => TRAVEL_REPORT_AGENTS.includes(assistant.slug)).sort(compareTravelRank);
  return <section className={styles.section} id="comparison" data-recap-comparison aria-labelledby="comparison-title">
    <div className={styles.container}>
      <div className={styles.heading}>
        <h2 id="comparison-title" tabIndex={-1}>All five, side by side.</h2>
      </div>
      <p className={styles.weighting}>{TRAVEL_WEIGHTING_DESCRIPTION} <Link href="/benchmarks/travel/dimensions#how">Scoring methodology →</Link></p>
      <div className={styles.tableRegion}>
        <table className={styles.table}>
          <caption className={styles.visuallyHidden}>Five assistants ranked by the reviewed travel benchmark, with observed trip results, verified information requests and all eight dimension scores.</caption>
          <colgroup><col className={styles.labelColumn} />{ranked.map(assistant => <col key={assistant.slug} />)}</colgroup>
          <thead><tr>
            <th scope="col" className={styles.rowLabel}>Travel benchmark</th>
            {ranked.map((assistant, index) => <th scope="col" key={assistant.slug} data-winner={assistant.slug === 'miso'}>
              <Link className={styles.assistant} href={`/agents/${assistant.slug}`} aria-label={`${assistant.name}, travel rank ${index + 1}. View assistant.`}>
                <span className={styles.rank}>#{index + 1}</span>
                <AgentIcon name={assistant.name} icon={assistant.icon} size={36} className={styles.logo} />
                <span className={styles.assistantName}>{assistant.name}</span>
              </Link>
            </th>)}
          </tr></thead>
          <tbody className={styles.overall}><tr>
            <th scope="row" className={styles.rowLabel}><span>Overall weighted score</span><span className={styles.labelNote}>Out of 10</span></th>
            {ranked.map(assistant => <td key={assistant.slug} data-winner={assistant.slug === 'miso'}>
              <Link href={`/agents/${assistant.slug}`} className={styles.overallScore} aria-label={`${assistant.name}: overall weighted score ${assistant.travel.score?.toFixed(1) ?? 'not reviewed'} out of 10`}>
                {assistant.travel.score?.toFixed(1) ?? '—'}
              </Link>
            </td>)}
          </tr></tbody>
          <tbody>
            <tr className={styles.groupHeading}><th colSpan={ranked.length + 1} scope="rowgroup">Trip results</th></tr>
            {tripRows.map(row => <tr key={row.title}>
              <th scope="row" className={styles.rowLabel}><Link href={`/benchmarks/travel/dimensions/${row.dimension}`}>{row.title}</Link></th>
              {ranked.map(assistant => {
                const result = row.result(assistant);
                return <td key={assistant.slug} data-winner={assistant.slug === 'miso'}>
                  <Link className={styles.result} href={`/benchmarks/travel/dimensions/${row.dimension}#${assistant.slug}`} data-status={result.status} aria-label={`${assistant.name}: ${row.title.replace(/[¹²³]/g, '')}, ${result.label}${result.detail ? `; ${result.detail}` : ''}. View evidence.`}>
                    <span className={styles.resultLabel}>{result.status && <ResultMark status={result.status} />}{result.label}</span>
                    {result.detail && <span className={styles.detail}>{result.detail}</span>}
                  </Link>
                </td>;
              })}
            </tr>)}
          </tbody>
          <tbody className={styles.scoreRows}>
            <tr className={styles.groupHeading}><th colSpan={ranked.length + 1} scope="rowgroup">Reviewed scores <span>· out of 10</span></th></tr>
            {protocol.map(dimension => <tr key={dimension.id}>
              <th scope="row" className={styles.rowLabel}><Link href={`/benchmarks/travel/dimensions/${dimension.id}`}>{dimension.title}</Link>{dimension.id === 19 && <span className={styles.labelNote}>Selected flight → confirmation</span>}</th>
              {ranked.map(assistant => {
                const score = assistant.travel.scores[dimension.id];
                return <td key={assistant.slug} data-winner={assistant.slug === 'miso'}><Link className={styles.dimensionScore} href={`/benchmarks/travel/dimensions/${dimension.id}#${assistant.slug}`} aria-label={`${assistant.name}: ${dimension.title}, ${score === undefined ? 'not reviewed' : `${score} out of 10`}. View reviewed evidence.`}>{score === undefined ? '—' : score.toFixed(1)}</Link></td>;
              })}
            </tr>)}
          </tbody>
        </table>
      </div>
      <Link className={styles.mobileGraphLink} href="/benchmarks/travel/grid">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M3 3v14h14M7 13V9m4 4V6m4 7V4" /></svg>
        View the Travel score grid
        <span aria-hidden="true">↗</span>
      </Link>
      <ul className={styles.notes} aria-label="Comparison scope">
        <li><span>1</span>Basic Economy means inventory access, not the fare purchased.</li>
        <li><span>2</span>Full-flow speed is the reviewer’s assessment; the speed score times flight selection to confirmation.</li>
        <li><span>3</span>Chat requests checked against supplied transcripts; Miso’s Known Traveler Number was collected in its app beforehand. None asked for it over text.</li>
      </ul>
    </div>
  </section>;
}
