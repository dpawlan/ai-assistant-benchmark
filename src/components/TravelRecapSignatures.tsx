import styles from './TravelRecapSignatures.module.css';

const signatures: Record<string, { description: string }> = {
  miso: { description: 'Human support joins the conversation to help resolve the trip' },
  instinct: { description: 'Fast booking, with a blocked date change' },
  'grok-bot': { description: 'A detailed conversation and browser steps requiring traveler takeover' },
  muse: { description: 'Itinerary planning with a seat change left uncompleted' },
  dots: { description: 'More than thirty minutes from flight selection to first booking confirmation' },
};

function MisoGraphic() {
  return <>
    <g className={styles.chatFirst}><path className={styles.outline} d="M15 24h56a10 10 0 0 1 10 10v22a10 10 0 0 1-10 10H31L18 75v-9h-3A10 10 0 0 1 5 56V34a10 10 0 0 1 10-10Z" /><path className={styles.detail} d="M21 40h43M21 49h30" /></g>
    <g className={styles.helper}><circle className={styles.blueFill} cx="89" cy="72" r="19" /><circle cx="89" cy="67" r="5" fill="white" /><path d="M80 83v-2a9 9 0 0 1 18 0v2" fill="white" /></g>
    <path className={`${styles.route} ${styles.draw}`} d="M115 52h17m-5-5 5 5-5 5" pathLength="1" />
    <g className={styles.ticket}><path className={styles.outline} d="M149 26h40v18a8 8 0 0 0 0 16v19h-40V60a8 8 0 0 0 0-16V26Z" /><path className={styles.blueStroke} d="m159 51 7 7 12-13" /></g>
  </>;
}

function InstinctGraphic() {
  return <>
    <path className={`${styles.route} ${styles.draw}`} d="M9 51h89" pathLength="1" />
    <path className={styles.detail} d="M9 39h28M9 63h20" />
    <g className={styles.plane}><path className={styles.blueFill} d="m42 52 23-6-3-19 6-2 10 19 23-5c7-1 11 1 11 4s-3 5-8 6l-25 7-1 17-5 2-9-14-16 3-6-12Z" /></g>
    <path className={`${styles.route} ${styles.draw}`} d="M115 51h17" pathLength="1" />
    <g className={styles.calendar}><rect className={styles.outline} x="140" y="24" width="51" height="59" rx="7" /><path className={styles.detail} d="M140 40h51M153 20v10M179 20v10" /><path className={styles.detail} d="M150 51h5m9 0h5m9 0h5m-33 12h5m9 0h5" /><circle cx="182" cy="76" r="12" fill="white" /><circle className={styles.mutedStroke} cx="182" cy="76" r="10" /><path className={styles.mutedStroke} d="m175 69 14 14" /></g>
  </>;
}

function GrokGraphic() {
  return <>
    <g className={styles.chatFirst}><rect className={styles.outline} x="7" y="13" width="78" height="26" rx="7" /><path className={styles.detail} d="M19 23h53M19 30h35" /></g>
    <g className={styles.chatSecond}><rect className={styles.outline} x="18" y="44" width="78" height="26" rx="7" /><path className={styles.detail} d="M30 54h52M30 61h34" /></g>
    <g className={styles.chatThird}><rect className={styles.outline} x="7" y="75" width="78" height="21" rx="7" /><path className={styles.detail} d="M19 86h51" /></g>
    <path className={`${styles.route} ${styles.draw}`} d="M102 53h13m-5-5 5 5-5 5" pathLength="1" />
    <rect className={styles.outline} x="126" y="24" width="70" height="58" rx="7" /><path className={styles.detail} d="M126 38h70" /><circle className={styles.mutedFill} cx="135" cy="31" r="1.5" /><circle className={styles.mutedFill} cx="142" cy="31" r="1.5" /><path className={styles.detail} d="M139 51h43M139 60h26" />
    <path className={styles.cursor} d="m160 63 3 28 7-8 7 13 6-3-7-13 11-1-27-16Z" />
  </>;
}

function MuseGraphic() {
  return <>
    <path className={`${styles.route} ${styles.draw}`} d="M18 78C34 78 35 31 64 31s30 48 57 48" pathLength="1" />
    <g className={styles.pinFirst}><circle className={styles.blueFill} cx="18" cy="78" r="5" /><circle className={styles.outline} cx="64" cy="31" r="7" /></g>
    <g className={styles.pinLast}><circle className={styles.blueFill} cx="121" cy="79" r="5" /></g>
    <path className={styles.detail} d="M20 93h36M78 17h20" />
    <g className={styles.seat}><path className={styles.outline} d="M153 28h26a7 7 0 0 1 7 7v22h-40V35a7 7 0 0 1 7-7ZM146 57h40v14h-40V57Z" /><path className={styles.detail} d="M152 71v13M180 71v13" /><circle cx="181" cy="78" r="13" fill="white" /><circle className={styles.unconfirmed} cx="181" cy="78" r="11" /><path className={styles.mutedStroke} d="M177 74a4 4 0 0 1 8 0c0 3-4 3-4 6m0 4v.1" /></g>
  </>;
}

function DotsGraphic() {
  return <>
    <path className={styles.blueStroke} d="M89 10h22M100 10v10" />
    <circle className={styles.outline} cx="100" cy="64" r="39" />
    <path className={styles.detail} d="M100 30v4M130 64h4M100 94v4M66 64h4" />
    <path className={styles.clockHand} d="M100 26v6" />
    <text x="100" y="74" textAnchor="middle" fill="currentColor" fontSize="31" fontWeight="550" letterSpacing="-1.5">30+</text>
    <path className={styles.detail} d="M13 55h32M22 65h22M156 55h32M157 65h21" />
  </>;
}

export function AssistantRecapSignature({ slug }: { slug: string }) {
  const signature = signatures[slug];
  if (!signature) return null;
  const graphic = slug === 'miso' ? <MisoGraphic />
    : slug === 'instinct' ? <InstinctGraphic />
      : slug === 'grok-bot' ? <GrokGraphic />
        : slug === 'muse' ? <MuseGraphic />
          : <DotsGraphic />;

  return <figure className={styles.signature} data-signature={slug} aria-label={signature.description}>
    <svg className={styles.art} viewBox="0 0 204 108" fill="none" aria-hidden="true">{graphic}</svg>
  </figure>;
}
