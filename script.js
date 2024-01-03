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

// display the day
const day = new Date();
const dayName = days[day.getDay()];
dayEl.textContent = dayName;

// display date
let month = day.toLocaleString("default", { month: "long" });
let date = day.getDate();
let year = day.getFullYear();

console.log();
dateEl.textContent = date + " " + month + " " + year;

// add event
btnEl.addEventListener("click", (e) => {
    e.preventDefault();

    // check empty value
    if (inputEl.value !== "") {
        const Search = inputEl.value;
        inputEl.value = "";
        findLocation(Search);
    } else {
        console.log("Please Enter City or Country Name");
    }
});

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
            // display image content
            const ImageContent = displayImageContent(result);

            // display right side content
            const rightSide = rightSideContent(result);

            // forecast function
            displayForeCast(result.coord.lat, result.coord.lon);

            setTimeout(() => {
                iconsContainer.insertAdjacentHTML("afterbegin", ImageContent);
                iconsContainer.classList.add("fadeIn");
                dayInfoEl.insertAdjacentHTML("afterbegin", rightSide);
            }, 1500);
        } else {
            const message = `<h2 class="weather_temp">${result.cod}</h2>
      <h3 class="cloudtxt">${result.message}</h3>`;
            iconsContainer.insertAdjacentHTML("afterbegin", message);
        }
    } catch (error) { }
}

async function displayForeCast(lat, long) {
    const ForeCast_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API}`;
    const data = await fetch(ForeCast_API);
    const result = await data.json();
    // filter the forecast
    const uniqeForeCastDays = [];
    const daysForecast = result.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqeForeCastDays.includes(forecastDate)) {
            return uniqeForeCastDays.push(forecastDate);
        }
    });
    console.log(daysForecast);

    daysForecast.forEach((content, indx) => {
        if (indx <= 3) {
            listContentEl.insertAdjacentHTML("afterbegin", forecast(content));
        }
    });
}


// display image content and temp
function displayImageContent(data) {
    const celsiusTemp = Math.round(data.main.temp - 275.15);
    const fahrenheitTemp = Math.round((celsiusTemp * 9 / 5) + 32);

    return `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="" />
      <h2 class="weather_temp">${fahrenheitTemp}°F</h2>
      <h3 class="cloudtxt">${data.weather[0].description}</h3>`;
}

// display the right side content
function rightSideContent(result) {
    const celsiusTemp = Math.round(result.main.temp - 275.15);
    const fahrenheitTemp = Math.round((celsiusTemp * 9 / 5) + 32);
    const windSpeedMph = Math.round(result.wind.speed * 2.23694 * 0.621371); // Convert km/h to mph

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

// forecast html element data
function forecast(frContent) {
    const celsiusTemp = Math.round(frContent.main.temp - 275.15);
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
