// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');

function updateIcons(theme) {
    if (theme === 'dark') {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
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

// Auto-load last city after everything is ready
window.addEventListener('load', () => {
    renderFavorites();
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        cityInput.value = lastCity;
        setTimeout(() => getWeather(), 100);
    }
});

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
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
const weatherIconLarge = document.getElementById('weatherIconLarge');
const highLow = document.getElementById('highLow');
const favorites = document.getElementById('favorites');
const addFavBtn = document.getElementById('addFavBtn');
const favCityName = document.getElementById('favCityName');

const MAX_FAVORITES = 3;

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

// Weather Codes Mapping to Remix Icon classes
const weatherIcons = {
    0: 'ri-sun-line', 1: 'ri-sun-line', 2: 'ri-cloud-line', 3: 'ri-cloudy-line',
    45: 'ri-foggy-line', 48: 'ri-foggy-line',
    51: 'ri-drizzle-line', 53: 'ri-drizzle-line', 55: 'ri-drizzle-line',
    61: 'ri-rainy-line', 63: 'ri-rainy-line', 65: 'ri-heavy-showers-line',
    71: 'ri-snowy-line', 73: 'ri-snowy-line', 75: 'ri-snowy-line',
    80: 'ri-rainy-line', 81: 'ri-rainy-line', 82: 'ri-heavy-showers-line',
    95: 'ri-thunderstorms-line', 96: 'ri-thunderstorms-line', 99: 'ri-thunderstorms-line'
};

const iconDefaults = { default: 'ri-sun-cloudy-line' };

function updateWeatherIcon(weatherCode, isDay) {
    const iconClass = weatherIcons[weatherCode] || iconDefaults.default;
    weatherIconLarge.innerHTML = `<i class="${iconClass}" style="font-size: 4rem; color: var(--color-primary);"></i>`;
}

function renderForecast(daily) {
    const days = daily.time;
    const maxTemps = daily.temperature_2m_max;
    const minTemps = daily.temperature_2m_min;
    const codes = daily.weather_code;
    
    forecastList.innerHTML = '';
    
    days.forEach((date, index) => {
        const d = new Date(date);
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        const iconClass = weatherIcons[codes[index]] || iconDefaults.default;
        const high = Math.round(maxTemps[index]);
        const low = Math.round(minTemps[index]);
        
        const dayEl = document.createElement('div');
        dayEl.className = 'forecast-card';
        dayEl.style.animationDelay = `${index * 0.05}s`;
        dayEl.innerHTML = `
            <div class="forecast-date" style="font-weight: 600; font-size: 0.875rem; color: var(--color-text-secondary);">${dayName}</div>
            <i class="${iconClass}" style="font-size: 2rem; color: var(--color-primary);"></i>
            <div style="margin-top: auto;">
                <div class="forecast-temp-high" style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800;">${high}°</div>
                <div class="forecast-temp-low" style="color: var(--color-text-secondary); font-size: 0.875rem; font-weight: 500;">${low}°</div>
            </div>
        `;
        
        forecastList.appendChild(dayEl);
    });
}

// Favorites
function getFavorites() {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
}

function saveFavorites(favs) {
    localStorage.setItem('favorites', JSON.stringify(favs));
}

function isFavorite(cityName) {
    return getFavorites().some(f => f.name === cityName);
}

function addToFavorites() {
    if (!window.currentCityData) return;
    
    const favs = getFavorites();
    if (favs.length >= MAX_FAVORITES) {
        alert(`Maximum ${MAX_FAVORITES} favorites allowed.`);
        return;
    }
    if (isFavorite(window.currentCityData.name)) {
        return;
    }
    
    favs.push(window.currentCityData);
    saveFavorites(favs);
    renderFavorites();
    renderAddFavBtn();
}

function removeFavorite(cityName) {
    let favs = getFavorites();
    favs = favs.filter(f => f.name !== cityName);
    saveFavorites(favs);
    renderFavorites();
    renderAddFavBtn();
}

function renderFavorites() {
    const favs = getFavorites();
    favorites.innerHTML = '';
    
    favs.forEach(fav => {
        const btn = document.createElement('button');
        btn.className = 'fav-btn';
        btn.innerHTML = `
            <span>${fav.name}</span>
            <i class="ri-close-line fav-remove"></i>
        `;
        btn.onclick = () => {
            cityInput.value = fav.name;
            getWeather();
        };
        
        const removeBtn = btn.querySelector('.fav-remove');
        removeBtn.onclick = (e) => {
            e.stopPropagation();
            removeFavorite(fav.name);
        };
        
        favorites.appendChild(btn);
    });
}

function renderAddFavBtn() {
    if (!window.currentCityData) return;
    
    const alreadyFav = isFavorite(window.currentCityData.name);
    addFavBtn.classList.toggle('hidden', alreadyFav);
    
    if (!alreadyFav) {
        favCityName.textContent = window.currentCityData.name;
    }
}

async function fetchFavoriteWeather(fav) {
    weatherResult.classList.add('hidden');
    forecastContainer.classList.add('hidden');
    errorMessage.classList.add('hidden');
    loader.classList.remove('hidden');
    
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${fav.latitude}&longitude=${fav.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.current) throw new Error('Weather not found');
        
        const current = data.current;
        const isDay = current.is_day;
        
        cityName.textContent = `${fav.name}, ${fav.country}`;
        temperature.textContent = `${Math.round(current.temperature_2m)}°`;
        description.textContent = weatherCodes[current.weather_code] || 'Unknown';
        
        updateWeatherIcon(current.weather_code, isDay);
        
        const daily = data.daily;
        highLow.textContent = `H:${Math.round(daily.temperature_2m_max[0])}° L:${Math.round(daily.temperature_2m_min[0])}°`;
        feelsLike.textContent = `${Math.round(current.apparent_temperature)}°C`;
        humidity.textContent = `${current.relative_humidity_2m}%`;
        windSpeed.textContent = `${current.wind_speed_10m} km/h`;
        
        renderForecast(data.daily);
        
        window.currentCityData = { name: fav.name, country: fav.country, latitude: fav.latitude, longitude: fav.longitude };
        
        loader.classList.add('hidden');
        weatherResult.classList.remove('hidden');
        forecastContainer.classList.remove('hidden');
        renderAddFavBtn();
        
    } catch (error) {
        loader.classList.add('hidden');
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
    }
}

