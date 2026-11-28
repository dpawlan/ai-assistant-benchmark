import artwork from '../../data/market-map-artwork.json';

/** A rounded viewport onto the full map artwork for each directory section. */
export function MarketMapSection({ heading }: { heading: string }) {
  const bounds = artwork.sections[heading as keyof typeof artwork.sections];
  if (!bounds) return null;
  const [x, y, width, height] = bounds;
  const clipId = `market-map-${heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return (
    <a href={artwork.hero} target="_blank" rel="noopener noreferrer"
      aria-label={`Enlarge the market map: ${heading}`} style={{ display: 'block', margin: '20px 0 28px' }}>
      <svg viewBox={bounds.join(' ')} role="img" aria-label={`${heading} products and logos`}
        style={{ display: 'block', width: '100%', height: 'auto', maxHeight: 340, overflow: 'hidden' }}>
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <rect x={x} y={y} width={width} height={height} rx={width * 0.02} />
          </clipPath>
        </defs>
        <image href={artwork.hero} width={artwork.width} height={artwork.height} clipPath={`url(#${clipId})`} />
      </svg>
    </a>
  );
}
