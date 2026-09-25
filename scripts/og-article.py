"""Render a 1200x630 share card per article into public/og/articles/<slug>.png.
The card is the article's hero: a real `hero:` image if the frontmatter names one, otherwise the
same composition the page draws, the assistants named in `agents:` as logo tiles on a tint."""
import os, re, sys
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 1200, 630
DEFAULT_TINT = (238, 241, 245)

def frontmatter(path):
    raw = open(path, encoding='utf8').read()
    m = re.match(r'^---\n([\s\S]*?)\n---', raw); meta = {}
    if m:
        for line in m.group(1).split('\n'):
            if ':' in line: k, v = line.split(':', 1); meta[k.strip()] = v.strip().strip('"')
    return meta

def hex_rgb(s):
    s = s.lstrip('#'); return tuple(int(s[i:i+2], 16) for i in (0, 2, 4)) if len(s) == 6 else DEFAULT_TINT

def tile(slug, size):
    """Logo on a rounded white tile with a soft shadow, like .row-icon on the page."""
    path = os.path.join(ROOT, 'public', 'logos', f'{slug}.png')
    face = Image.new('RGBA', (size, size), (255, 255, 255, 255))
    if os.path.exists(path):
        logo = Image.open(path).convert('RGBA').resize((size, size), Image.LANCZOS); face.alpha_composite(logo)
    mask = Image.new('L', (size, size), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, size - 1, size - 1), radius=int(size * 0.24), fill=255)
    face.putalpha(mask)
    pad = int(size * 0.35); canvas = Image.new('RGBA', (size + pad * 2, size + pad * 2), (0, 0, 0, 0))
    shadow = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((pad, pad + int(size * 0.12), pad + size, pad + size + int(size * 0.12)), radius=int(size * 0.24), fill=(0, 0, 0, 60))
    shadow = shadow.filter(ImageFilter.GaussianBlur(int(size * 0.14)))
    canvas.alpha_composite(shadow); canvas.alpha_composite(face, (pad, pad))
    return canvas

def cover_fit(img):
    r = max(W / img.width, H / img.height); img = img.resize((int(img.width * r), int(img.height * r)), Image.LANCZOS)
    x, y = (img.width - W) // 2, (img.height - H) // 2
    return img.crop((x, y, x + W, y + H))

def render(md_path):
    meta = frontmatter(md_path); slug = os.path.basename(md_path)[:-3]
    out = os.path.join(ROOT, 'public', 'og', 'articles', f'{slug}.png'); os.makedirs(os.path.dirname(out), exist_ok=True)
    hero = meta.get('hero')
    if hero:
        p = os.path.join(ROOT, 'public', hero.lstrip('/'))
        if os.path.exists(p):
            cover_fit(Image.open(p).convert('RGB')).save(out, optimize=True); print(out); return
    tint = hex_rgb(meta.get('cover_tint', '')) if meta.get('cover_tint') else DEFAULT_TINT
    im = Image.new('RGBA', (W, H), tint + (255,))
    # soft gradient to white toward the bottom right, like the page
    grad = Image.linear_gradient('L').resize((W, H)); white = Image.new('RGBA', (W, H), (255, 255, 255, 255))
    im = Image.composite(white, im, grad.point(lambda v: int(v * 0.28)))
    cx, cy = W // 2, H // 2
    rings = Image.new('RGBA', (W, H), (0, 0, 0, 0)); rd = ImageDraw.Draw(rings)
    for rw, alpha in ((int(W * 0.44), 18), (int(W * 0.66), 12)):
        rd.ellipse((cx - rw, cy - rw, cx + rw, cy + rw), outline=(0, 0, 0, alpha), width=2)
    im.alpha_composite(rings)
    agents = [a.strip() for a in meta.get('agents', '').split(',') if a.strip()]
    if agents:
        lead, small = 230, 180; gap = 44
        sizes = [lead] + [small] * (len(agents) - 1)
        total = sum(sizes) + gap * (len(agents) - 1); x = cx - total // 2
        for s, size in zip(agents, sizes):
            t = tile(s, size); pad = (t.width - size) // 2
            im.alpha_composite(t, (x - pad, cy - size // 2 - pad)); x += size + gap
    im.convert('RGB').save(out, optimize=True); print(out)

if __name__ == '__main__':
    paths = sys.argv[1:] or [os.path.join(ROOT, 'data', 'articles', f) for f in os.listdir(os.path.join(ROOT, 'data', 'articles')) if f.endswith('.md')]
    for p in paths: render(p)
