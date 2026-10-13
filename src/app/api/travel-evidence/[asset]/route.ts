import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { travelEvidenceFiles } from '@/lib/travel-evidence-media';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Raw evidence is available only on the loopback development preview, never in deployments.
export async function GET(request: Request, { params }: { params: Promise<{ asset: string }> }) {
  const url = new URL(request.url);
  if (process.env.NODE_ENV !== 'development' || !['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)
    || request.headers.get('sec-fetch-site') === 'cross-site') return new Response(null, { status: 404 });
  const { asset } = await params;
  const match = /^(r[123]-[a-z-]+)\.(mp4|png)$/.exec(asset);
  const entry = match && Object.hasOwn(travelEvidenceFiles, match[1]) ? travelEvidenceFiles[match[1]] : undefined;
  const path = entry && (match![2] === 'mp4' ? entry.video : entry.image);
  if (!path) return new Response(null, { status: 404 });
  let size: number;
  try { size = (await stat(path)).size; } catch { return new Response('Local evidence file unavailable.', { status: 404 }); }
  const headers = new Headers({ 'Content-Type': match![2] === 'mp4' ? 'video/mp4' : 'image/png', 'Cache-Control': 'no-store', 'Accept-Ranges': 'bytes', 'X-Content-Type-Options': 'nosniff', 'Cross-Origin-Resource-Policy': 'same-origin' });
  let start = 0, end = size - 1;
  const range = request.headers.get('range');
  if (range) {
    const parts = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!parts || (!parts[1] && !parts[2])) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
    if (!parts[1]) start = Math.max(0, size - Number(parts[2]));
    else { start = Number(parts[1]); if (parts[2]) end = Math.min(end, Number(parts[2])); }
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start > end || start >= size) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
    headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
  }
  headers.set('Content-Length', String(end - start + 1));
  return new Response(Readable.toWeb(createReadStream(path, { start, end })) as ReadableStream, { status: range ? 206 : 200, headers });
}
