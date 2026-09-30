import type { City, CurrentWeather } from "./types";
import {
  searchForm,
  searchDropdown,
  searchInput,
  weatherList,
  savedCitiesList,
  forecastList,
  hourlyList,
  hourlyToggle,
  maxCitiesDialog,
} from "./dom";
import { getSavedCities, saveCities } from "./storage";
import { getWeather, getCity, getTodayIndex } from "./api";
import { renderIcons } from "./icons";
import {
  renderDropdown,
  renderWeather,
  renderSavedCities,
  renderForecast,
  renderDayOverview,
  renderHourly,
  getHoursForDay,
} from "./render";

/** To be able to arowing up and down in the drop down */
let currentIndex = 0;
let currentResults: City[] = [];
let currentCity: City | null = null;
let currentWeather: CurrentWeather | null = null;

/** Empties the search input */
const clearSearchInput = () => {
  searchInput.value = "";
  searchDropdown.innerHTML = "";
  currentResults = [];
  currentIndex = -1;
};

/** INPUT - Message while searching */
const showSearchMessage = (message: string) => {
  searchDropdown.innerHTML = `<p class="search-message">${message}</p>`;
};

/** INPUT - CONTINUE THE SEARCH - Main handler for the live input-event*/
const continueCitySearch = async (query: string) => {
  if (query.length === 0) {
    searchDropdown.innerHTML = "";
    return;
  }
  if (query.length < 3) {
    showSearchMessage("Searching...");
    return;
  }
  if (searchDropdown.innerHTML === "") {
    showSearchMessage("Searching...");
  }

  currentResults = await getCity(query);

  if (currentResults.length === 0) {
    showSearchMessage("No cities found.");
    return;
  }
  currentIndex = 0;
  renderDropdown(currentResults, currentIndex);
};

/**INPUT - Search field*/
searchInput.addEventListener("input", async (event) => {
  if (!(event.target instanceof HTMLInputElement)) {
    return;
  }
  await continueCitySearch(searchInput.value.trim());
});

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
  renderWeather(selectedCity, weather);
  renderForecast(weather, getTodayIndex());
  renderHourly(getHoursForDay(weather, getTodayIndex()));
  currentCity = selectedCity;
  currentWeather = weather;
});

/** SAVE TOGGLE - Heart button: save or remove city */
weatherList.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }
  if (!event.target.closest("#saveCityButton")) {
    return;
  }
  if (!currentCity || !currentWeather) {
    return;
  }
  const cities = getSavedCities();
  const cityAlreadySaved = cities.some(
    (city) =>
      city.latitude === currentCity?.latitude &&
      city.longitude === currentCity.longitude,
  );
  if (cityAlreadySaved) {
    const remainingCities = cities.filter(
      (city) =>
        !(
          city.latitude === currentCity?.latitude &&
          city.longitude === currentCity.longitude
        ),
    );
    saveCities(remainingCities);
    renderWeather(currentCity, currentWeather, false);
    renderSavedCities();
    return;
  } else {
    if (cities.length >= 6) {
      maxCitiesDialog.show();
      setTimeout(() => maxCitiesDialog.close(), 2500);
      return;
    }
    cities.push(currentCity);
    saveCities(cities);
    renderWeather(currentCity, currentWeather, false);
    renderSavedCities();

    return;
  }
});

/** FORECAST - Button to get data from clicked forecast day*/
forecastList.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }
  const button = event.target.closest(".forcast-day-button");
  if (!button || !currentCity || !currentWeather) {
    return;
  }

  const index = Number((button as HTMLElement).dataset.index);
  if (Number.isNaN(index)) {
    return;
  }

  renderDayOverview(currentCity, currentWeather, index);
  renderForecast(currentWeather, index);
  renderHourly(getHoursForDay(currentWeather, index));
});

/* HOURLY - Click on the toggling button */
hourlyToggle.addEventListener("click", () => {
  hourlyToggle.hidden = false;
  hourlyList.hidden = !hourlyList.hidden;
  hourlyToggle.classList.toggle("open", !hourlyList.hidden);
});

/**DROPDOWN KEYS - Arrowing through the drop down menu, search with enter key and escape with "Esc"*/
searchInput.addEventListener("keydown", async (event) => {
  if (event.key === "ArrowDown") {
    currentIndex += 1;
    if (currentIndex > currentResults.length - 1) {
      currentIndex = currentResults.length - 1;
    }
  } else if (event.key === "ArrowUp") {
    currentIndex -= 1;
    if (currentIndex < -1) {
      currentIndex = -1;
    }
  } else if (event.key === "Enter") {
    if (currentIndex < 0) {
      currentIndex = 0;
    }
    event.preventDefault();
    const selectedCity = currentResults[currentIndex];
    const weather = await getWeather(
      selectedCity.latitude,
      selectedCity.longitude,
    );
    renderWeather(selectedCity, weather);
    renderForecast(weather, getTodayIndex());
    renderHourly(getHoursForDay(weather, getTodayIndex()));
    currentCity = selectedCity;
    currentWeather = weather;

    clearSearchInput();
    return;
  } else if (event.key === "Escape") {
    searchDropdown.innerHTML = "";
    currentResults = [];
    currentIndex = -1;
    return;
  } else {
    return;
  }
  event.preventDefault();
  renderDropdown(currentResults, currentIndex);
});

