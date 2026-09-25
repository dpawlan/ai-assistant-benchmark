"""Render a 1200x630 share card per article into public/og/articles/<slug>.png: brand line, wrapped headline, byline."""
import os, re, sys, textwrap
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 1200, 630
BLUE = (10, 132, 255); TEXT = (29, 29, 31); SEC = (110, 110, 115); BG = (255, 255, 255)

def font(weight, size):
    cands = {
        'Bold': [('/System/Library/Fonts/HelveticaNeue.ttc', 1), ('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 0)],
        'Regular': [('/System/Library/Fonts/HelveticaNeue.ttc', 0), ('/System/Library/Fonts/Supplemental/Arial.ttf', 0)],
    }[weight]
    for path, idx in cands:
        if os.path.exists(path):
            try: return ImageFont.truetype(path, size, index=idx)
            except Exception: pass
    return ImageFont.load_default()

def frontmatter(path):
    raw = open(path, encoding='utf8').read()
    m = re.match(r'^---\n([\s\S]*?)\n---', raw); meta = {}
    if m:
        for line in m.group(1).split('\n'):
            if ':' in line: k, v = line.split(':', 1); meta[k.strip()] = v.strip()
    return meta

def fmt_date(iso):
    import datetime
    try: return datetime.date.fromisoformat(iso).strftime('%B %-d, %Y')
    except Exception: return iso

def bubble(size):
    im = Image.new('RGBA', (size, size), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, size, size), radius=int(size * 0.24), fill=BLUE)
    cx, cy = size * 0.5, size * 0.5; rx, ry = size * 0.33, size * 0.27
    d.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=BG)
    d.polygon([(cx - rx * 0.6, cy + ry * 0.55), (cx - rx * 0.95, cy + ry * 1.35), (cx - rx * 0.1, cy + ry * 0.9)], fill=BG)
    return im

def render(md_path):
    meta = frontmatter(md_path); slug = os.path.basename(md_path)[:-3]
    im = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(im)
    mark = bubble(44); im.paste(mark, (72, 64), mark)
    d.text((130, 70), 'Assistant Benchmark', font=font('Bold', 28), fill=TEXT)
    kind = meta.get('kind', 'Article')
    d.text((130 + d.textlength('Assistant Benchmark', font=font('Bold', 28)) + 18, 72), kind, font=font('Regular', 26), fill=SEC)
    title = meta.get('title', slug); size = 64
    while size > 40:
        tf = font('Bold', size); lines = []
        for para in textwrap.wrap(title, width=max(10, int(1056 / (size * 0.5)))):
            lines.append(para)
        if len(lines) <= 3: break
        size -= 4
    tf = font('Bold', size); y = 170; lh = int(size * 1.14)
    for line in lines: d.text((72, y), line, font=tf, fill=TEXT); y += lh
    by = f"By {meta.get('author', '')}, {fmt_date(meta.get('date', ''))}"
    d.text((72, H - 90), by, font=font('Regular', 28), fill=SEC)
    d.text((72, H - 52), 'assistantbenchmark.com/articles', font=font('Regular', 22), fill=SEC)
    d.rectangle((0, H - 8, W, H), fill=BLUE)
    out = os.path.join(ROOT, 'public', 'og', 'articles', f'{slug}.png'); os.makedirs(os.path.dirname(out), exist_ok=True)
    im.save(out, optimize=True); print(out)

if __name__ == '__main__':
    paths = sys.argv[1:] or [os.path.join(ROOT, 'data', 'articles', f) for f in os.listdir(os.path.join(ROOT, 'data', 'articles')) if f.endswith('.md')]
    for p in paths: render(p)
