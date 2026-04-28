# Atmos — Roadmap

Features are grouped by effort tier. Tier 1 items share the existing data pipeline and require no architectural changes. Tier 2 items need minor new API params or UI patterns. Tier 3 items require planning before implementation.

---

## Tier 1 — Under an hour each

### °C / °F Toggle
Add `temperature_unit=fahrenheit` to Open-Meteo API params. One button in the weather card, one `localStorage` key (`unit`). All temperature display points (main temp, high/low, feels like, forecast) read from the stored preference on fetch.

### Web Share
`navigator.share({ title: 'Atmos', text: \`${city}: ${temp}\`, url: location.href })` on a share button in the weather card. Falls back gracefully where the API is unavailable. Makes the OG tags useful — users can share a city's current conditions in one tap.

### Keyboard Shortcut
`/` or `Cmd+K` focuses the search input. `Escape` blurs it. Zero visual change, adds a native app feel for desktop users.

### Offline Banner
Listen to `window.addEventListener('online'/'offline')`. Show a subtle fixed strip at the top of the page when offline: *"You're offline — showing cached data."* Dismiss automatically when connection returns. The SW already handles caching; the UI just needs to communicate the state.

### Severe Weather Warning
Inline banner inside the weather card for high-impact WMO codes (65 heavy rain, 75/82 violent showers, 95–99 thunderstorm). Example: *"⚠ Heavy rain expected."* Data already in hand from the existing weather fetch — just a code-range check.

### Wind Direction
Add `wind_direction_10m` to the current weather API params. Convert degrees to a cardinal direction (N, NE, E, etc.) and display next to the existing wind speed tile as `↗ 18 km/h`.

---

## Tier 2 — A few hours each

### Search History Dropdown
Expand `lastCity` (currently a single string) into a `searchHistory` array capped at 5 entries. On input focus, show a glass dropdown below the field with recent cities. Clicking one populates the input and fires `getWeather()`. Clears individual entries with an `×` button.

### UV Index Tile
Add `uv_index_max` to daily API params. Add a 4th tile to `.details-grid` (or swap to a 2×2 grid) showing today's UV index with a plain-language scale label: *Low / Moderate / High / Very High / Extreme.*

### PWA Install Prompt
Intercept the `beforeinstallprompt` event before the browser fires its generic banner. Store the event, then show a contextual "Add to home screen" chip below the search box — timed to appear after a successful weather fetch (user has seen value). Gives full control over copy, timing, and dismiss behaviour.

### Hourly Temperature Strip
Add `hourly=temperature_2m,weather_code,precipitation_probability` to the forecast API call (already made). Render a horizontally scrollable strip of 24 hourly cards between the main card and the 5-day forecast. Shows whether conditions improve or worsen through the day.

---

## Tier 3 — Plan before building

### Animated Weather Icons
CSS `@keyframes` triggered by a condition class on the main icon wrap — rain drops falling, sun pulsing, snow drifting, lightning flash. No new data or API changes. Pairs directly with the existing weather condition theming system. High visual impact for zero runtime cost.

### City Comparison
Side-by-side glass card showing two cities at once. Requires a new layout pattern (split or stacked at different breakpoints), a second set of fetch calls, and a way to pin a comparison city separately from the primary search. Worth designing the UI before coding.

---

## Completed ✓

- City search + geolocation (Nominatim reverse geocoding)
- Current weather: temperature, feels-like, humidity, wind speed
- 5-day forecast with rain probability per day
- Sunrise / sunset with live daytime progress track
- Weather condition theming: aurora blob + accent colour per WMO category
- Temperature count-up animation (easeOut, 700ms)
- Favorites (max 3, persisted)
- Dark / Light theme toggle, persisted
- Last updated indicator with stale-data refresh nudge
- PWA: manifest, service worker, self-hosted fonts, offline app shell
- Sun + horizon SVG app icon
- Full OG / Twitter meta tags for link previews
- Accessibility: aria-labels, aria-hidden, role="alert"
