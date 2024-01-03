"use strict";

const API = "9ae630da12dae59aade007a74a459b8d";

const dayEl = document.querySelector(".default_day");
const dateEl = document.querySelector(".default_date");
const btnEl = document.querySelector(".btn_search");
const inputEl = document.querySelector(".input_field");

const iconsContainer = document.querySelector(".icons");
const dayInfoEl = document.querySelector(".day_info");
const listContentEl = document.querySelector(".list_content ul");

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

// Display the day
const day = new Date();
const dayName = days[day.getDay()];
dayEl.textContent = dayName;

// Display date
let month = day.toLocaleString("default", { month: "long" });
let date = day.getDate();
let year = day.getFullYear();
dateEl.textContent = date + " " + month + " " + year;

// Add event listener for the search button
btnEl.addEventListener("click", (e) => {
    e.preventDefault();

    // Check if the input value is not empty
    if (inputEl.value !== "") {
        const searchQuery = inputEl.value;
        inputEl.value = "";
        findLocation(searchQuery);
    } else {
        console.log("Please Enter City or Country Name");
    }
});

// Function to fetch weather information for a location
async function findLocation(name) {
    iconsContainer.innerHTML = "";
    dayInfoEl.innerHTML = "";
    listContentEl.innerHTML = "";

    try {
        const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`;
        const data = await fetch(API_URL);
        const result = await data.json();
        console.log(result);

        if (result.cod !== "404") {
            // Display image content
            const imageContent = displayImageContent(result);

            // Display right side content
            const rightSide = rightSideContent(result);

            // Display forecast
            displayForeCast(result.coord.lat, result.coord.lon);

            setTimeout(() => {
                iconsContainer.insertAdjacentHTML("afterbegin", imageContent);
                iconsContainer.classList.add("fadeIn");
                dayInfoEl.insertAdjacentHTML("afterbegin", rightSide);
            }, 1500);
        } else {
            const message = `<h2 class="weather_temp">${result.cod}</h2>
      <h3 class="cloudtxt">${result.message}</h3>`;
            iconsContainer.insertAdjacentHTML("afterbegin", message);
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// Function to display forecast
async function displayForeCast(lat, long) {
    const ForeCast_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API}`;
    const data = await fetch(ForeCast_API);
    const result = await data.json();

    // Filter the forecast to get unique days
    const uniqueForeCastDays = {};
    const daysForecast = result.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForeCastDays[forecastDate]) {
            uniqueForeCastDays[forecastDate] = true;
            return true;
        }
        return false;
    });

    // Display the forecast
    daysForecast.slice(0, 4).forEach((content) => {
        listContentEl.insertAdjacentHTML("beforeend", forecast(content));
    });
}

// Function to display image content and temperature
function displayImageContent(data) {
    const celsiusTemp = Math.round(data.main.temp - 273.15);
    const fahrenheitTemp = Math.round((celsiusTemp * 9 / 5) + 32);

    return `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="" />
      <h2 class="weather_temp">${fahrenheitTemp}°F</h2>
      <h3 class="cloudtxt">${data.weather[0].description}</h3>`;
}

// Function to display the right side content
function rightSideContent(result) {
    const celsiusTemp = Math.round(result.main.temp - 273.15);
    const fahrenheitTemp = Math.round((celsiusTemp * 9 / 5) + 32);
    const windSpeedMph = Math.round(result.wind.speed * 2.23694); // Convert m/s to mph

    return `<div class="content">
            <p class="title">NAME</p>
            <span class="value">${result.name}</span>
          </div>
          <div class="content">
            <p class="title">TEMP</p>
            <span class="value">${fahrenheitTemp}°F</span>
          </div>
          <div class="content">
            <p class="title">HUMIDITY</p>
            <span class="value">${result.main.humidity}%</span>
          </div>
          <div class="content">
            <p class="title">WIND SPEED</p>
            <span class="value">${windSpeedMph} mph</span>
          </div>`;
}

// Function to generate forecast HTML element
function forecast(frContent) {
    const celsiusTemp = Math.round(frContent.main.temp - 273.15);
    const fahrenheitTemp = Math.round((celsiusTemp * 9 / 5) + 32);

    const day = new Date(frContent.dt_txt);
    const dayName = days[day.getDay()];
    const splitDay = dayName.split("", 3);
    const joinDay = splitDay.join("");

    return `<li>
    <img src="https://openweathermap.org/img/wn/${frContent.weather[0].icon}@2x.png" />
    <span>${joinDay}</span>
    <span class="day_temp">${fahrenheitTemp}°F</span>
  </li>`;
}
