// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');

function updateIcons(theme) {
    const isDark = theme === 'dark';
    sunIcon.classList.toggle('hidden', isDark);
    moonIcon.classList.toggle('hidden', !isDark);
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateIcons(savedTheme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcons(newTheme);
});

initTheme();

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const weatherResult = document.getElementById('weatherResult');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const errorMessage = document.getElementById('errorMessage');
const loader = document.getElementById('loader');
const forecastContainer = document.getElementById('forecastContainer');
const forecastList = document.getElementById('forecastList');
const forecastTitle = document.getElementById('forecastTitle');
const weatherIconLarge = document.getElementById('weatherIconLarge');
const highLow = document.getElementById('highLow');
const favorites = document.getElementById('favorites');
const addFavBtn = document.getElementById('addFavBtn');
const sunTimes = document.getElementById('sunTimes');
const sunriseTime = document.getElementById('sunriseTime');
const sunsetTime = document.getElementById('sunsetTime');
const sunTrackFill = document.getElementById('sunTrackFill');
const lastUpdated = document.getElementById('lastUpdated');

const MAX_FAVORITES = 3;
const DEFAULT_WEATHER_ICON = 'ri-sun-cloudy-line';

// Weather Codes Mapping
const weatherCodes = {
    0: 'Clear sky',
    1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Depositing rime fog',
    51: 'Drizzle: Light', 53: 'Drizzle: Moderate', 55: 'Drizzle: Dense intensity',
    61: 'Rain: Slight', 63: 'Rain: Moderate', 65: 'Rain: Heavy intensity',
    71: 'Snow fall: Slight', 73: 'Snow fall: Moderate', 75: 'Snow fall: Heavy intensity',
    77: 'Snow grains',
    80: 'Rain showers: Slight', 81: 'Rain showers: Moderate', 82: 'Rain showers: Violent',
    85: 'Snow showers: Slight', 86: 'Snow showers: Heavy',
    95: 'Thunderstorm: Slight or moderate',
    96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail',
};

const weatherIcons = {
    0: 'ri-sun-line', 1: 'ri-sun-line', 2: 'ri-cloud-line', 3: 'ri-cloudy-line',
    45: 'ri-foggy-line', 48: 'ri-foggy-line',
    51: 'ri-drizzle-line', 53: 'ri-drizzle-line', 55: 'ri-drizzle-line',
    61: 'ri-rainy-line', 63: 'ri-rainy-line', 65: 'ri-heavy-showers-line',
    71: 'ri-snowy-line', 73: 'ri-snowy-line', 75: 'ri-snowy-line', 77: 'ri-snowy-line',
    80: 'ri-rainy-line', 81: 'ri-rainy-line', 82: 'ri-heavy-showers-line',
    85: 'ri-snowy-line', 86: 'ri-snowy-line',
    95: 'ri-thunderstorms-line', 96: 'ri-thunderstorms-line', 99: 'ri-thunderstorms-line',
};

// Weather condition → primary color mapping
const weatherThemeColors = {
    clear:        '#FBBF24',
    partlyCloudy: '#60A5FA',
    overcast:     '#78909C',
    fog:          '#9FA8DA',
    drizzle:      '#29B6F6',
    rain:         '#1E88E5',
    heavyRain:    '#1565C0',
    snow:         '#4FC3F7',
    thunderstorm: '#7E57C2',
};

function getWeatherThemeColor(code) {
    if (code <= 1)                                                    return weatherThemeColors.clear;
    if (code === 2)                                                   return weatherThemeColors.partlyCloudy;
    if (code === 3)                                                   return weatherThemeColors.overcast;
    if (code === 45 || code === 48)                                   return weatherThemeColors.fog;
    if (code >= 51 && code <= 55)                                     return weatherThemeColors.drizzle;
    if (code === 61 || code === 63 || code === 80 || code === 81)     return weatherThemeColors.rain;
    if (code === 65 || code === 82)                                   return weatherThemeColors.heavyRain;
    if ((code >= 71 && code <= 77) || code === 85 || code === 86)    return weatherThemeColors.snow;
    if (code === 95 || code === 96 || code === 99)                   return weatherThemeColors.thunderstorm;
    return weatherThemeColors.partlyCloudy;
}

function applyWeatherTheme(code) {
    const color = getWeatherThemeColor(code);
    document.documentElement.style.setProperty('--color-primary', color);
    const blob = document.querySelector('.aurora-blob');
    if (blob) blob.style.background = color;
}

