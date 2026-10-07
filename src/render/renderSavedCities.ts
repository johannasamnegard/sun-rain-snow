import { getSavedCities } from "../data/storage";
import { savedCitiesList } from "../dom";
import { getWeather } from "../data/api";
import { getWeatherDetails } from "../data/weatherData";
import { renderIcons } from "../icons";

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
