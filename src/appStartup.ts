import { renderIcons } from "./icons";
import { renderSavedCities } from "./render/renderSavedCities";
import { showWeather } from "./weatherController";

/**START PAGE - NOTHING SAVED*/
export const initApp = () => {
  const savedCity = localStorage.getItem("saveWeather");
  if (savedCity !== null) {
    const parsed = JSON.parse(savedCity);
    showWeather(parsed.city, parsed.weather);
  }
  renderSavedCities();
  renderIcons();
};
