# Atmos Weather

A minimal, fast, and installable weather app with a liquid glass UI. No build tools, no frameworks — just open and go.

## Features

- **City search** — Search any city worldwide; icon-only button on mobile, full label on desktop
- **Geolocation** — "My Location" button fetches weather for your current coordinates
- **Current weather** — Temperature (animated count-up), feels-like, humidity, wind speed
- **5-day forecast** — Daily high/low, weather icon, rain probability; horizontal scroll on mobile, grid on desktop
- **Sunrise / Sunset** — With a live daytime progress track showing where in the day you are
- **Weather condition theming** — Aurora blob and all accent colours shift per condition (sunny → amber, rain → ocean blue, storm → violet, snow → ice, etc.)
- **Favorites** — Save up to 3 cities for one-tap access; persisted in `localStorage`
- **Dark / Light theme** — Toggle via navbar; preference persisted across sessions
- **Last updated indicator** — Shows fetch time; prompts refresh if data is >30 min old
- **PWA** — Installable on iOS and Android; app shell and fonts cached for offline use

## Tech Stack

- **HTML5 / CSS3 / Vanilla JS** — No framework, no bundler
- **[Open-Meteo API](https://open-meteo.com/)** — Free weather + geocoding (no API key)
- **[Nominatim](https://nominatim.openstreetmap.org/)** — Free reverse geocoding for geolocation (no API key)
- **[Remix Icons](https://remixicon.com/)** — `remixicon@4.2.0` via CDN, pre-cached by service worker
- **Fonts** — [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (headings) + [DM Sans](https://fonts.google.com/specimen/DM+Sans) (body), self-hosted WOFF2

## Getting Started

No installation required. Serve locally for full PWA support (service workers require a server, not `file://`):

```bash
python -m http.server
# or
npx serve
```

Then open `http://localhost:8000`.

## Usage

1. Type a city and press Enter, or click the search button
2. Or click **My Location** to fetch weather for your coordinates
3. View current conditions, 5-day forecast, and sunrise/sunset
4. Click the bookmark icon to save a city to favorites (max 3)
5. Click a favorite chip to instantly load that city
6. Toggle dark/light mode with the sun/moon button in the header

## Project Structure

```
.
├── index.html          # Markup, meta tags, PWA links
├── style.css           # Liquid glass design system, all component styles
├── script.js           # All app logic: search, weather, favorites, theme, PWA helpers
├── sw.js               # Service worker — app shell Cache First, Remixicon SWR
├── manifest.json       # PWA manifest
├── fonts/              # Self-hosted WOFF2 (Space Grotesk, DM Sans)
├── icons/              # SVG + PNG app icons (192, 512)
├── og-preview.png      # Static OG image for link previews (add manually)
├── design-system.md    # Design token reference and component rules
└── README.md
```

## APIs

All free, no registration required:

| Purpose | Endpoint |
|---|---|
| City → coordinates | `https://geocoding-api.open-meteo.com/v1/search` |
| Weather forecast | `https://api.open-meteo.com/v1/forecast` |
| Coordinates → city name | `https://nominatim.openstreetmap.org/reverse` |

**Daily params fetched:** `weather_code`, `temperature_2m_max/min`, `precipitation_probability_max`, `sunrise`, `sunset`

## OG Preview Image

Drop a `1200×630` screenshot of the app (dark mode, with weather loaded) as `og-preview.png` in the project root. This completes the link preview for iMessage, Slack, Twitter, etc.

## Browser Support

All modern browsers (Chrome, Firefox, Safari, Edge). PWA install requires HTTPS or localhost. `backdrop-filter` is required for the glass effect — supported in all modern browsers.
