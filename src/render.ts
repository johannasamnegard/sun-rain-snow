import type { City, CurrentWeather, HourlyForecast } from "./types";
import { getWeather, getTodayIndex } from "./api";

import { getWeatherDetails } from "./weatherData";
import { renderIcons } from "./icons";
import { getSavedCities } from "./storage";
import {
  searchDropdown,
  weatherList,
  savedCitiesList,
  forecastList,
  hourlyList,
  hourlyToggle,
} from "./dom";

/* DROPDOWN - SAVED - MAIN WEATHER - FORCAST - HOURLY */

/**DROPDOWN - Mapping the city data to html - ul element*/
const cityList = (cities: City[], currentIndex: number) => {
  return `<ul class="search-result-list">${cities.map((city, index) => listItem(city, index, currentIndex)).join("")}</ul>`;
};

/**DROPDOWN - Creating the HTML for each city item and highlightning*/
const listItem = (city: City, index: number, currentIndex: number) => {
  const cssClass =
    index === currentIndex ? "city-item highlighted" : "city-item";
  const cityLabel = city.admin1
    ? `${city.name}, ${city.admin1}, ${city.country}`
    : `${city.name}, ${city.country}`;

  const isSaved = getSavedCities().some(
    (saved) =>
      saved.latitude === city.latitude && saved.longitude === city.longitude,
  );
  const savedButtonClass = isSaved
    ? "save-search-city-button saved"
    : "save-search-city-button";

  return `
        <li data-index="${index}" class="${cssClass}">
        <button type="button" 
        data-lat="${city.latitude}" data-lon="${city.longitude}" class="city-select-button">
        <i data-lucide="map-pin" class="map-pin-icon"></i>
        ${cityLabel} </button>
        <button type="button" class="${savedButtonClass}" aria-pressed="${isSaved}" data-lat="${city.latitude}" data-lon="${city.longitude}"><i data-lucide="heart" class="save-search-city-icon"></i></button>
        </li>
    `;
};

/**DROPDOWN - Reuses in every dropdown*/
export const renderDropdown = (
  currentResults: City[],
  currentIndex: number,
) => {
  searchDropdown.innerHTML = cityList(currentResults, currentIndex);
  renderIcons();
};

/**SAVED - Mapping the cities that have been saved*/
export const renderSavedCities = async () => {
  const cities = getSavedCities();

  if (cities.length === 0) {
    savedCitiesList.innerHTML = "";
    return;
  }

  const cards = await Promise.all(
    cities.map(async (city) => {
      const weather = await getWeather(city.latitude, city.longitude); //Fetches the actual weatherdata
      const description = getWeatherDetails(weather.weathercode); //icon and text lookup

      return `
      <div class="saved-city-wrapper">
        <button type="button" class="saved-city-item" data-lat="${city.latitude}" data-lon="${city.longitude}">
          <i data-lucide="${description.icon}" class="saved-weather-icon"></i>
          <div class="saved-city-text">
          <p><b>${city.name}</b></p>
  
          <p>${weather.temperature}°C</p>
          </div>
        </button>
        <button type="button" class="delete-city-item" data-lat="${city.latitude}" data-lon="${city.longitude}">
          <i data-lucide="X" class="delete-city-icon"></i>
        </button>
      </div>`;
    }),
  );
  savedCitiesList.innerHTML = cards.join("");
  renderIcons();
};

