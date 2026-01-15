const apiKey = "dafe838bd8b869c11f4df98667698dfe"; 
let currentUnit = "metric"; 
let lastSearchedCity = localStorage.getItem("lastCity") || "New York";

const searchBox = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const themeToggle = document.getElementById("theme-toggle");
const unitC = document.getElementById("unit-c");
const unitF = document.getElementById("unit-f");

// Initial Load
window.onload = () => checkWeather(lastSearchedCity);

async function checkWeather(city) {
    if (!city) return;
    lastSearchedCity = city;
    localStorage.setItem("lastCity", city);
    const url = `https://api.openweathermap.org/data/2.5/weather?units=${currentUnit}&q=${city}&appid=${apiKey}`;
    fetchData(url);
}

async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    if (response.status == 200) {
        updateUI(data);
        getForecast(data.name);
    } else { alert("City not found!"); }
}

function updateUI(data) {
    document.getElementById("city-name").innerText = data.name;
    document.getElementById("temp-value").innerText = Math.round(data.main.temp);
    document.getElementById("humidity").innerText = data.main.humidity + "%";
    document.getElementById("condition-text").innerText = data.weather[0].main;
    document.getElementById("wind").innerText = Math.round(data.wind.speed) + (currentUnit === "metric" ? " km/h" : " mph");
    document.getElementById("main-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

async function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?units=${currentUnit}&q=${city}&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    const forecastList = document.getElementById("forecast-list");
    forecastList.innerHTML = "";
    for (let i = 0; i < data.list.length; i += 8) {
        const dayData = data.list[i];
        const date = new Date(dayData.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        forecastList.innerHTML += `
            <div class="forecast-row" style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #eee;">
                <span>${date}</span>
                <img src="https://openweathermap.org/img/wn/${dayData.weather[0].icon}.png" width="40">
                <b>${Math.round(dayData.main.temp)}°</b>
            </div>`;
    }
}

// THEME TOGGLE
themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    document.documentElement.setAttribute("data-theme", isDark ? "light" : "dark");
    themeToggle.innerText = isDark ? "🌙" : "☀️";
});

// UNIT TOGGLE
unitC.addEventListener("click", () => {
    currentUnit = "metric";
    unitC.classList.add("active"); unitF.classList.remove("active");
    checkWeather(lastSearchedCity);
});

unitF.addEventListener("click", () => {
    currentUnit = "imperial";
    unitF.classList.add("active"); unitC.classList.remove("active");
    checkWeather(lastSearchedCity);
});

searchBtn.addEventListener("click", () => checkWeather(searchBox.value));
