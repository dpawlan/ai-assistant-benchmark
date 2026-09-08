# AI Assistant Benchmark — Design System

Visual language inspired by Apple/iMessage calm aesthetic, applied to a Wirecutter/RTINGS-style public scorecard for AI personal assistants.

## Design Philosophy

This is **NOT** an agent marketplace or App Store clone. It's an independent comparison scorecard with:
- Home leaderboard with filters
- Agent profiles with 14-category score matrix + curated quote feed
- Categories page explaining evaluation criteria
- Request a test form

**What we borrow from iMessage.store aesthetic:**
- Calm Apple surface language
- Clean white backgrounds with subtle surface variations
- Pill-shaped chips and rounded elements
- List-based layouts over cramped grids
- Squircle avatars and thin separators
- Mobile-first white space

**What we explicitly avoid:**
- Hearts, ranking/heart marketplace elements
- "Text" CTAs or messaging-app interactions
- Photo-led featured billboards
- Dense 3-column category shelves
- Marketplace IA patterns
- Gradient blobs, glass effects, purple AI gradients, neon, mesh backgrounds
- Generic shadcn dashboard chrome
- Horizontal-clipped carousels on mobile

---

## Color Tokens

```css
/* Light mode */
--color-bg: #ffffff;           /* Page background */
--color-surface: #fbfbfd;      /* Elevated surface / cards */
--color-text: #1d1d1f;         /* Primary text */
--color-text-secondary: #86868b; /* Secondary / muted text */
--color-accent: #0a84ff;       /* Primary accent (links, CTAs) */
--color-accent-tint: #e8f2ff;  /* Soft accent background tint */
--color-divider: #e5e5ea;      /* Borders and separators */
--color-bubble-gray: #e9e9eb;  /* iMessage received bubble */

/* Status colors - quiet, not loud */
--color-confirmed: #248a3d;    /* Confirmed status text */
--color-confirmed-bg: rgba(52, 199, 89, 0.12);
--color-stretch: #bf5600;      /* Stretch status text */
--color-stretch-bg: rgba(255, 149, 0, 0.12);

/* Score colors */
--color-score-high: #248a3d;   /* Scores 8-10 */
--color-score-mid: #0a84ff;    /* Scores 6-7 */
--color-score-low: #bf5600;    /* Scores 4-5 */
--color-score-poor: #d70015;   /* Scores 1-3 */

/* Dark mode (optional iOS dark) */
--color-bg-dark: #000000;
--color-surface-dark: #1c1c1e;
--color-text-dark: #f5f5f7;
--color-text-secondary-dark: #98989d;
--color-accent-dark: #0a84ff;
--color-divider-dark: #38383a;
--color-bubble-gray-dark: #3a3a3c;
```

---

## Typography

**Font stack (system UI):**
```css
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 
             "SF Pro Text", "Segoe UI", sans-serif;
```

**Type scale (mobile-first):**
| Token | Size | Weight | Use |
|-------|------|--------|-----|
| `display` | 28px | 700 | Page titles |
| `title` | 22px | 700 | Section titles |
| `heading` | 18px | 600 | Card headings |
| `body` | 15px | 400 | Body text |
| `body-semibold` | 15px | 600 | Agent names, labels |
| `caption` | 13px | 400 | Blurbs, metadata |
| `micro` | 11px | 500 | Badges, tags |

---

## Spacing Scale (4/8pt grid)

All spacing follows a strict 4/8pt scale:
```
4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px
```

Use Tailwind utilities: `p-1` (4px), `p-2` (8px), `p-3` (12px), `p-4` (16px), etc.

---

## Border Radius

| Element | Radius |
|---------|--------|
| Pills / chips | `9999px` (full) |
| Cards | `16px` or `20px` |
| Avatars (squircle) | `12px` |
| Feedback bubbles | `18px` |
| Input fields | `12px` |
| Small badges | `6px` |

---

## Shadows

Minimal shadows — almost no shadows for that flat Apple feel:
```css
--shadow-card: 0 1px 3px rgba(0, 0, 0, 0.04);
--shadow-none: none;
```

Use thin 1px borders instead of shadows for definition.

---

## Touch Targets

All interactive elements must be at least **44×44px** touch target area.

---

## Component Specifications

### Header
- Sticky, compact height (56px mobile, 64px desktop)
- Logo + "AI Benchmark" wordmark
- Nav: Home / Categories / Request a Test
- Mobile: hamburger menu OR all nav visible if space allows
- Background: `--color-bg` with subtle blur on scroll

### Agent Card (List Row Style)
- Full-width tappable row
- Left: squircle icon/initial (48px), name + status badge + site
- Right: feedback count or "Unscored" chip
- Thin bottom border, not card shadow
- Hover: subtle background tint

### Filter Bar
- Full-width search input (rounded, gray background)
- Pill chips for status filter (All / Confirmed / Stretch)
- Chips wrap on mobile, never clip
- Sort dropdown or segmented control

### Score Matrix
- Two-column grid on desktop, single column on mobile
- Each row: category label + score cell
- Score cell: pill with number, color-coded
- `null` → "Not tested" (dashed border, muted text)
- `n/a` → "N/A" (gray pill)
- No fake scores or animated bars

### Feedback Bubbles (iMessage style)
- Gray received-bubble background (`--color-bubble-gray`)
- Border-radius: 18px
- Padding: 12px 16px
- Quote text in regular body size
- Below bubble: author handle + source link (subtle)

### Status Badges
- Pill shape (full radius)
- Confirmed: green tint background + green text
- Stretch: orange tint background + orange text
- Quiet, not attention-grabbing

### Request Form
- Large input fields (48px height, 16px padding)
- Native-feeling with subtle gray backgrounds
- Category chips for multi-select
- Full-width submit button (pill shape)

---

## Mobile Acceptance Criteria

At 390×844 viewport:
1. No horizontal scroll
2. Full-width search input
3. Entire agent row/card is tappable
4. Score matrix and feedback bubbles are readable
5. Form inputs have large touch targets
6. Filter chips wrap naturally
7. Header shows logo + nav (hamburger if needed)

---

## Design Prompt (Original Brief)

> Visual redesign with imessage.store *aesthetic* (not IA) + true mobile-first.
>
> Product: Wirecutter/RTINGS-style public scorecard for AI personal assistants.
> Keep pages: Home leaderboard (filters), Agent profile (14-cat score matrix + curated quote feed), Categories, Request a test.
> NOT an agent marketplace / App Store clone.
>
> Aesthetic to borrow: Calm Apple / iMessage surface language with specified colors, typography, shapes, and layouts.
>
> Anti–vibe-coded rules:
> 1. One type scale + 4/8pt spacing — no random sizes
> 2. No gradient blobs, glass stacks, purple AI gradients, neon, mesh backgrounds
> 3. No generic shadcn dashboard chrome
> 4. No horizontal-clipped carousels on mobile
> 5. Touch targets ≥44×44px; filter chips wrap
> 6. Sticky compact mobile header
> 7. Feedback quotes as iMessage received bubbles
> 8. Score matrix: null → "Not tested"; n/a → "N/A"
> 9. Badges: Confirmed / Stretch pills, quiet
> 10. Optional dark mode only if true iOS dark
>
> Success = "Apple/iMessage calm" at first glance, not "AI slop landing page"
