import 'server-only';
import { homedir } from 'node:os';
import { join } from 'node:path';

const downloads = process.env.TRAVEL_EVIDENCE_DIR || join(homedir(), 'Downloads');
const rounds = '/tmp/travel-evidence-round3';
const stills = '/tmp/travel-audit';
export const travelEvidenceFiles: Record<string, { video: string; image?: string }> = {
  'r1-grok-bot': { video: join(downloads, 'grokbot.mp4'), image: join(stills, 'grokbot.mp4-1107.png') },
  'r1-miso': { video: join(downloads, 'miso.mp4'), image: join(stills, 'miso.mp4-676.png') },
  'r1-muse': { video: join(downloads, 'muse.mp4'), image: join(stills, 'muse.mp4-1482.png') },
  'r1-soar': { video: join(downloads, 'soar.mp4'), image: join(stills, 'soar.mp4-78.png') },
  'r2-grok-bot': { video: join(downloads, 'grokbot (1).mp4'), image: join(stills, 'grokbot (1).mp4-1804.png') },
  'r2-miso': { video: join(downloads, 'miso (1).mp4'), image: join(stills, 'miso (1).mp4-1278.png') },
  'r2-muse': { video: join(downloads, 'muse (1).mp4'), image: join(stills, 'muse (1).mp4-1782.png') },
  'r2-muse-cancel': { video: join(downloads, 'muse2.mp4'), image: join(stills, 'muse2.mp4-234.png') },
  'r2-dots': { video: join(downloads, 'dot.mp4'), image: join(stills, 'dot.mp4-4073.png') },
  'r3-instinct': { video: join(rounds, 'instinct.mp4'), image: join(rounds, 'instinct.png') },
  'r3-soar': { video: join(rounds, 'soar.mp4'), image: join(rounds, 'soar.png') },
};
