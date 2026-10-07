import { weatherList, savedCitiesList, maxCitiesDialog } from "../dom";
import { getSavedCities, saveCities } from "../data/storage";
import { getWeather } from "../data/api";
import { renderWeather } from "../render/renderWeatherPanel";
import { renderSavedCities } from "../render/renderSavedCities";
import { appState } from "../state";
import { showWeather } from "../weatherController";

export const initSavedCities = () => {
  /** SAVED CITIES LIST - Delete a saved city or load its weather */
  savedCitiesList.addEventListener("click", async (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }
    const button = event.target.closest("button");
    if (!button) {
      return;
    }

    const latitude = Number(button.dataset.lat);
    const longitude = Number(button.dataset.lon);

    if (button.classList.contains("delete-city-item")) {
      const cities = getSavedCities().filter(
        (city) => !(city.latitude === latitude && city.longitude === longitude),
      );
      saveCities(cities);
      renderSavedCities();
      return;
    }

    const weather = await getWeather(latitude, longitude);
    const cities = getSavedCities();
    const selectedCity = cities.find(
      (city) => city.latitude === latitude && city.longitude === longitude,
    );
    if (!selectedCity) {
      return;
    }
    showWeather(selectedCity, weather);
  });

  /** SAVE TOGGLE - Heart button: save or remove city */
  weatherList.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }
    if (!event.target.closest("#saveCityButton")) {
      return;
    }
    if (!appState.currentCity || !appState.currentWeather) {
      return;
    }
    const cities = getSavedCities();
    const cityAlreadySaved = cities.some(
      (city) =>
        city.latitude === appState.currentCity?.latitude &&
        city.longitude === appState.currentCity.longitude,
    );
    if (cityAlreadySaved) {
      const remainingCities = cities.filter(
        (city) =>
          !(
            city.latitude === appState.currentCity?.latitude &&
            city.longitude === appState.currentCity.longitude
          ),
      );
      saveCities(remainingCities);
      renderWeather(appState.currentCity, appState.currentWeather, false);
      renderSavedCities();
      return;
    } else {
      if (cities.length >= 6) {
        maxCitiesDialog.show();
        setTimeout(() => maxCitiesDialog.close(), 2500);
        return;
      }
      cities.push(appState.currentCity);
      saveCities(cities);
      renderWeather(appState.currentCity, appState.currentWeather, false);
      renderSavedCities();

      return;
    }
  });
};
