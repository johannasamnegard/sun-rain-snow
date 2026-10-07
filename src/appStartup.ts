import { renderIcons } from "./icons";
import { renderSavedCities } from "./render/renderSavedCities";
import { showWeather } from "./weatherController";
import { startPageEffect } from "./weatherEffects";

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

const greetingByHour = () => {
  const hour = new Date().getHours();
  if (hour < 5) return "Still up?";
  if (hour < 12) return "Good morning!";
  if (hour < 18) return "Good afternoon!";
  return "Good evening!";
};

const showGreeting = () => {
  const greetingText = document.getElementById("greetingText");
  if (greetingText) {
    greetingText.textContent = greetingByHour();
  }
};
