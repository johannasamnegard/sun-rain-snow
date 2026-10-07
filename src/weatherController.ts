import type { City, CurrentWeather } from "./data/types";
import { getTodayIndex } from "./data/api";
import { updateWeatherEffect } from "./weatherEffects";
import { renderWeather } from "./render/renderWeatherPanel";
import { renderForecast } from "./render/renderForecast";
import { renderHourly, getHoursForDay } from "./render/renderHourly";
import { appState } from "./state";

/** Renders main panel, forecast and hourly table for a combo of city & weather + tracks it as the current selection */
export const showWeather = (city: City, weather: CurrentWeather) => {
  renderWeather(city, weather);
  renderForecast(weather, getTodayIndex());
  renderHourly(getHoursForDay(weather, getTodayIndex()));
  appState.currentCity = city;
  appState.currentWeather = weather;
  updateWeatherEffect(weather.weathercode);
};
