const accessKey = '5lS1hkMSDmSfXelR8MLs50VhmZ0hp5AaJ9a6b2ADu1I';
const apiKey = 'fdd1fa3e2d487efa421f70397f2ac7d4';

const weatherIcons = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
};

let unsplashImages = [];
let currentImageIndex = 0;
let imageCycleInterval = null;
let ticking = false;

/* ─── INIT ─────────────────────────────────── */
function init() {
    loadTheme();
    loadLastCity();
    setupEventListeners();
    setupScrollReveal();
    setupScrollEffects();
    setupCustomCursor();
    setupParticles();
    setupHamburger();
}

/* ─── CUSTOM CURSOR ────────────────────────── */
function setupCustomCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover effect on interactive elements
    document.querySelectorAll('a, button, input, .forecast-card, .detail-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

/* ─── PARTICLES ────────────────────────────── */
function setupParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const count = 18;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        const size = Math.random() * 3 + 1;
        p.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${Math.random() * 100}%;
            animation-duration: ${Math.random() * 12 + 8}s;
            animation-delay: ${Math.random() * 10}s;
            opacity: 0;
        `;
        container.appendChild(p);
    }
}

/* ─── HAMBURGER (MOBILE MENU) ──────────────── */
function setupHamburger() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
    });

    // Close on link click
    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('open');
        });
    });
}

/* ─── EVENT LISTENERS ──────────────────────── */
function setupEventListeners() {
    document.getElementById('searchButton').addEventListener('click', () => {
        const city = document.getElementById('cityInput').value.trim();
        if (city) fetchWeatherData(city);
    });

    const cityInput = document.getElementById('cityInput');
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = cityInput.value.trim();
            if (city) fetchWeatherData(city);
        }
    });

    // Input ripple effect
    cityInput.addEventListener('focus', () => {
        cityInput.parentElement.style.transform = 'scale(1.01)';
    });
    cityInput.addEventListener('blur', () => {
        cityInput.parentElement.style.transform = '';
    });

    document.getElementById('geoButton').addEventListener('click', getUserLocation);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
}

/* ─── SCROLL EFFECTS ───────────────────────── */
function setupScrollEffects() {
    const navbar = document.getElementById('navbar');
    const progressBar = document.getElementById('scrollProgress');
    const heroBg = document.getElementById('heroBg');
    const forecastParallax = document.getElementById('forecastParallax');

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const docH = document.documentElement.scrollHeight - window.innerHeight;
                const progress = (scrollY / docH) * 100;

                // Scroll progress bar
                if (progressBar) progressBar.style.width = progress + '%';

                // Navbar scroll state
                if (navbar) {
                    navbar.classList.toggle('scrolled', scrollY > 60);
                }

                // Hero parallax
                if (heroBg) {
                    heroBg.style.transform = `translateY(${scrollY * 0.45}px)`;
                }

                // Forecast section parallax
                if (forecastParallax) {
                    const rect = forecastParallax.closest('.forecast-section').getBoundingClientRect();
                    const offset = (window.innerHeight - rect.top) * 0.12;
                    forecastParallax.style.transform = `translateY(${offset}px)`;
                }

                // Animate forecast bars when in view
                animateForecastBars();

                ticking = false;
            });
            ticking = true;
        }
    });
}

/* ─── SCROLL REVEAL ────────────────────────── */
function setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger children if multiple entering
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 0);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-up, .reveal-scale, .forecast-card').forEach(el => {
        observer.observe(el);
    });

    // Staggered forecast cards
    const forecastObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.forecast-card');
                cards.forEach((card, i) => {
                    setTimeout(() => card.classList.add('visible'), i * 100);
                });
                forecastObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const forecastGrid = document.getElementById('forecastGrid');
    if (forecastGrid) forecastObserver.observe(forecastGrid);
}

/* ─── FORECAST BAR ANIMATION ───────────────── */
let barsAnimated = false;
function animateForecastBars() {
    if (barsAnimated) return;
    const forecastGrid = document.getElementById('forecastGrid');
    if (!forecastGrid) return;
    const rect = forecastGrid.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
        document.querySelectorAll('.forecast-fill').forEach(bar => {
            const target = bar.dataset.width || bar.style.width;
            bar.style.width = target;
        });
        barsAnimated = true;
    }
}

/* ─── FETCH WEATHER ────────────────────────── */
function fetchWeatherData(city) {
    showLoading(true);

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const unsplashUrl = `https://api.unsplash.com/search/photos?orientation=landscape&per_page=10&query=${encodeURIComponent(city)}`;

    Promise.all([
        fetch(weatherUrl).then(r => r.json()),
        fetch(forecastUrl).then(r => r.json()),
        fetch(unsplashUrl, { headers: { 'Authorization': `Client-ID ${accessKey}` } }).then(r => r.json())
    ])
    .then(([weatherData, forecastData, imageData]) => {
        if (weatherData.cod !== 200) throw new Error(weatherData.message || 'City not found');

        updateWeatherUI(weatherData);
        updateForecastUI(forecastData);
        updateImageUI(imageData);
        updateStatsBar(weatherData);

        saveLastCity(city);
        document.getElementById('cityInput').value = '';
    })
    .catch(error => {
        showError(error.message);
    })
    .finally(() => {
        showLoading(false);
    });
}

