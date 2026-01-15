const apiKey = "dafe838bd8b869c11f4df98667698dfe"; 
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const searchBox = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");

async function checkWeather(city) {
    try {
        const response = await fetch(weatherUrl + city + `&appid=${apiKey}`);
        const data = await response.json();

        if (response.status == 200) {
            document.getElementById("city-name").innerHTML = data.name;
            document.getElementById("temp-value").innerHTML = Math.round(data.main.temp) + "°C";
            document.getElementById("humidity").innerHTML = data.main.humidity + "%";
            document.getElementById("wind").innerHTML = data.wind.speed + " km/h";
            document.getElementById("weather-desc").innerHTML = data.weather[0].main;
            document.getElementById("main-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

            getForecast(city);
        } else {
            alert("City not found. Please check spelling.");
        }
    } catch (error) {
        console.log("Error fetching weather:", error);
    }
}

async function getForecast(city) {
    const response = await fetch(forecastUrl + city + `&appid=${apiKey}`);
    const data = await response.json();
    const forecastList = document.getElementById("forecast-list");
    
    forecastList.innerHTML = "";

    // Loop through forecast (taking one reading per day)
    for (let i = 0; i < data.list.length; i += 8) {
        const dayData = data.list[i];
        const date = new Date(dayData.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

        const html = `
            <div class="forecast-row">
                <span style="flex:1">${dayName}</span>
                <img src="https://openweathermap.org/img/wn/${dayData.weather[0].icon}.png" width="40">
                <span style="flex:2; text-align:center">${dayData.weather[0].main}</span>
                <b style="flex:1; text-align:right">${Math.round(dayData.main.temp)}°C</b>
            </div>
        `;
        forecastList.innerHTML += html;
    }
}

searchBtn.addEventListener("click", () => {
    if (searchBox.value !== "") {
        checkWeather(searchBox.value);
    }
});

// Allow "Enter" key to search
searchBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        checkWeather(searchBox.value);
    }
});