// Main Weather Fetch
async function getWeather() {
    const city = cityInput.value.trim();
    if (!city) return;

    weatherResult.classList.add('hidden');
    forecastContainer.classList.add('hidden');
    errorMessage.classList.add('hidden');
    loader.classList.remove('hidden');

    try {
        // Geocoding
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('City not found. Please try another name.');
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // Weather Data
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        if (!weatherData.current) {
            throw new Error('Unable to fetch current weather data.');
        }

        const current = weatherData.current;
        const isDay = current.is_day;
        
        // Update DOM
        cityName.textContent = `${name}, ${country}`;
        temperature.textContent = `${Math.round(current.temperature_2m)}°`;
        description.textContent = weatherCodes[current.weather_code] || 'Atmospheric conditions';
        
        updateWeatherIcon(current.weather_code, isDay);
        
        const daily = weatherData.daily;
        const todayHigh = Math.round(daily.temperature_2m_max[0]);
        const todayLow = Math.round(daily.temperature_2m_min[0]);
        highLow.textContent = `H:${todayHigh}° L:${todayLow}°`;
        
        feelsLike.textContent = `${Math.round(current.apparent_temperature)}°C`;
        humidity.textContent = `${current.relative_humidity_2m}%`;
        windSpeed.textContent = `${current.wind_speed_10m} km/h`;
        
        renderForecast(weatherData.daily);
        
        // Save last searched city
        localStorage.setItem('lastCity', name);
        
        // Store current city data for favorites
        window.currentCityData = { name, country, latitude, longitude };
        
        // Render favorites button
        renderAddFavBtn();
        
        loader.classList.add('hidden');
        weatherResult.classList.remove('hidden');
        forecastContainer.classList.remove('hidden');
        weatherResult.style.opacity = '0';
        setTimeout(() => {
            weatherResult.style.opacity = '1';
        }, 10);

    } catch (error) {
        loader.classList.add('hidden');
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
    }
}

// Event Listeners
searchBtn.addEventListener('click', getWeather);
addFavBtn.addEventListener('click', addToFavorites);
cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        getWeather();
    }
});

// Parallax Effect
document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    const blobs = document.querySelectorAll('.aurora-blob');
    blobs.forEach((blob, index) => {
        const speed = (index + 1) * 20;
        const xOffset = (x - 0.5) * speed;
        const yOffset = (y - 0.5) * speed;
        blob.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
});