/**MAIN WEATHER - Creating the HTML for the clicked city-data (main weather)*/
export const renderWeather = (
  city: City,
  weather: CurrentWeather,
  saveToStorage = true,
) => {
  const description = getWeatherDetails(weather.weathercode);

  document.body.className = document.body.className
    .replace(/weather-bg-\S+/g, "")
    .trim();
  document.body.classList.add(`weather-bg-${description.icon}`);

  const dateObject = new Date(`${weather.sunrise.slice(0, 10)}T00:00:00`);

  const dayName = dateObject.toLocaleDateString(undefined, { weekday: "long" });
  const dateLabel = dateObject.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const isSaved = getSavedCities().some(
    (saved) =>
      saved.latitude === city.latitude && saved.longitude === city.longitude,
  );
  const savedButtonClass = isSaved
    ? "save-city-button saved"
    : "save-city-button";

  weatherList.innerHTML = `
  <div class="weather-panel panel-bg-${description.icon}">
    <div class="title-date">
      <div class="weather-title-row">
        <h2>${city.name}, ${city.country}</h2>
        <button type="button" id="saveCityButton" class="${savedButtonClass}" aria-pressed="${isSaved}"><i data-lucide="heart" class="save-city-icon"></i></button>
      </div>
      <p><b>${dayName}, ${dateLabel}</b></p>
      <p>${description.text}</p>
    </div>

    <div class="weather-temp-main">
      <p class="temp-big">${weather.temperature}°C</p>
      <p class="feels-like-text"><i>Feels like ${weather.feelslike}°C</i></p>
    </div>


    <div class="weather-condition">
    <i data-lucide="${description.icon}" class="today-weather-icon${description.icon === "circle-off" ? " icon-fallback" : ""}"></i>
    </div>

    <div class="weather-details">

      <div class="detail-item">
        <p class="detail-label">Max temp:</p> 
        <span class="detail-value"><i data-lucide="thermometer" class="detail-icon max-temp-icon"></i><p>${weather.tempMax}°C</p></span> 
      </div>

      <div class="detail-item">
        <p class="detail-label">Min temp:</p>
        <span class="detail-value"><i data-lucide="thermometer" class="detail-icon"></i><p>${weather.tempMin}°C</p></span> 
      </div>

      <div class="detail-item">
        <p class="detail-label">Rain:</p> 
        <span class="detail-value"><i data-lucide="droplets" class="detail-icon"></i><p>${weather.rain} mm</p></span> 
      </div>

      <div class="detail-item">
        <p class="detail-label">Wind:</p> 
        <span class="detail-value"><i data-lucide="arrow-up" class="detail-icon wind-direction-icon" style="--wind-direction: ${weather.winddirection}deg"></i><p>${weather.windspeed} km/h</p></span> 
      </div>

      <div class="detail-item">
        <p class="detail-label">Sunrise:</p> 
        <span class="detail-value"><i data-lucide="sunrise" class="detail-icon"></i><p>${weather.sunrise.slice(11)}</p></span> 
      </div>

      <div class="detail-item" class="detail-icon">
        <p class="detail-label">Sunset:</p> 
        <span class="detail-value"><i data-lucide="sunset" class="detail-icon"></i><p>${weather.sunset.slice(11)}</p></span> 
      </div>
    </div>
    
    
  </div>
    `;
  renderIcons();
  if (saveToStorage) {
    localStorage.setItem("saveWeather", JSON.stringify({ city, weather }));
  }
};

/**FORECAST -Reshapes one forecast-day index into a CurrentWeather-like object*/
const toDayWeather = (
  weather: CurrentWeather,
  index: number,
): CurrentWeather => {
  return {
    temperature: weather.forecast.tempMax[index],
    feelslike: weather.forecast.feelslikemax[index],
    weathercode: weather.forecast.weathercode[index],
    windspeed: weather.forecast.windspeed[index],
    winddirection: weather.forecast.winddirection[index],
    rain: weather.forecast.rain[index],
    sunrise: weather.forecast.sunrise[index],
    sunset: weather.forecast.sunset[index],
    tempMax: weather.forecast.tempMax[index],
    tempMin: weather.forecast.tempMin[index],
    forecast: weather.forecast,
    hourly: weather.hourly,
  };
};

/** FORECAST - Shows a signle forcast day in the main weather panel */
export const renderDayOverview = (
  city: City,
  weather: CurrentWeather,
  index: number,
) => {
  renderWeather(city, toDayWeather(weather, index), false);
};

/** FORECAST - Rendering out the forecast for the choosen city */
export const renderForecast = (
  weather: CurrentWeather,
  selectedIndex: number,
) => {
  const previousScrollLeft =
    forecastList.querySelector(".forecast-list")?.scrollLeft ?? 0;

  const days = weather.forecast.time.map((date, index) => {
    const description = getWeatherDetails(weather.forecast.weathercode[index]);
    const dateObject = new Date(`${date}T00:00:00`);
    const dayName = dateObject.toLocaleDateString(undefined, {
      weekday: "long",
    });
    const dateLable = dateObject.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    const isThisToday = index === getTodayIndex();

    const cssClass =
      index === selectedIndex ? "forecast-day highlighted" : "forecast-day";

    return `
    <li class="${cssClass}">
      ${isThisToday ? `<p class="forecast-today-lable">Today</p>` : ""}
      <button type="button" class="forcast-day-button forecast-bg-${description.icon}" data-index="${index}" data-date="${date}">

        <p><b>${dayName}</b></p>
        <p>${dateLable}</p>
          <i data-lucide="${description.icon}" class="forcast-icon${description.icon === "circle-off" ? " icon-fallback" : ""}"></i>
        <p>${description.text}</p>
        <p><b>${weather.forecast.tempMax[index]}°C</b> / <i>${weather.forecast.tempMin[index]}°C</i></p>
      </button>
    </li>`;
  });

  forecastList.innerHTML = `<ul class="forecast-list">${days.join("")}</ul>`;
  renderIcons();

  const newList = forecastList.querySelector(".forecast-list");
  if (newList) {
    newList.scrollLeft = previousScrollLeft;
  }
};

