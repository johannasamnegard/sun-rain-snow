import { renderIcons } from "./icons";
import { renderSavedCities } from "./render/renderSavedCities";
import { showWeather } from "./weatherController";
import { startPageEffect } from "./weatherEffects";
import { showGreeting } from "./greeting";
import { getWeather } from "./data/api";

/**START PAGE - NOTHING SAVED*/
export const initApp = async () => {
  const savedCity = localStorage.getItem("saveWeather");
  showGreeting();
  if (savedCity !== null) {
    const parsed = JSON.parse(savedCity);
    // Re-fetch instead of reusing the cached weather, which may be from a past day
    const weather = await getWeather(
      parsed.city.latitude,
      parsed.city.longitude,
    );
    showWeather(parsed.city, weather);
  } else {
    startPageEffect();
  }
  renderSavedCities();
  renderIcons();
};
