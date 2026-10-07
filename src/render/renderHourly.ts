import type { CurrentWeather, HourlyForecast } from "../data/types";
import { getTodayIndex } from "../data/api";

import { getWeatherDetails } from "../data/weatherData";
import { renderIcons } from "../icons";
import { hourlyList, hourlyToggle } from "../dom";

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

/* HOURLY - highlight the hovered hour's whole column */
let highlightedColumn: HTMLTableCellElement[] = [];

/* HOURLY - clears highlight */
const clearColumnHighlight = () => {
  highlightedColumn.forEach((cell) => cell.classList.remove("hovered-column"));
  highlightedColumn = [];
};

/* HOURLY - reads where to hover */
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

/* HOURLY - reads when to stop hover */
hourlyList.addEventListener("mouseout", (event) => {
  const related = event.relatedTarget as Node | null;
  if (!related || !hourlyList.contains(related)) clearColumnHighlight();
});

/* HOURLY - scroll with mouse wheel or trackpad (trackpads report the swipe as deltaX) */
hourlyList.addEventListener("wheel", (event) => {
  if (!(event.target instanceof Element)) return;
  const wrapper = event.target.closest(
    ".hourly-table-wrapper",
  ) as HTMLElement | null;
  if (!wrapper) return;
  event.preventDefault();
  wrapper.scrollLeft += event.deltaX !== 0 ? event.deltaX : event.deltaY;
});