/**CLICK - Clicking in the input feild after arrowing down*/
searchInput.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query.length >= 3) {
    continueCitySearch(query);
  }
});

/**SUBMIT - Button for searching (form submission)*/
searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(searchForm);
  const city = String(formData.get("city") ?? "").trim();

  if (!city) {
    showSearchMessage("Please enter a city name to see the weather.");
    return;
  }

  showSearchMessage("Searching...");
  const results = await getCity(city);

  if (results.length === 0) {
    showSearchMessage("No cities found.");
    return;
  }

  const selectedCity = results[0];
  const weather = await getWeather(
    selectedCity.latitude,
    selectedCity.longitude,
  );

  renderWeather(selectedCity, weather);
  renderForecast(weather, getTodayIndex());
  renderHourly(getHoursForDay(weather, getTodayIndex()));
  currentCity = selectedCity;
  currentWeather = weather;
  clearSearchInput();
});

/**CLICK - Button click in the drop down menu (searchResult)*/
searchDropdown?.addEventListener("click", async (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const saveButton = event.target.closest(".save-search-city-button");
  if (saveButton instanceof HTMLElement) {
    const latitude = Number(saveButton.dataset.lat);
    const longitude = Number(saveButton.dataset.lon);

    const savedCity = currentResults.find(
      (city) => city.latitude === latitude && city.longitude === longitude,
    );
    if (!savedCity) {
      return;
    }
    const cities = getSavedCities();
    const cityAlreadySaved = cities.some(
      (city) =>
        city.latitude === savedCity.latitude &&
        city.longitude === savedCity.longitude,
    );

    if (cityAlreadySaved) {
      saveCities(
        cities.filter(
          (city) =>
            !(city.latitude === latitude && city.longitude === longitude),
        ),
      );
    } else if (cities.length >= 6) {
      maxCitiesDialog.show();
      setTimeout(() => maxCitiesDialog.close(), 2500);
    } else {
      saveCities([...cities, savedCity]);
    }
    renderDropdown(currentResults, currentIndex);
    renderSavedCities();
    event.stopPropagation();
    return;
  }

  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  const latitude = Number(button.dataset.lat);
  const longitude = Number(button.dataset.lon);

  const weather = await getWeather(latitude, longitude);

  const selectedCity = currentResults.find(
    (city) => city.latitude === latitude && city.longitude === longitude,
  );
  if (!selectedCity) {
    showSearchMessage("City not found.");
    return;
  }
  renderWeather(selectedCity, weather);
  renderForecast(weather, getTodayIndex());
  renderHourly(getHoursForDay(weather, getTodayIndex()));
  currentCity = selectedCity;
  currentWeather = weather;

  clearSearchInput();
  return;
});

/**CLICK - Clicking somewhear else then dropdown, input or button*/
document.addEventListener("click", (event) => {
  if (!(event.target instanceof Node)) {
    return;
  }
  if (
    !searchInput.contains(event.target) &&
    !searchDropdown.contains(event.target)
  ) {
    searchDropdown.innerHTML = "";
    currentResults = [];
  }
  return;
});

/**MOUSEOVER - Hovering mouse over drop down*/
searchDropdown.addEventListener("mouseover", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const item = event.target.closest(".city-item");
  if (!item) return;

  const index = Number((item as HTMLElement).dataset.index);
  if (Number.isNaN(index) || index === currentIndex) return;

  currentIndex = index;

  renderDropdown(currentResults, currentIndex);
});

/**MOUSELEAVE - Mouse leaves the drop down menue*/
searchDropdown.addEventListener("mouseleave", () => {
  currentIndex = -1;
  if (currentResults.length === 0) {
    return;
  }
  renderDropdown(currentResults, currentIndex);
});

/**Restores last veiwed weather after a page reload*/
const savedCity = localStorage.getItem("saveWeather");
if (savedCity === null) {
  weatherList.innerHTML = `
  <div class="weather-panel welcome-panel panel-bg-cloud-sun">
    <i data-lucide="cloud-sun-rain" class="start-icon"></i>
    <p>Search for a city to see the weather</p>
    </div>`;
  hourlyToggle.hidden = true;
} else {
  const parsed = JSON.parse(savedCity);
  renderWeather(parsed.city, parsed.weather);
  renderForecast(parsed.weather, getTodayIndex());
  renderHourly(getHoursForDay(parsed.weather, getTodayIndex()));
  currentCity = parsed.city;
  currentWeather = parsed.weather;
}
renderSavedCities();
renderIcons();
