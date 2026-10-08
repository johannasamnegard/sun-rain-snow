import { renderIcons } from "./icons";
import { renderSavedCities } from "./render/renderSavedCities";
import { showWeather } from "./weatherController";
import { startPageEffect } from "./weatherEffects";
import { showGreeting } from "./greeting";

/**START PAGE - NOTHING SAVED*/
export const initApp = () => {
  const savedCity = localStorage.getItem("saveWeather");
  showGreeting();
  if (savedCity !== null) {
    const parsed = JSON.parse(savedCity);
    showWeather(parsed.city, parsed.weather);
  } else {
    startPageEffect();
  }
  renderSavedCities();
  renderIcons();
};
