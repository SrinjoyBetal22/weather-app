# Nebula Design System (2026 GenZ Edition)
*High-energy, modular, and translucent UI for the next generation of weather tracking.*

---

## 1. Core Principles
- **Vibe Over Data**: Information is structured but feels immersive and atmospheric.
- **Glassmorphism**: Depth through translucency and massive backdrop blurs.
- **Bento Grids**: Modular, distinct "tiles" for every piece of information.
- **Spring Motion**: Satisfying, organic micro-interactions with spring physics.
- **Accessibility**: High-contrast neons that meet WCAG 2.1 AA on deep backgrounds.

---

## 2. Typography System
### Font Pairings
| Role | Font | Weights | Fallback |
|------|------|---------|----------|
| Display/Headings | Plus Jakarta Sans | 700, 800 | sans-serif |
| UI/Body | Outfit | 400, 500, 600 | sans-serif |

### Type Scale
| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| xs | 0.75rem | 1.4 | 500 | Labels, captions |
| sm | 0.875rem | 1.4 | 500 | Secondary UI |
| base | 1rem | 1.5 | 400 | Body copy |
| lg | 1.25rem | 1.3 | 600 | Tile headings |
| xl | 1.5rem | 1.2 | 700 | Card titles |
| 2xl | 2rem | 1.1 | 800 | Hero titles |
| display| 5rem | 1.0 | 800 | Temperature hero |

---

## 3. Nebula Color Palette
### Dark Mode (Obsidian Nebula)
| Role | Hex | Glow/Effect |
|------|-----|-------------|
| Background | #050505 | Deep obsidian |
| Surface | rgba(20, 20, 25, 0.6) | Frosted obsidian |
| Primary | #00F0FF | Cyan Neon |
| Secondary | #FF00E5 | Magenta Neon |
| Accent | #7000FF | Electric Violet |
| Text Primary | #FFFFFF | - |
| Text Secondary| rgba(255, 255, 255, 0.6) | - |

### Light Mode (Cyber Pearl)
| Role | Hex | Effect |
|------|-----|--------|
| Background | #F5F7FF | Pearl white |
| Surface | rgba(255, 255, 255, 0.7) | Frosted glass |
| Primary | #6366F1 | Indigo Violet |
| Secondary | #10B981 | Mint Green |
| Accent | #F59E0B | Amber Glow |
| Text Primary | #0F172A | - |
| Text Secondary| #64748B | - |

---

## 4. Components & Bento Rules
### Bento Tiles
- **Radius**: `var(--radius-2xl)` (1.5rem)
- **Border**: `1px solid rgba(255,255,255,0.1)` (Dark) or `1px solid rgba(0,0,0,0.05)` (Light)
- **Blur**: `backdrop-filter: blur(20px)`
- **Hover**: Static containers. No movement.

### Pill UI (Buttons/Inputs)
- **Shape**: Fully rounded (`border-radius: 9999px`)
- **Interaction**: Subtle opacity change, spring scale on press.
- **Palette**: Monochrome-accented (no gradients). High-contrast solid fills.

### Favorite Chips
- **Contrast**: Explicit high-contrast background (e.g., `#2D2D3D` in Dark Mode) to ensure readability.

---

## 5. Motion & Physics
- **Standard Transition**: `300ms cubic-bezier(0.34, 1.56, 0.64, 1)` (Spring)
- **Stagger**: Tiles should reveal with a `20ms` increment.
- **Float**: Hero icons have a subtle `2s` infinite floating animation.

---

## 6. Implementation
All tokens defined in `style.css` as `--nebula-*` variables.
- `index.html` structure must prioritize `.bento-tile` layouts.
- `script.js` must handle staggered entry for search results.
