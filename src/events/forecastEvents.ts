import { forecastList, hourlyList, hourlyToggle } from "../dom";
import { updateWeatherEffect } from "../weatherEffects";
import { renderForecast, renderDayOverview } from "../render/renderForecast";
import { renderHourly, getHoursForDay } from "../render/renderHourly";
import { appState } from "../state";

export const initForecast = () => {
  /** FORECAST - Button to get data from clicked forecast day*/
  forecastList.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }
    const button = event.target.closest(".forcast-day-button");
    if (!button || !appState.currentCity || !appState.currentWeather) {
      return;
    }

    const index = Number((button as HTMLElement).dataset.index);
    if (Number.isNaN(index)) {
      return;
    }

    renderDayOverview(appState.currentCity, appState.currentWeather, index);
    renderForecast(appState.currentWeather, index);
    renderHourly(getHoursForDay(appState.currentWeather, index));

    updateWeatherEffect(appState.currentWeather.forecast.weathercode[index]);
  });

  /* HOURLY - Click on the toggle button */
  hourlyToggle.addEventListener("click", () => {
    hourlyToggle.hidden = false;
    hourlyList.hidden = !hourlyList.hidden;
    hourlyToggle.classList.toggle("open", !hourlyList.hidden);
  });
};