/** HOURLY - Get the hours. hoursOffset + startIndex + endIndex is so it snaps on the current time and 24h forward */
export const getHoursForDay = (
  weather: CurrentWeather,
  index: number,
): HourlyForecast => {
  const hourOffset = index === getTodayIndex() ? new Date().getHours() : 0;
  const startIndex = index * 24 + hourOffset;
  const endIndex = startIndex + 24;
  const dayTimes = weather.hourly.time.slice(startIndex, endIndex);
  const dayWeathercodes = weather.hourly.weathercode.slice(
    startIndex,
    endIndex,
  );
  const dayTemperature = weather.hourly.temperature.slice(startIndex, endIndex);
  const dayFeelslike = weather.hourly.feelslike.slice(startIndex, endIndex);
  const dayRain = weather.hourly.rain.slice(startIndex, endIndex);
  const dayWindspeed = weather.hourly.windspeed.slice(startIndex, endIndex);
  const dayWinddirection = weather.hourly.winddirection.slice(
    startIndex,
    endIndex,
  );
  return {
    time: dayTimes,
    weathercode: dayWeathercodes,
    temperature: dayTemperature,
    feelslike: dayFeelslike,
    rain: dayRain,
    windspeed: dayWindspeed,
    winddirection: dayWinddirection,
  };
};

/* HORULY - Rendering the hours */
export const renderHourly = (hourly: HourlyForecast) => {
  hourlyToggle.hidden = false;

  /* True for the first column of a calendar day*/
  const isNewDay = (index: number) =>
    index > 0 &&
    hourly.time[index].slice(0, 10) !== hourly.time[index - 1].slice(0, 10);

  const cellFor = (
    lable: string,
    hourly: HourlyForecast,
    index: number,
    newDay: boolean,
  ) => {
    const cssClass = newDay ? ' class="new-day"' : "";

    switch (lable) {
      case "Condition": {
        const description = getWeatherDetails(hourly.weathercode[index]);
        return `<td${cssClass}><i data-lucide="${description.icon}" class="hourly-weather-icon"></i></td>`;
      }
      case "Temperature °C":
        return `<td${cssClass}>${hourly.temperature[index]}°</td>`;
      case "Feels like °C":
        return `<td${cssClass}>${hourly.feelslike[index]}°</td>`;
      case "Rain mm":
        return `<td${cssClass}>${hourly.rain[index]}</td>`;
      case "Wind km/h":
        return `<td${cssClass}>${hourly.windspeed[index]}</td>`;
      case "Wind-direction":
        return `<td${cssClass}><i data-lucide="arrow-up" class="wind-direction-icon" style="--wind-direction: ${hourly.winddirection[index]}deg"></i></td>`;
      default:
        return `<td${cssClass}></td>`;
    }
  };

  const headerRow = `<tr><th class="empty-time-header"></th>${hourly.time
    .map((t, index) => {
      const newDay = isNewDay(index);
      const dateLabel = newDay
        ? `<span class="new-day-label">${new Date(`${t.slice(0, 10)}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>`
        : "";
      return `<th class="time-header${newDay ? " new-day" : ""}">${dateLabel}${t.slice(11)}</th>`;
    })
    .join("")}</tr>`;
  const bodyLabels = [
    "Condition",
    "Temperature °C",
    "Feels like °C",
    "Rain mm",
    "Wind km/h",
    "Wind-direction",
  ];

  const bodyRows = bodyLabels.map((lable) => {
    const cells = hourly.time.map((_, index) =>
      cellFor(lable, hourly, index, isNewDay(index)),
    );
    return `<tr><th class="lable-header">${lable}</th>${cells.join("")}</tr>`;
  });

  hourlyList.innerHTML = `
    <div class="hourly-table-wrapper">
      <table class="hourly-table">
        <thead>${headerRow}</thead>
        <tbody>${bodyRows.join("")}</tbody>
      </table>
    </div>
    `;
  renderIcons();
};

/* HOURLY - highlight the hovered hour's whole column (delegated so it survives innerHTML rebuilds) */
let highlightedColumn: HTMLTableCellElement[] = [];

const clearColumnHighlight = () => {
  highlightedColumn.forEach((cell) => cell.classList.remove("hovered-column"));
  highlightedColumn = [];
};

hourlyList.addEventListener("mouseover", (event) => {
  const cell = (event.target as HTMLElement).closest(
    "td, th",
  ) as HTMLTableCellElement | null;
  const table = cell?.closest("table");
  if (!cell || !table || cell.cellIndex === 0) return;

  clearColumnHighlight();
  highlightedColumn = Array.from(table.rows).map(
    (row) => row.cells[cell.cellIndex],
  );
  highlightedColumn.forEach((cell) => cell.classList.add("hovered-column"));
});

hourlyList.addEventListener("mouseout", (event) => {
  const related = event.relatedTarget as Node | null;
  if (!related || !hourlyList.contains(related)) clearColumnHighlight();
});

hourlyList.addEventListener("wheel", (event) => {
  if (!(event.target instanceof Element)) return;
  const wrapper = event.target.closest(
    ".hourly-table-wrapper",
  ) as HTMLElement | null;
  if (!wrapper) return;
  event.preventDefault();
  wrapper.scrollLeft += event.deltaY;
});
