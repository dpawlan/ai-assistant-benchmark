#!/usr/bin/env python3
"""Render share images into public/og/: site.png plus one per assistant.

Drawn at 2x (2400x1260) so they stay crisp on the phone screens X and iMessage show them on;
layout.tsx declares the same size. Fonts are the Inter files in src/assets/fonts.
Run after adding assistants or logos:  python3 scripts/og.py"""
import json, os
from PIL import Image, ImageDraw, ImageFont

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
    """Headline with the question in blue, the line under it, and a strip of assistant logos in rank order."""
    im = Image.new('RGBA', (W, H), BG + (255,))
    d = ImageDraw.Draw(im)
    wordmark(im, 72, 64)
    hf = font('Bold', 88)
    d.text((s(72), s(150)), 'Which assistant', font=hf, fill=TEXT)
    d.text((s(72), s(248)), 'should you', font=hf, fill=TEXT)
    d.text((s(72) + d.textlength('should you ', font=hf), s(248)), 'text?', font=hf, fill=BLUE)
    tested = sum(1 for a in index['agents'] if a.get('overall') is not None)
    line = f"{tested} of {index['agent_count']} assistants tested on the same {scored} tasks, scored 1 to 10 after real use."
    d.text((s(72), s(378)), line, font=font('Medium', 24), fill=SEC)
    # logo strip: tested assistants in rank order, then the rest, as many as fit
    ranked = sorted((a for a in index['agents'] if a.get('overall') is not None), key=lambda a: -a['overall'])
    rest = [a for a in index['agents'] if a.get('overall') is None and a.get('icon')]
    size, gap, x, y = s(72), s(16), s(72), s(460)
    for a in ranked + rest:
        if x + size > W - s(72):
            break
        icon = os.path.join(ROOT, 'public', a['icon'].lstrip('/')) if a.get('icon') else None
        tile = logo_tile(icon, size) if icon and os.path.exists(icon) else letter_tile(a['name'][0].upper(), size)
        im.alpha_composite(tile, (x, y))
        x += size + gap
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