/* ─── UPDATE WEATHER UI ─────────────────────── */
function updateWeatherUI(data) {
    const iconCode = data.weather[0].icon;
    const icon = weatherIcons[iconCode] || '☁️';
    const visibility = data.visibility ? `${(data.visibility / 1000).toFixed(1)} km` : '—';

    document.getElementById('cityName').textContent = data.name;
    document.getElementById('weatherIcon').textContent = icon;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById('visibility').textContent = visibility;

    const humidityVal = data.main.humidity;
    document.getElementById('humidity').textContent = `${humidityVal}%`;
    const humidityBar = document.getElementById('humidityBar');
    if (humidityBar) {
        setTimeout(() => { humidityBar.style.width = humidityVal + '%'; }, 400);
    }

    document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s`;
    updateWindDirection(data.wind.deg);
    animateTemperature(data.main.temp);
}

/* ─── ANIMATE TEMPERATURE ──────────────────── */
function animateTemperature(temp) {
    const el = document.getElementById('temperature');
    const target = Math.round(temp);
    let current = 0;
    const duration = 900;
    const start = performance.now();

    function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        current = Math.round(target * eased);
        el.textContent = current;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
    }

    requestAnimationFrame(step);
}

/* ─── UPDATE WIND DIRECTION ─────────────────── */
function updateWindDirection(degrees) {
    const needle = document.getElementById('windDirection');
    if (needle && degrees !== undefined) {
        needle.style.transform = `translateX(-50%) rotate(${degrees}deg)`;
    }
}

/* ─── UPDATE STATS BAR ──────────────────────── */
function updateStatsBar(data) {
    const statsBar = document.getElementById('statsBar');
    document.getElementById('statCityVal').textContent = data.name;
    document.getElementById('statTemp').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('statCondition').textContent = data.weather[0].description;
    document.getElementById('statHumidity').textContent = `${data.main.humidity}%`;
    if (statsBar) statsBar.classList.add('visible');
}

/* ─── UPDATE FORECAST UI ─────────────────────── */
function updateForecastUI(data) {
    const grid = document.getElementById('forecastGrid');
    if (!grid) return;

    const dailyForecasts = {};
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        if (!dailyForecasts[day]) dailyForecasts[day] = {
            main: item,
            temps: [item.main.temp]
        };
        else dailyForecasts[day].temps.push(item.main.temp);
    });

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    const days = Object.keys(dailyForecasts).slice(0, 5);
    const maxTemp = 40; // for bar width calc

    grid.innerHTML = days.map((day, index) => {
        const { main: forecast, temps } = dailyForecasts[day];
        const iconCode = forecast.weather[0].icon;
        const icon = weatherIcons[iconCode] || '☁️';
        const high = Math.round(Math.max(...temps));
        const low = Math.round(Math.min(...temps));
        const dayIndex = (today + index + 1) % 7;
        const barPct = Math.min((high / maxTemp) * 100, 100);

        return `
            <div class="forecast-card">
                <p class="forecast-day">${dayNames[dayIndex]}</p>
                <div class="forecast-icon-wrap"><div class="forecast-icon">${icon}</div></div>
                <div class="forecast-temps">
                    <p class="forecast-temp-high">${high}°</p>
                    <p class="forecast-temp-low">${low}°</p>
                </div>
                <div class="forecast-bar"><div class="forecast-fill" data-width="${barPct}%" style="width:0%"></div></div>
            </div>
        `;
    }).join('');

    // Re-observe new cards
    const newCards = grid.querySelectorAll('.forecast-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const i = Array.from(newCards).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    // Also trigger bar animation
                    const bar = entry.target.querySelector('.forecast-fill');
                    if (bar) setTimeout(() => { bar.style.width = bar.dataset.width; }, 300);
                }, i * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    newCards.forEach(card => observer.observe(card));

    barsAnimated = false; // reset for new data
}

/* ─── UPDATE IMAGE UI ────────────────────────── */
function updateImageUI(data) {
    if (!data.results || data.results.length === 0) return;

    unsplashImages = data.results.map(r => ({
        url: r.urls.regular,
        credit: `Photo by ${r.user.name} on Unsplash`
    }));
    currentImageIndex = 0;

    setHeroImage(0);
    buildImageDots();

    // Auto cycle
    if (imageCycleInterval) clearInterval(imageCycleInterval);
    imageCycleInterval = setInterval(() => cycleImages(1), 6000);
}

function setHeroImage(index) {
    const heroImage = document.getElementById('heroImage');
    const credit = document.getElementById('heroPhotoCredit') || document.getElementById('photoCredit');
    if (!heroImage) return;

    heroImage.style.opacity = '0';
    heroImage.style.transform = 'scale(1.04)';
    setTimeout(() => {
        heroImage.src = unsplashImages[index].url;
        heroImage.style.opacity = '1';
        heroImage.style.transform = 'scale(1)';
        heroImage.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        if (credit) credit.textContent = unsplashImages[index].credit;
    }, 350);

    updateDots(index);
}

function buildImageDots() {
    const container = document.getElementById('imageDots');
    if (!container) return;
    container.innerHTML = unsplashImages.map((_, i) =>
        `<div class="img-dot${i === 0 ? ' active' : ''}" data-index="${i}"></div>`
    ).join('');

    container.querySelectorAll('.img-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const i = parseInt(dot.dataset.index);
            currentImageIndex = i;
            setHeroImage(i);
        });
    });
}

function updateDots(index) {
    document.querySelectorAll('.img-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function cycleImages(direction = 1) {
    if (unsplashImages.length < 2) return;
    currentImageIndex = (currentImageIndex + direction + unsplashImages.length) % unsplashImages.length;
    setHeroImage(currentImageIndex);
}

/* ─── GEOLOCATION ────────────────────────────── */
function getUserLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser.');
        return;
    }

    const geoBtn = document.getElementById('geoButton');
    if (geoBtn) {
        geoBtn.textContent = '⏳';
        geoBtn.style.pointerEvents = 'none';
    }

    showLoading(true);
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            fetchByCoordinates(pos.coords.latitude, pos.coords.longitude);
            if (geoBtn) { geoBtn.textContent = '📍'; geoBtn.style.pointerEvents = ''; }
        },
        () => {
            showError('Unable to get location. Please enable location services.');
            showLoading(false);
            if (geoBtn) { geoBtn.textContent = '📍'; geoBtn.style.pointerEvents = ''; }
        }
    );
}

function fetchByCoordinates(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const unsplashUrl = city => `https://api.unsplash.com/search/photos?orientation=landscape&per_page=10&query=${encodeURIComponent(city)}`;

    Promise.all([
        fetch(weatherUrl).then(r => r.json()),
        fetch(forecastUrl).then(r => r.json())
    ])
    .then(([weatherData, forecastData]) => {
        if (weatherData.cod !== 200) throw new Error('Location not found');
        updateWeatherUI(weatherData);
        updateForecastUI(forecastData);
        updateStatsBar(weatherData);
        saveLastCity(weatherData.name);
        document.getElementById('cityInput').value = weatherData.name;

        // Fetch images too
        return fetch(unsplashUrl(weatherData.name), {
            headers: { 'Authorization': `Client-ID ${accessKey}` }
        }).then(r => r.json());
    })
    .then(imageData => {
        if (imageData) updateImageUI(imageData);
    })
    .catch(error => showError(error.message))
    .finally(() => showLoading(false));
}

