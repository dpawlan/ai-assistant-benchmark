/** Viewports onto the original map preserve its exact logos and artwork. */
const sections: Record<string, [number, number, number, number]> = {
  'Big lab & big tech': [80, 205, 3840, 225],
  'Consumer personal assistants': [80, 450, 3840, 645],
  'Shopping & commerce': [80, 1116, 945, 225],
  'Travel': [1045, 1116, 945, 365],
  'Finance & money': [2010, 1116, 945, 505],
  'Email & calendar': [2975, 1116, 945, 365],
  'Multiplayer & group chat': [80, 1642, 945, 225],
  'Home, family & health': [1045, 1642, 945, 530],
  'Voice & phone': [2010, 1642, 945, 225],
  'Open source & self-hosted': [2975, 1642, 945, 365],
  'Work & productivity': [80, 2192, 3840, 646],
  'Agent infrastructure': [80, 2858, 3840, 950],
};

export function MarketMapSection({ heading }: { heading: string }) {
  const bounds = sections[heading];
  if (!bounds) return null;
  const [x, y, width, height] = bounds;
  const clipId = `market-map-${heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <a href="/images/articles/ai-agent-market-map-99328be234.png" target="_blank" rel="noopener noreferrer"
      aria-label={`Enlarge the market map: ${heading}`} style={{ display: 'block', margin: '20px 0 28px' }}>
      <svg viewBox={bounds.join(' ')} role="img" aria-label={`${heading} agents and logos`}
        style={{ display: 'block', width: '100%', height: 'auto', maxHeight: 340, overflow: 'hidden' }}>
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <rect x={x} y={y} width={width} height={height} rx={width * 0.02} />
          </clipPath>
        </defs>
        <image href="/images/articles/ai-agent-market-map-99328be234.png" width="4000" height="3832" clipPath={`url(#${clipId})`} />
      </svg>
    </a>
  );
}
