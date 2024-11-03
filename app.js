const accessKey = '5lS1hkMSDmSfXelR8MLs50VhmZ0hp5AaJ9a6b2ADu1I'; // Replace with your Unsplash Access Key
const apiKey = 'fdd1fa3e2d487efa421f70397f2ac7d4'; // Replace with your OpenWeatherMap API Key

document.getElementById('searchButton').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const unsplashApiUrlBase = `https://api.unsplash.com/search/photos?orientation=landscape&query=${city}`;

    // Fetch weather data
    fetch(weatherApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            const weatherInfo = document.getElementById('weatherInfo');
            weatherInfo.innerHTML = `
                <h1>${data.name}</h1>
                <p>Temperature: ${data.main.temp}°C</p> 
                <p>Weather: ${data.weather[0].description}</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind Speed: ${data.wind.speed} m/s</p>
            `;
        })
        .catch(error => {
            document.getElementById('weatherInfo').innerHTML = `<p>${error.message}</p>`;
            console.error('Error:', error);
        });

    // Fetch image data
    fetch(unsplashApiUrlBase, {
        headers: {
            'Authorization': `Client-ID ${accessKey}`
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                const photo = data.results[0];
                const imageElement = document.getElementById('image');
                imageElement.src = photo.urls.full;
                document.querySelector('.text-overlay').textContent = `Photo by ${photo.user.name} on Unsplash`;
            } else {
                alert('No results found');
            }
        })
        .catch(error => console.error('Error fetching image:', error));
});