/* ─── LOADING STATE ──────────────────────────── */
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    const weatherInfo = document.getElementById('weatherInfo');
    if (show) {
        spinner.classList.add('active');
        weatherInfo.classList.add('loading');
    } else {
        spinner.classList.remove('active');
        weatherInfo.classList.remove('loading');
    }
}

/* ─── ERROR ──────────────────────────────────── */
function showError(message) {
    const weatherInfo = document.getElementById('weatherInfo');
    const msg = message.charAt(0).toUpperCase() + message.slice(1);
    weatherInfo.innerHTML = `<div class="error-message">⚠️ ${msg}</div>`;
}

/* ─── PERSISTENCE ────────────────────────────── */
function saveLastCity(city) {
    localStorage.setItem('lastCity', city);
}

function loadLastCity() {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        document.getElementById('cityInput').value = lastCity;
        fetchWeatherData(lastCity);
    }
}

/* ─── THEME ──────────────────────────────────── */
function loadTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
        document.body.setAttribute('data-theme', 'light');
        const icon = document.querySelector('.theme-icon');
        if (icon) icon.textContent = '☀️';
    }
}

function toggleTheme() {
    const body = document.body;
    const icon = document.querySelector('.theme-icon');
    const isLight = body.getAttribute('data-theme') === 'light';

    if (isLight) {
        body.removeAttribute('data-theme');
        if (icon) icon.textContent = '🌙';
        localStorage.setItem('theme', 'dark');
    } else {
        body.setAttribute('data-theme', 'light');
        if (icon) icon.textContent = '☀️';
        localStorage.setItem('theme', 'light');
    }
}

document.addEventListener('DOMContentLoaded', init);