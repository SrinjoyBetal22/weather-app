# Weather App

A minimal, fast, and responsive weather application built with vanilla HTML, CSS, and JavaScript. No build tools, no frameworks — just open and go.

## Features

- **City Search** — Search any city worldwide using the Open-Meteo Geocoding API
- **Current Weather** — Temperature, feels-like, humidity, and wind speed
- **5-Day Forecast** — Daily high/low temperatures with weather icons
- **Favorites** — Save up to 3 favorite cities for quick access
- **Dark/Light Theme** — Toggle between themes, persisted in `localStorage`
- **Auto-Load** — Remembers your last searched city on reload
- **Parallax Aurora Background** — Subtle mouse-tracking blob animation
- **Responsive Design** — Works on mobile and desktop

## Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom properties for theming, CSS Grid/Flexbox for layout
- **Vanilla JavaScript** — No frameworks or build tools
- **[Open-Meteo API](https://open-meteo.com/)** — Free weather and geocoding data (no API key required)
- **[Lucide Icons](https://lucide.dev/)** — Icon library via CDN
- **Fonts** — [Exo](https://fonts.google.com/specimen/Exo) and [Roboto Mono](https://fonts.google.com/specimen/Roboto+Mono) via Google Fonts

## Getting Started

No installation or build step required.

### Option 1: Open Directly
Double-click `index.html` to open it in your browser.

### Option 2: Local Server (Recommended)
Using Python:
```bash
python -m http.server
```

Using Node.js:
```bash
npx serve
```

Using VS Code:
- Install the **Live Server** extension
- Right-click `index.html` → "Open with Live Server"

## Usage

1. Type a city name in the search box
2. Press Enter or click the search button
3. View current weather and 5-day forecast
4. Click "Save" to add a city to favorites (max 3)
5. Click a favorite chip to quickly switch cities
6. Toggle dark/light mode with the sun/moon button in the navbar

## Project Structure

```
.
├── index.html      # Main HTML structure
├── style.css       # Styles with dark/light theme support
├── script.js       # App logic (search, weather, favorites, theme)
└── README.md       # This file
```

## API

Uses **Open-Meteo** (free, no registration required):
- **Geocoding API** — `https://geocoding-api.open-meteo.com/v1/search` — City name to coordinates
- **Forecast API** — `https://api.open-meteo.com/v1/forecast` — Weather data and 5-day forecast

## Code Conventions

- **HTML IDs / JS Variables** — `camelCase`
- **CSS Classes** — `kebab-case`
- **Theming** — Dual-theme via `data-theme` attribute on `<html>` + `localStorage`
- **Weather Icons** — Mapped via WMO weather codes to Lucide icon names in `script.js`

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). Requires `fetch` API support.
