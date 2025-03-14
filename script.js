let searchBtn = document.getElementById("Search-btn");
let searchInpt = document.getElementById("Search-input");
let resultDiv = document.getElementById("result");

async function getData(cityName) {
    try {
        let response = await fetch(`http://api.weatherapi.com/v1/current.json?key=aedde40f8d9e4ba1a4b30736242709&q=${cityName}&aqi=yes`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        resultDiv.classList.remove("hidden");
        resultDiv.innerHTML = `<div class="error-message">Error fetching weather data. Please try again.</div>`;
    }
}

function displayWeatherData(data) {
    if (data.error) {
        resultDiv.classList.remove("hidden");
        resultDiv.innerHTML = `<div class="error-message">${data.error.message}</div>`;
    } else {
        // Format date
        const dateObj = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options);
        
        // Create weather HTML with all the styled elements
        resultDiv.innerHTML = `
            <div class="weather-card">
                <div class="weather-header">
                    <div class="location">${data.location.name}, ${data.location.country}</div>
                    <div class="date">${formattedDate}</div>
                </div>
                <div class="weather-info">
                    <div class="temperature">${data.current.temp_c}°C</div>
                    <div class="weather-icon">
                        <img src="https:${data.current.condition.icon}" alt="${data.current.condition.text}">
                    </div>
                    <div class="weather-description">${data.current.condition.text}</div>
                </div>
                <div class="weather-details">
                    <div class="detail">
                        <span class="detail-label">Feels Like</span>
                        <span class="detail-value">${data.current.feelslike_c}°C</span>
                    </div>
                    <div class="detail">
                        <span class="detail-label">Humidity</span>
                        <span class="detail-value">${data.current.humidity}%</span>
                    </div>
                    <div class="detail">
                        <span class="detail-label">Wind</span>
                        <span class="detail-value">${data.current.wind_kph} km/h</span>
                    </div>
                    <div class="detail">
                        <span class="detail-label">UV Index</span>
                        <span class="detail-value">${data.current.uv}</span>
                    </div>
                </div>
                ${data.current.air_quality ? `
                <div class="air-quality">
                    <h3>Air Quality</h3>
                    <div class="weather-details">
                        <div class="detail">
                            <span class="detail-label">CO</span>
                            <span class="detail-value">${parseFloat(data.current.air_quality.co).toFixed(2)}</span>
                        </div>
                        <div class="detail">
                            <span class="detail-label">NO₂</span>
                            <span class="detail-value">${parseFloat(data.current.air_quality.no2).toFixed(2)}</span>
                        </div>
                        <div class="detail">
                            <span class="detail-label">O₃</span>
                            <span class="detail-value">${parseFloat(data.current.air_quality.o3).toFixed(2)}</span>
                        </div>
                        <div class="detail">
                            <span class="detail-label">PM2.5</span>
                            <span class="detail-value">${parseFloat(data.current.air_quality.pm2_5).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
        
        // Show the result
        resultDiv.classList.remove("hidden");
    }
}

// Function to handle search
function handleSearch() {
    const cityName = searchInpt.value.trim();
    if (cityName) {
        resultDiv.classList.remove("hidden");
        resultDiv.innerHTML = `<div class="loading">Loading weather data...</div>`;
        getData(cityName);
    } else {
        resultDiv.classList.remove("hidden");
        resultDiv.innerHTML = `<div class="error-message">Please enter a city name.</div>`;
    }
}

// Event listeners
searchBtn.addEventListener('click', handleSearch);

// Allow search when pressing Enter key
searchInpt.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Focus the input field when the page loads
window.addEventListener('load', () => {
    searchInpt.focus();
});