# Atmos Design System — Liquid Glass Edition
*Apple-inspired liquid glass materiality. Translucent surfaces, specular highlights, atmospheric depth.*

---

## 1. Core Principles

- **Liquid Glass** — Components simulate physical glass: specular gradient, refraction via `backdrop-filter saturate()`, layered depth via `box-shadow`.
- **Atmosphere First** — A single aurora blob provides chromatic background that glass refracts. The blob is the source of color; surfaces are neutral.
- **Bento Layout** — Modular glass tiles for every information block. No mixed-purpose sections.
- **Spring Motion** — All interactive transforms use spring physics easing.
- **Accessibility** — Text contrast maintained against glass surfaces across both themes.

---

## 2. Typography

| Role | Font | Weights |
|------|------|---------|
| Display / Headings | Space Grotesk | 600, 700 |
| UI / Body | DM Sans | 400, 500, 600 |

Loaded via Google Fonts CDN. `font-family` explicitly set on inputs and buttons — never rely on browser default.

### Fluid Type Scale (`clamp()`)

| Token | Value | Usage |
|-------|-------|-------|
| `--h1` | `clamp(2rem, 8vw, 3.5rem)` | Page headings |
| `--h2` | `clamp(1.5rem, 6vw, 2rem)` | City name |
| `--h3` | `clamp(1.25rem, 4vw, 1.5rem)` | Section titles |
| `--text-base` | `clamp(1rem, 1.2vw, 1.125rem)` | Body copy |
| `--text-sm` | `clamp(0.875rem, 1vw, 1rem)` | Secondary UI |
| Main temp | `clamp(3.5rem, 12vw, 5.5rem)` | Hero temperature |

---

## 3. Color Palette

### Dark Mode — Obsidian

| Token | Value | Role |
|-------|-------|------|
| `--color-bg` | `#08080F` | Near-black navy — gives glass contrast |
| `--color-surface` | `rgba(255,255,255,0.07)` | Primary glass fill |
| `--color-surface-secondary` | `rgba(255,255,255,0.04)` | Nested tile fill |
| `--color-border` | `rgba(255,255,255,0.12)` | Glass edge |
| `--color-primary` | `#60A5FA` | Sky blue — CTAs, icons |
| `--color-text-primary` | `#F1F5F9` | Main text |
| `--color-text-secondary` | `#94A3B8` | Labels, metadata |

### Light Mode — Pearl

| Token | Value | Role |
|-------|-------|------|
| `--color-bg` | `#EEF2F8` | Soft blue-grey — essential glass contrast |
| `--color-surface` | `rgba(255,255,255,0.68)` | Primary glass fill |
| `--color-surface-secondary` | `rgba(255,255,255,0.48)` | Nested tile fill |
| `--color-border` | `rgba(255,255,255,0.88)` | Glass edge — near-white specular |
| `--color-primary` | `#3B82F6` | Indigo blue |
| `--color-text-primary` | `#1E293B` | Main text |
| `--color-text-secondary` | `#64748B` | Labels, metadata |

> **Why `--color-bg` is not white in light mode**: CSS glass requires a distinctly tinted background to read as glass. Near-white on near-white is invisible. The aurora blob + `#EEF2F8` base provides the chromatic atmosphere that glass refracts.

---

## 4. Liquid Glass System

### The Three Layers

Every glass surface is built from three stacked effects:

1. **Specular gradient** (`--glass-specular`) — `linear-gradient(135deg, ...)` from bright white at top-left to transparent. Simulates light hitting a glass surface at an angle. Applied as the *top* `background` layer.
2. **Base fill** (`--color-surface`) — Translucent material color. Applied as the *bottom* `background` layer behind the specular.
3. **Depth shadows** (`--shadow-card` / `--shadow-tile`) — Multi-layer `box-shadow` with inset top highlight (glass thickness) + outer drop shadow.

### Glass Tokens

| Token | Dark | Light |
|-------|------|-------|
| `--glass-blur` | `blur(48px) saturate(180%)` | `blur(32px) saturate(150%)` |
| `--glass-specular` | `linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 45%, transparent 70%)` | `linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.2) 45%, transparent 70%)` |
| `--shadow-card` | `inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.15), 0 8px 40px rgba(0,0,0,0.55), 0 2px 12px rgba(0,0,0,0.3)` | `inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.05)` |
| `--shadow-tile` | `inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 8px rgba(0,0,0,0.25)` | `inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 6px rgba(0,0,0,0.05)` |

### `.glass-card` Rule

```css
position: relative; /* required for absolute-positioned children (save button on mobile) */
background: var(--glass-specular), var(--color-surface);
backdrop-filter: var(--glass-blur);
border: 1px solid var(--color-border);
box-shadow: var(--shadow-card);
border-radius: var(--radius-2xl);
```

The multi-value `background` shorthand stacks specular on top of the fill — no pseudo-elements needed.

### Nested Tiles (`.detail-item`, `.forecast-card`)

Tiles live inside a glass card, so **no `backdrop-filter`** — nested filters are expensive and compound the blur unnecessarily. They use `--color-surface-secondary` fill + `--shadow-tile` for depth. The parent card's blur provides sufficient atmosphere.

