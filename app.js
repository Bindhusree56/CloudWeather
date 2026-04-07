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

function init() {
    loadTheme();
    loadLastCity();
    setupEventListeners();
    setupIntersectionObserver();
    setupScrollListener();
}

function setupEventListeners() {
    document.getElementById('searchButton').addEventListener('click', () => {
        const city = document.getElementById('cityInput').value.trim();
        if (city) fetchWeatherData(city);
    });

    document.getElementById('cityInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = document.getElementById('cityInput').value.trim();
            if (city) fetchWeatherData(city);
        }
    });

    document.getElementById('geoButton').addEventListener('click', getUserLocation);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
}

function setupScrollListener() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-title, .weather-box, .forecast-card, .about-content').forEach(el => {
        observer.observe(el);
    });
}

function fetchWeatherData(city) {
    showLoading(true);
    clearErrors();

    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const unsplashApiUrl = `https://api.unsplash.com/search/photos?orientation=landscape&per_page=10&query=${city}`;

    Promise.all([
        fetch(weatherApiUrl).then(r => r.json()),
        fetch(forecastApiUrl).then(r => r.json()),
        fetch(unsplashApiUrl, { headers: { 'Authorization': `Client-ID ${accessKey}` } }).then(r => r.json())
    ])
    .then(([weatherData, forecastData, imageData]) => {
        if (weatherData.cod !== 200) throw new Error('City not found');
        
        updateWeatherUI(weatherData);
        updateForecastUI(forecastData);
        updateImageUI(imageData);
        
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

function updateWeatherUI(data) {
    const iconCode = data.weather[0].icon;
    const icon = weatherIcons[iconCode] || '☁️';
    
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('weatherIcon').textContent = icon;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s`;
    document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
    
    animateTemperature(data.main.temp);
    updateWindDirection(data.wind.deg);
}

function animateTemperature(temp) {
    const tempEl = document.getElementById('temperature');
    const targetTemp = Math.round(temp);
    let currentTemp = 0;
    const duration = 1000;
    const increment = targetTemp / (duration / 16);
    
    const animate = () => {
        currentTemp += increment;
        if (currentTemp < targetTemp) {
            tempEl.textContent = Math.round(currentTemp);
            requestAnimationFrame(animate);
        } else {
            tempEl.textContent = targetTemp;
        }
    };
    
    tempEl.textContent = '0';
    animate();
}

function updateWindDirection(degrees) {
    const needle = document.getElementById('windDirection');
    if (degrees !== undefined) {
        needle.style.transform = `rotate(${degrees}deg)`;
    } else {
        needle.style.transform = 'rotate(0deg)';
    }
}

function updateForecastUI(data) {
    const forecastGrid = document.getElementById('forecastGrid');
    const dailyForecasts = {};
    
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        if (!dailyForecasts[day]) {
            dailyForecasts[day] = item;
        }
    });
    
    const days = Object.keys(dailyForecasts).slice(0, 5);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    
    forecastGrid.innerHTML = days.map((day, index) => {
        const forecast = dailyForecasts[day];
        const iconCode = forecast.weather[0].icon;
        const icon = weatherIcons[iconCode] || '☁️';
        const temp = Math.round(forecast.main.temp);
        const dayIndex = (today + index + 1) % 7;
        
        return `
            <div class="forecast-card">
                <p class="forecast-day">${dayNames[dayIndex]}</p>
                <div class="forecast-icon">${icon}</div>
                <p class="forecast-temp">${temp}°C</p>
            </div>
        `;
    }).join('');
    
    setTimeout(() => {
        document.querySelectorAll('.forecast-card').forEach((card, i) => {
            setTimeout(() => card.classList.add('visible'), i * 100);
        });
    }, 100);
}

function updateImageUI(data) {
    if (data.results && data.results.length > 0) {
        unsplashImages = data.results.map(r => ({
            url: r.urls.regular,
            credit: `Photo by ${r.user.name} on Unsplash`
        }));
        currentImageIndex = 0;
        
        const heroImage = document.getElementById('heroImage');
        heroImage.style.opacity = '0';
        
        setTimeout(() => {
            heroImage.src = unsplashImages[0].url;
            heroImage.style.opacity = '1';
        }, 300);
        
        document.getElementById('photoCredit').textContent = unsplashImages[0].credit;
    }
}

function cycleImages() {
    if (unsplashImages.length > 1) {
        currentImageIndex = (currentImageIndex + 1) % unsplashImages.length;
        const heroImage = document.getElementById('heroImage');
        heroImage.style.opacity = '0';
        
        setTimeout(() => {
            heroImage.src = unsplashImages[currentImageIndex].url;
            heroImage.style.opacity = '1';
            document.getElementById('photoCredit').textContent = unsplashImages[currentImageIndex].credit;
        }, 300);
    }
}

window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition > 500 && scrollPosition % 300 < 10) {
        cycleImages();
    }
});

function getUserLocation() {
    if (navigator.geolocation) {
        showLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchByCoordinates(latitude, longitude);
            },
            (error) => {
                showError('Unable to get location. Please enable location services.');
                showLoading(false);
            }
        );
    } else {
        showError('Geolocation is not supported by your browser.');
    }
}

function fetchByCoordinates(lat, lon) {
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    Promise.all([
        fetch(weatherApiUrl).then(r => r.json()),
        fetch(forecastApiUrl).then(r => r.json())
    ])
    .then(([weatherData, forecastData]) => {
        if (weatherData.cod !== 200) throw new Error('Location not found');
        
        updateWeatherUI(weatherData);
        updateForecastUI(forecastData);
        
        saveLastCity(weatherData.name);
        document.getElementById('cityInput').value = weatherData.name;
    })
    .catch(error => {
        showError(error.message);
    })
    .finally(() => {
        showLoading(false);
    });
}

function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    const weatherInfo = document.getElementById('weatherInfo');
    
    if (show) {
        spinner.classList.add('active');
        weatherInfo.style.opacity = '0.3';
    } else {
        spinner.classList.remove('active');
        weatherInfo.style.opacity = '1';
    }
}

function showError(message) {
    const weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.innerHTML = `<p class="error-shake" style="color: #ff6b6b; text-align: center;">${message}</p>`;
    
    setTimeout(() => {
        weatherInfo.classList.add('fade-in');
    }, 500);
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-shake');
    errorElements.forEach(el => el.classList.remove('error-shake'));
}

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

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
        document.querySelector('.theme-icon').textContent = '☀️';
    }
}

function toggleTheme() {
    const body = document.body;
    const icon = document.querySelector('.theme-icon');
    
    if (body.getAttribute('data-theme') === 'light') {
        body.removeAttribute('data-theme');
        icon.textContent = '🌙';
        localStorage.setItem('theme', 'dark');
    } else {
        body.setAttribute('data-theme', 'light');
        icon.textContent = '☀️';
        localStorage.setItem('theme', 'light');
    }
}

document.addEventListener('DOMContentLoaded', init);