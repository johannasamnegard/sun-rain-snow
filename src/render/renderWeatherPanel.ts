import type { City, CurrentWeather } from "../data/types";
import { getWeatherDetails } from "../data/weatherData";
import { getSavedCities } from "../data/storage";
import { weatherList } from "../dom";
import { renderIcons } from "../icons";

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
    <i data-lucide="${description.icon}" class="today-weather-icon${description.icon === "circle-off" ? " no-weather" : ""}"></i>
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

      <div class="detail-item">
        <p class="detail-label">Sunset:</p> 
        <span class="detail-value"><i data-lucide="sunset" class="detail-icon"></i><p>${weather.sunset.slice(11)}</p></span> 
      </div>
    </div>
    
    
  </div>
    `;
  renderIcons();
  if (saveToStorage) {
    localStorage.setItem(
      "saveWeather",
      JSON.stringify({ city, weather, icon: description.icon }),
    );
  }
};
