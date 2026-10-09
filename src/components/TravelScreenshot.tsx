import Image from 'next/image';
import { travelScreenshots } from '@/lib/travel-screenshots';

export function TravelScreenshot({ agent }: { agent: string }) {
  const shot = travelScreenshots[agent];
  if (!shot) return null;
  return <figure className="travel-screenshot">
    <a href={shot.src} target="_blank" rel="noreferrer" aria-label={`${shot.alt} Open full-size screenshot.`}>
      <Image src={shot.src} width={shot.width} height={shot.height} alt={shot.alt} unoptimized />
    </a>
    <figcaption>{shot.caption}</figcaption>
  </figure>;
}
