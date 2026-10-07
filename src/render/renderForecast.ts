import type { CurrentWeather, City } from "../data/types";
import { renderWeather } from "./renderWeatherPanel";
import { forecastList } from "../dom";
import { getWeatherDetails } from "../data/weatherData";
import { getTodayIndex } from "../data/api";
import { renderIcons } from "../icons";

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
          <i data-lucide="${description.icon}" class="forcast-icon${description.icon === "circle-off" ? " no-weather" : ""}"></i>
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
