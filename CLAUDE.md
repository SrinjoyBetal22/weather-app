# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

No build step. Must be served (not opened as `file://`) for service worker and PWA to work:

```bash
python -m http.server
# or
npx serve
```

## Architecture

Single-page vanilla JS app — no frameworks, no bundler. Core files:

- `index.html` — semantic markup, all meta/OG/PWA tags, SW registration
- `style.css` — liquid glass design system; all theming via CSS custom properties; `data-theme` on `<html>` switches dark/light
- `script.js` — all app logic in one flat file (no modules)
- `sw.js` — service worker: Cache First for app shell + self-hosted fonts, SWR for Remixicon CDN
- `manifest.json` — PWA manifest
- `fonts/` — self-hosted WOFF2 (Space Grotesk 600–700, DM Sans 400–600)
- `icons/` — SVG source + icon-192.png + icon-512.png

## Data Flow

1. User types city → `getWeather()` calls Open-Meteo Geocoding → lat/lon
2. Lat/lon → Open-Meteo Forecast → current weather + 5-day daily
3. Geolocation → `getWeatherByCoords()` → Nominatim reverse geocoding → same forecast path
4. All three fetch paths call shared helpers: `resetUI()`, `renderWeatherData()`, `showWeatherResult()`, `showError()`
5. `renderWeatherData(current, daily, name, country)` is the single DOM-writing function — update this when adding new fields

## State

All persistence in `localStorage`:
- `theme` — `'dark'` or `'light'`
- `lastCity` — city name string, auto-loaded on page load
- `favorites` — JSON array of `{ name, country, latitude, longitude }`, max 3
- `lastFetched` — ISO timestamp, used for the "Updated HH:MM" indicator and stale refresh nudge (>30 min)

`window.currentCityData` holds `{ name, country, latitude, longitude }` for the active city (favorites flow).

## Key Conventions

- HTML IDs + JS variables: `camelCase`; CSS classes: `kebab-case`
- Weather WMO codes → Remix Icon classes: `weatherIcons` object; descriptions: `weatherCodes` object
- Weather codes → accent colour: `weatherThemeColors` + `getWeatherThemeColor(code)` → `applyWeatherTheme(code)`
- `applyWeatherTheme()` sets `--color-primary` inline on `:root` and directly sets `blob.style.background` (CSS transition animates the blob)
- Date-only strings from Open-Meteo (`"YYYY-MM-DD"`) must be parsed as `new Date(date + 'T12:00:00')` to avoid UTC-midnight timezone offset bugs
- Forecast stagger: `animationDelay = index * 0.05s` paired with `@keyframes fadeUp`
- `countUp(element, target)` — easeOut cubic, always 700ms, handles negatives correctly

## Design System

Documented in `design-system.md`. Key rules:

- **Liquid glass**: `background: var(--glass-specular), var(--color-surface)` + `backdrop-filter: var(--glass-blur)` + multi-layer inset `box-shadow`
- **Nested tiles** (`.detail-item`, `.forecast-card`): no `backdrop-filter` — parent card blur is sufficient
- **`.glass-card`** must have `position: relative` — `.save-city-btn` is `position: absolute` on mobile (<768px)
- **Font weight cap**: Space Grotesk max is 700 — never use `font-weight: 800`
- **Spring easing**: `cubic-bezier(0.34, 1.56, 0.64, 1)` for interactive transforms; easeOut cubic for numeric animations
- **Breakpoints**: `640px` (search/input tweaks), `768px` (layout switch: column → row, forecast grid, save button positioning)
- **`transition` on buttons**: always scope to specific properties — never `transition: all`

## APIs (no keys required)

| Purpose | URL |
|---|---|
| Geocoding | `https://geocoding-api.open-meteo.com/v1/search` |
| Forecast | `https://api.open-meteo.com/v1/forecast` |
| Reverse geocoding | `https://nominatim.openstreetmap.org/reverse` |

Daily params: `weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset`

## PWA / Service Worker

- SW version is controlled by `CACHE_NAME = 'atmos-v1'` — bump this string to invalidate all caches on next deploy
- `APP_SHELL` array must include every static asset the app needs to load offline
- `og-preview.png` is intentionally excluded from `APP_SHELL` — it doesn't exist yet; including a missing URL would abort SW install
- API responses are not cached by the SW — handled at the JS layer via `localStorage` timestamps