---

## 5. Components

### Buttons

- All buttons: `font-family: var(--font-body)` — always explicit.
- **Primary** (`.btn-primary`): Solid `--color-primary` fill, white text, inset glass sheen. Hover: `filter: brightness(1.08)`.
- **Ghost** (`.btn-ghost`): Glass surface with `backdrop-filter: blur(16px)` + border. Used for theme toggle.
- **Active state**: `scale(0.95)` on all buttons.
- `transition` is scoped to `filter, transform, background, border-color` — never `transition: all`.

### Input

- Glass background with `backdrop-filter: blur(24px) saturate(160%)`
- Inset shadow for subtle inner depth
- Focus: `border-color: var(--color-primary)` + `scale(1.01)` on desktop
- Mobile (<640px): focus `transform: none` to avoid layout shift when keyboard opens
- Light mode: `background: rgba(255,255,255,0.7)` for stronger contrast

### Search Box Layout

- Always a single row (flex) — input takes remaining space, button is fixed-width
- Desktop: pill button with icon + "Search" label
- Mobile (<640px): circular icon-only button (`3rem × 3rem`), label hidden via `.search-btn-label { display: none }`

### Save Button (`.save-city-btn`)

- `2.25rem` square, `--radius-xl`, bookmark icon (`ri-bookmark-line`)
- Ghost glass by default, fills with `--color-primary` on hover
- **Mobile**: `position: absolute; top: var(--space-5); right: var(--space-5)` — floats to top-right corner of the glass card
- **Desktop**: `position: static` (default flow, inside `.weather-info-top`)
- Requires `.glass-card` to have `position: relative`

### Favorite Chips (`.fav-btn`)

- Pill shape (`--radius-pill`), `--color-surface-secondary` fill
- Hover fills with `--color-primary`, text turns white
- Contains city name span + `ri-close-line` remove icon; close button stops click propagation

### Loader

- Three dots, `scale(0) → scale(1)` pulse with opacity fade
- Delays: `-0.32s`, `-0.16s`, `0s`

### Error State

- `rgba(248,113,113,0.1)` background + `rgba(248,113,113,0.2)` border
- Text: `#f87171`; `backdrop-filter: blur(12px)` for glass consistency

---

## 6. Aurora Background

- Single `.aurora-blob`, `70vw × 70vw`, `filter: blur(140px)`, `opacity: 0.12`, `mix-blend-mode: screen`
- Color: `--color-primary`, positioned top-right
- CSS `drift` keyframe (25s, linear infinite) for ambient motion
- JS `mousemove` adds parallax offset via `transform: translate()`
- The blob's saturation shows through glass surfaces via `saturate()` in `--glass-blur`

---

## 7. Spacing & Radius Tokens

| Token | Value |
|-------|-------|
| `--space-1` | `0.25rem` |
| `--space-2` | `0.5rem` |
| `--space-3` | `0.75rem` |
| `--space-4` | `clamp(0.75rem, 2vw, 1rem)` |
| `--space-5` | `1.25rem` |
| `--space-6` | `clamp(1rem, 3vw, 1.5rem)` |
| `--space-8` | `clamp(1.5rem, 4vw, 2rem)` |
| `--space-12` | `3rem` |
| `--radius-pill` | `9999px` |
| `--radius-xl` | `1rem` |
| `--radius-2xl` | `1.5rem` |

---

## 8. Motion

- **Spring easing**: `cubic-bezier(0.34, 1.56, 0.64, 1)` — all interactive transforms
- **Forecast stagger**: `animationDelay = index * 0.05s` applied in `script.js`; paired with `@keyframes fadeUp` (`opacity: 0, translateY(10px)` → natural)
- **Theme transition**: `background-color 0.5s ease` on `body`
- No hover transforms on forecast cards — they are informational tiles, not interactive targets

---

## 9. Responsive Breakpoints

| Breakpoint | Behaviour |
|------------|-----------|
| `< 640px` | Search button icon-only circular; input focus no scale; detail tile compact padding; save button absolute in card corner |
| `640px+` | Full detail tile padding restored |
| `768px+` | Weather main switches to row layout; weather icon full size (`7rem`); forecast switches from horizontal scroll to 5-column grid; save button returns to flow |

### Forecast Scroll Hint (mobile only)

On `< 768px`, `.forecast-list` applies:
```css
mask-image: linear-gradient(to right, black calc(100% - 3rem), transparent 100%);
```
This fades the last card to hint that more cards are scrollable. Cleared at `768px+`.

---

## 10. Implementation Notes

- Icons: **Remix Icons** via CDN (`remixicon@4.2.0`) — `ri-*` class names
- Weather codes (WMO) mapped to Remix Icon classes in `weatherIcons` object (`script.js`); descriptions in `weatherCodes`
- All state in `localStorage`: `theme`, `lastCity`, `favorites` (JSON array, max 3)
- `window.currentCityData` holds `{ name, country, latitude, longitude }` for the active city (favorites flow)
- Font weight cap: Space Grotesk max is 700 — use 600/700 only, not 800
