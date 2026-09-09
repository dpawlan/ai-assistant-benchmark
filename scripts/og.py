#!/usr/bin/env python3
"""Render share images (1200x630) into public/og/: site.png plus one per assistant.

Run after adding assistants or logos:  python3 scripts/og.py
Needs Pillow and the Inter font (falls back to DejaVu Sans)."""
import json, os, glob
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'og')
W, H = 1200, 630
BLUE = (10, 132, 255)
TEXT = (29, 29, 31)
SEC = (110, 110, 115)
BG = (255, 255, 255)


def font(weight, size):
    for path in [
        f'/usr/share/fonts/truetype/macos/Inter-{weight}.ttf',
        f'/usr/share/fonts/truetype/inter/Inter-{weight}.ttf',
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if weight == 'Bold' else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    ]:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def rounded(size, radius, color):
    im = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(im).rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=color)
    return im


def bubble_mark(size):
    """The sidebar mark: blue rounded square with a white speech bubble."""
    im = rounded(size, int(size * 0.22), BLUE)
    d = ImageDraw.Draw(im)
    s = size / 64
    # bubble body
    d.ellipse([8 * s, 14 * s, 56 * s, 53 * s], fill=BG)
    # tail
    d.polygon([(16 * s, 44 * s), (11 * s, 57 * s), (27 * s, 50 * s)], fill=BG)
    return im


def logo_tile(path, size):
    """Assistant logo on a white rounded tile with a hairline, like the row icon."""
    tile = rounded(size, int(size * 0.23), (255, 255, 255, 255))
    d = ImageDraw.Draw(tile)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * 0.23), outline=(0, 0, 0, 24), width=2)
    logo = Image.open(path).convert('RGBA')
    logo.thumbnail((size, size))
    mask = rounded(size, int(size * 0.23), (255, 255, 255, 255)).getchannel('A')
    canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    canvas.paste(logo, ((size - logo.width) // 2, (size - logo.height) // 2), logo)
    canvas.putalpha(Image.composite(canvas.getchannel('A'), Image.new('L', (size, size), 0), mask))
    tile.alpha_composite(canvas)
    return tile


def letter_tile(letter, size):
    tile = rounded(size, int(size * 0.23), (245, 245, 247, 255))
    d = ImageDraw.Draw(tile)
    f = font('Bold', int(size * 0.46))
    bb = d.textbbox((0, 0), letter, font=f)
    d.text(((size - (bb[2] - bb[0])) / 2 - bb[0], (size - (bb[3] - bb[1])) / 2 - bb[1]), letter, font=f, fill=SEC)
    return tile


def card(mark, title, subtitle, out, title_size=72):
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    size = mark.width
    total_w = size + 44 + max(d.textlength(title, font=font('Bold', title_size)), d.textlength(subtitle, font=font('Medium', 32)))
    x = max(80, int((W - total_w) / 2))
    y = (H - size) // 2
    im.paste(mark, (x, y), mark)
    tx = x + size + 44
    tf = font('Bold', title_size)
    sf = font('Medium', 32)
    th = d.textbbox((0, 0), title, font=tf)[3]
    sh = d.textbbox((0, 0), subtitle, font=sf)[3]
    block = th + 18 + sh
    ty = (H - block) // 2 - 6
    d.text((tx, ty), title, font=tf, fill=TEXT)
    d.text((tx, ty + th + 18), subtitle, font=sf, fill=SEC)
    # footer wordmark on assistant cards
    im.save(out, optimize=True)


def main():
    os.makedirs(OUT, exist_ok=True)
    index = json.load(open(os.path.join(ROOT, 'data', 'index.json')))
    cats = json.load(open(os.path.join(ROOT, 'data', 'categories.json')))
    scored = sum(1 for c in cats if c.get('scored', True))
    card(bubble_mark(200), 'Assistant Benchmark', f"{index['agent_count']} assistants, {scored} tests, one scale.", os.path.join(OUT, 'site.png'))
    print('site.png')
    for a in index['agents']:
        icon = os.path.join(ROOT, 'public', a['icon'].lstrip('/')) if a.get('icon') else None
        mark = logo_tile(icon, 200) if icon and os.path.exists(icon) else letter_tile(a['name'][0].upper(), 200)
        title = a['name']
        size = 72 if len(title) <= 14 else 56
        card(mark, title, 'Assistant Benchmark', os.path.join(OUT, f"{a['slug']}.png"), title_size=size)
    print(f"{len(index['agents'])} assistant cards -> public/og/")


if __name__ == '__main__':
    main()