// Count-up animation: easeOut cubic, always 700ms
function countUp(element, target) {
    const duration = 700;
    const start = performance.now();
    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = `${Math.round(target * eased)}°`;
        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

// =============================================
// UI State Helpers
// =============================================
function resetUI() {
    weatherResult.classList.add('hidden');
    forecastContainer.classList.add('hidden');
    errorMessage.classList.add('hidden');
    sunTimes.classList.add('hidden');
    loader.classList.remove('hidden');
}

function showError(message) {
    loader.classList.add('hidden');
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function showWeatherResult(tempValue) {
    loader.classList.add('hidden');
    weatherResult.classList.remove('hidden');
    forecastContainer.classList.remove('hidden');
    weatherResult.style.opacity = '0';
    setTimeout(() => {
        weatherResult.style.opacity = '1';
        countUp(temperature, tempValue);
    }, 10);
}

// =============================================
// Render Helpers
// =============================================
function updateWeatherIcon(weatherCode) {
    const iconClass = weatherIcons[weatherCode] || DEFAULT_WEATHER_ICON;
    weatherIconLarge.innerHTML = `<i class="${iconClass} weather-icon-main"></i>`;
}

function formatSunTime(isoString) {
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function renderSunTimes(daily) {
    if (!daily.sunrise || !daily.sunset) return;

    const sunrise = new Date(daily.sunrise[0]);
    const sunset = new Date(daily.sunset[0]);
    const now = new Date();

    sunriseTime.textContent = formatSunTime(daily.sunrise[0]);
    sunsetTime.textContent = formatSunTime(daily.sunset[0]);

    // Daytime progress bar
    if (now >= sunrise && now <= sunset) {
        const progress = (now - sunrise) / (sunset - sunrise) * 100;
        sunTrackFill.style.width = `${progress.toFixed(1)}%`;
        document.getElementById('sunTrack').classList.remove('hidden');
    } else {
        document.getElementById('sunTrack').classList.add('hidden');
    }

    sunTimes.classList.remove('hidden');
}

function renderForecast(daily) {
    const days = daily.time;
    const maxTemps = daily.temperature_2m_max;
    const minTemps = daily.temperature_2m_min;
    const codes = daily.weather_code;
    const rainProbs = daily.precipitation_probability_max || [];

    // Dynamic section title: "Mon — Fri"
    if (forecastTitle && days.length >= 2) {
        const first = new Date(days[0] + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' });
        const last = new Date(days[days.length - 1] + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' });
        forecastTitle.textContent = `${first} — ${last}`;
    }

    forecastList.innerHTML = '';

    days.forEach((date, index) => {
        const d = new Date(date + 'T12:00:00');
        const isToday = index === 0;
        const dayName = isToday ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
        const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const iconClass = weatherIcons[codes[index]] || DEFAULT_WEATHER_ICON;
        const high = Math.round(maxTemps[index]);
        const low = Math.round(minTemps[index]);
        const rain = rainProbs[index] ?? null;

        const rainHtml = rain !== null && rain > 0
            ? `<span class="forecast-rain"><i class="ri-drop-line"></i>${rain}%</span>`
            : '';

        const dayEl = document.createElement('div');
        dayEl.className = `forecast-card${isToday ? ' today' : ''}`;
        dayEl.style.animationDelay = `${index * 0.05}s`;
        dayEl.innerHTML = `
            <span class="forecast-day">${dayName}</span>
            <span class="forecast-date">${dateLabel}</span>
            <i class="${iconClass} forecast-icon"></i>
            <div class="forecast-temps">
                <span class="forecast-high"><i class="ri-arrow-up-s-line"></i>${high}°</span>
                <span class="forecast-low"><i class="ri-arrow-down-s-line"></i>${low}°</span>
            </div>
            ${rainHtml}
        `;

        forecastList.appendChild(dayEl);
    });
}

function renderLastUpdated() {
    const ts = localStorage.getItem('lastFetched');
    if (!ts || !lastUpdated) return;

    const fetched = new Date(ts);
    const time = fetched.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const ageMin = Math.round((Date.now() - fetched.getTime()) / 60000);
    const isStale = ageMin > 30;

    lastUpdated.innerHTML = isStale
        ? `Updated ${time} &middot; <button class="refresh-nudge" onclick="refreshCurrent()">Refresh</button>`
        : `Updated ${time}`;
    lastUpdated.classList.remove('hidden');
}

function refreshCurrent() {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        cityInput.value = lastCity;
        getWeather();
    }
}

function renderWeatherData(current, daily, name, country) {
    applyWeatherTheme(current.weather_code);

    cityName.textContent = country ? `${name}, ${country}` : name;
    temperature.textContent = '0°';
    description.textContent = weatherCodes[current.weather_code] || 'Atmospheric conditions';

    updateWeatherIcon(current.weather_code);

    highLow.innerHTML = `<span class="temp-high"><i class="ri-arrow-up-s-line"></i>${Math.round(daily.temperature_2m_max[0])}°</span><span class="temp-low"><i class="ri-arrow-down-s-line"></i>${Math.round(daily.temperature_2m_min[0])}°</span>`;
    feelsLike.textContent = `${Math.round(current.apparent_temperature)}°C`;
    humidity.textContent = `${current.relative_humidity_2m}%`;
    windSpeed.textContent = `${current.wind_speed_10m} km/h`;

    renderForecast(daily);
    renderSunTimes(daily);

    localStorage.setItem('lastFetched', new Date().toISOString());
    renderLastUpdated();
}

// =============================================
// Favorites
// =============================================
function getFavorites() {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
}

function saveFavorites(favs) {
    localStorage.setItem('favorites', JSON.stringify(favs));
}

function isFavorite(name) {
    return getFavorites().some(f => f.name === name);
}

function addToFavorites() {
    if (!window.currentCityData) return;

    const favs = getFavorites();
    if (favs.length >= MAX_FAVORITES) {
        alert(`Maximum ${MAX_FAVORITES} favorites allowed.`);
        return;
    }
    if (isFavorite(window.currentCityData.name)) return;

    favs.push(window.currentCityData);
    saveFavorites(favs);
    renderFavorites();
    renderAddFavBtn();
}

function removeFavorite(name) {
    saveFavorites(getFavorites().filter(f => f.name !== name));
    renderFavorites();
    renderAddFavBtn();
}

function renderFavorites() {
    const favs = getFavorites();
    favorites.innerHTML = '';

    favs.forEach(fav => {
        const btn = document.createElement('button');
        btn.className = 'fav-btn';
        btn.innerHTML = `<span>${fav.name}</span><i class="ri-close-line fav-remove"></i>`;
        btn.onclick = () => { cityInput.value = fav.name; getWeather(); };
        btn.querySelector('.fav-remove').onclick = (e) => { e.stopPropagation(); removeFavorite(fav.name); };
        favorites.appendChild(btn);
    });
}

function renderAddFavBtn() {
    if (!window.currentCityData) return;
    addFavBtn.classList.toggle('hidden', isFavorite(window.currentCityData.name));
}

// =============================================
// Fetch: Favorite city
// =============================================
async function fetchFavoriteWeather(fav) {
    resetUI();
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${fav.latitude}&longitude=${fav.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=auto&forecast_days=5`;
        const response = await fetch(url);
        const data = await response.json();
        if (!data.current) throw new Error('Weather not found');

        renderWeatherData(data.current, data.daily, fav.name, fav.country);
        window.currentCityData = { name: fav.name, country: fav.country, latitude: fav.latitude, longitude: fav.longitude };
        renderAddFavBtn();
        showWeatherResult(Math.round(data.current.temperature_2m));
    } catch (error) {
        showError(error.message);
    }
}

// =============================================
// Fetch: City search
// =============================================
async function getWeather() {
    const city = cityInput.value.trim();
    if (!city) return;

    resetUI();
    try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('City not found. Please try another name.');
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=auto&forecast_days=5`);
        const weatherData = await weatherRes.json();

        if (!weatherData.current) throw new Error('Unable to fetch current weather data.');

        renderWeatherData(weatherData.current, weatherData.daily, name, country);
        localStorage.setItem('lastCity', name);
        window.currentCityData = { name, country, latitude, longitude };
        renderAddFavBtn();
        showWeatherResult(Math.round(weatherData.current.temperature_2m));
    } catch (error) {
        showError(error.message);
    }
}

// =============================================
// Fetch: Geolocation
// =============================================
async function getWeatherByCoords(latitude, longitude) {
    resetUI();
    try {
        const [geoRes, weatherRes] = await Promise.all([
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`),
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=auto&forecast_days=5`)
        ]);

        const geoData = await geoRes.json();
        const weatherData = await weatherRes.json();

        if (!weatherData.current) throw new Error('Unable to fetch weather for your location.');

        const addr = geoData.address || {};
        const name = addr.city || addr.town || addr.village || addr.county || 'Your Location';
        const country = addr.country_code ? addr.country_code.toUpperCase() : '';

        cityInput.value = name;
        renderWeatherData(weatherData.current, weatherData.daily, name, country);
        localStorage.setItem('lastCity', name);
        window.currentCityData = { name, country, latitude, longitude };
        renderAddFavBtn();
        showWeatherResult(Math.round(weatherData.current.temperature_2m));
    } catch (error) {
        showError(error.message);
    }
}

function handleLocationFetch() {
    if (!navigator.geolocation) {
        errorMessage.textContent = 'Geolocation is not supported by your browser.';
        errorMessage.classList.remove('hidden');
        return;
    }

    locationBtn.disabled = true;
    locationBtn.querySelector('i').className = 'ri-loader-4-line';

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            locationBtn.disabled = false;
            locationBtn.querySelector('i').className = 'ri-map-pin-user-line';
            getWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
            locationBtn.disabled = false;
            locationBtn.querySelector('i').className = 'ri-map-pin-user-line';
            showError('Location access denied. Please allow location or search manually.');
        }
    );
}

// =============================================
// Event Listeners
// =============================================
searchBtn.addEventListener('click', getWeather);
locationBtn.addEventListener('click', handleLocationFetch);
addFavBtn.addEventListener('click', addToFavorites);
cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); getWeather(); }
});

// Parallax Effect
document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    document.querySelectorAll('.aurora-blob').forEach((blob, index) => {
        const speed = (index + 1) * 20;
        blob.style.transform = `translate(${(x - 0.5) * speed}px, ${(y - 0.5) * speed}px)`;
    });
});

// Init
window.addEventListener('load', () => {
    renderFavorites();
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        cityInput.value = lastCity;
        setTimeout(() => getWeather(), 100);
    }
});
