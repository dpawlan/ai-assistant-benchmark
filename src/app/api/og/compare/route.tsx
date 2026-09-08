import fs from 'node:fs';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { buildComparison, parseFocus, parsePair, publicFile, verdict } from '@/lib/compare';
import { CompareRow } from '@/lib/compare-shared';
import { scoreBucket } from '@/lib/score';
import { ScoreValue } from '@/lib/types';

/**
 * The head-to-head share card, 1200x630. GET /api/og/compare?a=poke&b=instinct[&focus=email_replies,purchasing][&download=1]
 * Also reachable as /compare/poke-vs-instinct[/<focus>]/card.png (rewrite in next.config, `pair=` param).
 * Rendered on demand so highlighted dimensions get their own image; cached at the edge for a day.
 */

const FONTS = path.join(process.cwd(), 'src', 'assets', 'fonts');
const inter = (file: string) => fs.readFileSync(path.join(FONTS, file));
const medium = inter('Inter-Medium.ttf');
const bold = inter('Inter-Bold.ttf');

const BLUE = '#0a84ff';
const TEXT = '#1d1d1f';
const SEC = '#6e6e73';
const FILL = '#f5f5f7';
const HAIR = 'rgba(0,0,0,0.08)';

function iconData(icon: string | null): string | null {
  if (!icon) return null;
  try {
    const file = publicFile(icon);
    const ext = path.extname(file).slice(1).toLowerCase();
    const mime = ext === 'svg' ? 'image/svg+xml' : ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
    return `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;
  } catch {
    return null;
  }
}

/** The score ramp from globals.css, as flat colours. */
function pill(value: ScoreValue): { bg: string; fg: string; text: string } {
  if (value === 'n/a') return { bg: FILL, fg: SEC, text: 'N/A' };
  if (typeof value !== 'number') return { bg: 'transparent', fg: '#b0b0b5', text: '—' };
  const b = scoreBucket(value);
  const bg = [null, 'rgba(10,132,255,0.08)', 'rgba(10,132,255,0.16)', 'rgba(10,132,255,0.3)', 'rgba(10,132,255,0.55)', BLUE][b] as string;
  const fg = b >= 4 ? '#fff' : b === 3 ? '#0056b3' : BLUE;
  return { bg, fg, text: Number.isInteger(value) ? String(value) : value.toFixed(1) };
}

function Tile({ src, name, size }: { src: string | null; name: string; size: number }) {
  const r = Math.round(size * 0.23);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: r,
        background: src ? '#fff' : FILL,
        border: `2px solid ${HAIR}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} width={size} height={size} alt="" style={{ objectFit: 'contain' }} />
      ) : (
        <span style={{ fontSize: size * 0.46, fontWeight: 700, color: SEC }}>{name.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
}

function Check({ on }: { on: boolean }) {
  return (
    <div
      style={{
        width: 30,
        height: 30,
        borderRadius: 15,
        background: on ? BLUE : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {on && (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 10.5l3.2 3.2L15 6.8" />
        </svg>
      )}
    </div>
  );
}

function Score({ value }: { value: ScoreValue }) {
  const p = pill(value);
  return (
    <div
      style={{
        width: 56,
        height: 40,
        borderRadius: 10,
        background: p.bg,
        color: p.fg,
        fontSize: 22,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {p.text}
    </div>
  );
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  // Rewritten from /compare/<pair>[/<focus>]/card.png: a route handler sees the original URL, not the
  // destination query, so read the pair and focus straight off the path in that case.
  const pretty = /^\/compare\/([^/]+)(?:\/([^/]+))?\/card\.png$/.exec(req.nextUrl.pathname);
  const pairRaw = pretty?.[1] ?? q.get('pair');
  const pair = pairRaw ? parsePair(decodeURIComponent(pairRaw)) : null;
  const a = pair?.[0] ?? q.get('a') ?? '';
  const b = pair?.[1] ?? q.get('b') ?? '';
  const c = a && b ? buildComparison(a, b) : null;
  if (!c) return new Response('Unknown pair', { status: 404 });
  const focus = parseFocus(pretty ? pretty[2] : q.get('focus'));
  const v = verdict(c, focus);

  // Rows on the card: the highlighted ones, else every decided row; at most six, in rubric order.
  const pool: CompareRow[] = focus.length ? c.rows.filter(r => focus.includes(r.key)) : c.rows.filter(r => r.winner !== null);
  const shown = pool.slice(0, 6);
  const more = pool.length - shown.length;
  const lead = v.tally.a === v.tally.b ? null : v.tally.a > v.tally.b ? 'a' : 'b';
  const iconA = iconData(c.a.icon);
  const iconB = iconData(c.b.icon);
  const compact = shown.length > 4;

  const image = new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#fff',
          color: TEXT,
          fontFamily: 'Inter',
          display: 'flex',
          flexDirection: 'column',
          padding: '40px 64px 36px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 22, fontWeight: 500, color: SEC }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 16 16" fill="#fff">
                <path d="M8 2C4.4 2 1.5 4.4 1.5 7.4c0 1.6.8 3 2.1 4-.2.9-.7 1.7-1.3 2.3 1.4-.1 2.7-.6 3.7-1.3.6.1 1.3.2 2 .2 3.6 0 6.5-2.4 6.5-5.4S11.6 2 8 2z" />
              </svg>
            </div>
            <span style={{ color: TEXT, fontWeight: 700 }}>Assistant Benchmark</span>
          </div>
          <span>{focus.length ? `Head to head · ${focus.length} highlighted` : 'Head to head'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: compact ? 26 : 44 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, width: 360, flexShrink: 0 }}>
            <Tile src={iconA} name={c.a.name} size={compact ? 96 : 120} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: c.a.name.length > 12 ? 34 : 44, fontWeight: 700, letterSpacing: -1 }}>{c.a.name}</span>
              <span style={{ fontSize: 20, color: SEC, marginTop: 4 }}>{c.a.overall === null ? 'Not tested yet' : `${c.a.overall.toFixed(1)} overall`}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 352, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, fontSize: compact ? 84 : 104, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>
              <span style={{ color: lead === 'b' ? SEC : TEXT }}>{v.tally.a}</span>
              <span style={{ color: '#c7c7cc', fontSize: compact ? 60 : 72 }}>–</span>
              <span style={{ color: lead === 'a' ? SEC : TEXT }}>{v.tally.b}</span>
            </div>
            <span style={{ fontSize: 19, color: SEC, marginTop: 6, textAlign: 'center', lineHeight: 1.25 }}>{v.detail.replace(/\.$/, '')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 22, width: 360, flexShrink: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: c.b.name.length > 12 ? 34 : 44, fontWeight: 700, letterSpacing: -1, textAlign: 'right' }}>{c.b.name}</span>
              <span style={{ fontSize: 20, color: SEC, marginTop: 4 }}>{c.b.overall === null ? 'Not tested yet' : `${c.b.overall.toFixed(1)} overall`}</span>
            </div>
            <Tile src={iconB} name={c.b.name} size={compact ? 96 : 120} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', marginTop: compact ? 22 : 36, flexGrow: 1 }}>
          {shown.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1, fontSize: 26, color: SEC }}>
              {focus.length ? 'Neither has been tested on the highlighted dimensions yet.' : 'Not tested head to head yet.'}
            </div>
          ) : (
            shown.map((r, i) => (
              <div
                key={r.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: compact ? 50 : 60,
                  borderTop: i === 0 ? 'none' : `1px solid ${HAIR}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: 120 }}>
                  <Check on={r.winner === 'a'} />
                  <Score value={r.a} />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, fontSize: 24, fontWeight: 500 }}>
                  <span>{r.label}</span>
                  {r.winner === 'tie' && <span style={{ fontSize: 18, color: SEC }}>tie</span>}
                  {r.winner === null && <span style={{ fontSize: 18, color: SEC }}>not compared</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, width: 120 }}>
                  <Score value={r.b} />
                  <Check on={r.winner === 'b'} />
                </div>
              </div>
            ))
          )}
          {more > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', fontSize: 18, color: SEC, marginTop: 8 }}>
              {`+${more} more ${more === 1 ? 'dimension' : 'dimensions'} on the site`}
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: medium, weight: 500, style: 'normal' },
        { name: 'Inter', data: bold, weight: 700, style: 'normal' },
      ],
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=86400, stale-while-revalidate=604800',
        ...(q.get('download')
          ? { 'Content-Disposition': `attachment; filename="${c.a.slug}-vs-${c.b.slug}${focus.length ? '-' + focus.join('-') : ''}.png"` }
          : {}),
      },
    },
  );
  return image;
}
