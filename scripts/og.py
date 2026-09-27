#!/usr/bin/env python3
"""Render share images into public/og/: site.png (the logo mosaic) plus one per assistant.

Drawn at 2x (2400x1260) so they stay crisp on the phone screens X and iMessage show them on;
layout.tsx declares the same size. Fonts are the Inter files in src/assets/fonts.
Run after adding assistants or logos:  python3 scripts/og.py"""
import json, math, os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'og')
FONTS = os.path.join(ROOT, 'src', 'assets', 'fonts')
SCALE = 2
W, H = 1200 * SCALE, 630 * SCALE
BLUE = (10, 132, 255)
TEXT = (29, 29, 31)
SEC = (110, 110, 115)
FILL = (245, 245, 247)
HAIR = (0, 0, 0, 18)
BG = (255, 255, 255)


def s(v):
    """Design units (1200x630) to pixels."""
    return int(round(v * SCALE))


def font(weight, size):
    return ImageFont.truetype(os.path.join(FONTS, f'Inter-{weight}.ttf'), s(size))


def rmask(size, radius):
    m = Image.new('L', (size, size), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=255)
    return m


def bubble_mark(size):
    """The site mark: blue rounded square with a white speech bubble."""
    im = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, size - 1, size - 1), radius=int(size * 0.24), fill=BLUE)
    u = size / 64
    d.ellipse((12 * u, 16 * u, 52 * u, 50 * u), fill=BG)
    d.polygon([(18 * u, 42 * u), (13 * u, 55 * u), (29 * u, 47 * u)], fill=BG)
    return im


def logo_tile(path, size):
    """Assistant logo on a white rounded tile with a hairline, like the row icon on the site."""
    face = Image.new('RGBA', (size, size), (255, 255, 255, 255))
    if path and os.path.exists(path):
        face.alpha_composite(Image.open(path).convert('RGBA').resize((size, size), Image.LANCZOS))
    face.putalpha(rmask(size, int(size * 0.24)))
    ImageDraw.Draw(face).rounded_rectangle((0, 0, size - 1, size - 1), radius=int(size * 0.24), outline=HAIR, width=max(1, size // 48))
    return face


def letter_tile(letter, size):
    tile = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(tile)
    d.rounded_rectangle((0, 0, size - 1, size - 1), radius=int(size * 0.24), fill=FILL + (255,))
    f = ImageFont.truetype(os.path.join(FONTS, 'Inter-Bold.ttf'), int(size * 0.46))
    d.text((size / 2, size / 2), letter, font=f, fill=SEC, anchor='mm')
    return tile


def wordmark(im, x, y, size=22):
    m = bubble_mark(s(size * 1.5))
    im.alpha_composite(m, (s(x), s(y)))
    ImageDraw.Draw(im).text((s(x) + m.width + s(12), s(y) + m.height / 2), 'Assistant Benchmark', font=font('Bold', size), fill=TEXT, anchor='lm')


def site_card(index, scored, out):
    """A faded grid of every assistant's logo, rank order first, behind a white panel with the question."""
    im = Image.new('RGBA', (W, H), BG + (255,))
    size, gap = s(96), s(18)
    cols = math.ceil(W / (size + gap)) + 1
    rows = math.ceil(H / (size + gap)) + 1
    ranked = sorted((a for a in index['agents'] if a.get('overall') is not None), key=lambda a: -a['overall'])
    rest = [a for a in index['agents'] if a.get('overall') is None]
    pool = [a for a in ranked + rest if a.get('icon') and os.path.exists(os.path.join(ROOT, 'public', a['icon'].lstrip('/')))]
    i = 0
    for r in range(rows):
        for c in range(cols):
            a = pool[i % len(pool)]
            i += 1
            x = c * (size + gap) - (size // 2 if r % 2 else 0) - s(20)
            y = r * (size + gap) - s(30)
            tile = logo_tile(os.path.join(ROOT, 'public', a['icon'].lstrip('/')), size)
            tile.putalpha(tile.getchannel('A').point(lambda v: int(v * 0.55)))
            im.alpha_composite(tile, (x, y))
    pw, ph = s(880), s(340)
    px, py = (W - pw) // 2, (H - ph) // 2
    shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((px, py + s(16), px + pw, py + ph + s(16)), radius=s(32), fill=(0, 0, 0, 70))
    im.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(s(24))))
    panel = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(panel).rounded_rectangle((px, py, px + pw, py + ph), radius=s(32), fill=(255, 255, 255, 246))
    im.alpha_composite(panel)
    d = ImageDraw.Draw(im)
    m = bubble_mark(s(36))
    im.alpha_composite(m, (W // 2 - m.width // 2, py + s(44)))
    hf = font('Bold', 66)
    d.text((W // 2, py + s(100)), 'Which assistant', font=hf, fill=TEXT, anchor='ma')
    d.text((W // 2, py + s(178)), 'should you text?', font=hf, fill=TEXT, anchor='ma')
    d.text((W // 2, py + s(272)), 'assistantbenchmark.com', font=font('Bold', 22), fill=BLUE, anchor='ma')
    im.convert('RGB').save(out, optimize=True)


def agent_card(a, out):
    """Logo tile beside the name, the site wordmark below it."""
    im = Image.new('RGBA', (W, H), BG + (255,))
    d = ImageDraw.Draw(im)
    icon = os.path.join(ROOT, 'public', a['icon'].lstrip('/')) if a.get('icon') else None
    size = s(200)
    tile = logo_tile(icon, size) if icon and os.path.exists(icon) else letter_tile(a['name'][0].upper(), size)
    title = a['name']
    tf = font('Bold', 72 if len(title) <= 14 else 56)
    sf = font('Medium', 30)
    block_w = size + s(44) + max(d.textlength(title, font=tf), d.textlength('Assistant Benchmark', font=sf) + s(58))
    x = max(s(80), int((W - block_w) / 2))
    y = (H - size) // 2
    im.alpha_composite(tile, (x, y))
    tx = x + size + s(44)
    th = d.textbbox((0, 0), title, font=tf)[3]
    ty = (H - (th + s(22) + s(40))) // 2 - s(6)
    d.text((tx, ty), title, font=tf, fill=TEXT)
    m = bubble_mark(s(40))
    my = ty + th + s(22)
    im.alpha_composite(m, (tx, my))
    d.text((tx + m.width + s(14), my + m.height / 2), 'Assistant Benchmark', font=sf, fill=SEC, anchor='lm')
    im.convert('RGB').save(out, optimize=True)


def main():
    os.makedirs(OUT, exist_ok=True)
    index = json.load(open(os.path.join(ROOT, 'data', 'index.json')))
    cats = json.load(open(os.path.join(ROOT, 'data', 'categories.json')))
    scored = sum(1 for c in cats if c.get('scored', True))
    # overall per assistant: latest run per category, same rule as src/lib/data.ts
    for a in index['agents']:
        p = os.path.join(ROOT, 'data', 'agents', a['slug'], 'runs.json')
        latest = {}
        if os.path.exists(p):
            for r in json.load(open(p)):
                if isinstance(r.get('score'), (int, float)):
                    latest[r['category']] = r['score']
        a['overall'] = round(sum(latest.values()) / len(latest), 1) if latest else None
    site_card(index, scored, os.path.join(OUT, 'site.png'))
    print('site.png')
    for a in index['agents']:
        agent_card(a, os.path.join(OUT, f"{a['slug']}.png"))
    print(f"{len(index['agents'])} assistant cards -> public/og/")


if __name__ == '__main__':
    main()
