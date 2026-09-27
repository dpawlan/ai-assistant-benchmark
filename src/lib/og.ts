import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

/**
 * A share image URL that changes whenever the file does. X and iMessage cache a card image by
 * its URL, so a re-rendered card at the same path keeps showing the old picture until the
 * cache expires; a content hash in the query string makes every new render a new URL.
 */
export function ogUrl(publicPath: string): string {
  try {
    const file = fs.readFileSync(path.join(process.cwd(), 'public', publicPath));
    return `${publicPath}?v=${createHash('md5').update(file).digest('hex').slice(0, 8)}`;
  } catch {
    return publicPath;
  }
}
