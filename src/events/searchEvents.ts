import {
  searchForm,
  searchDropdown,
  searchInput,
  maxCitiesDialog,
} from "../dom";
import { getSavedCities, saveCities } from "../data/storage";
import { getWeather, getCity } from "../data/api";
import { renderDropdown } from "../render/renderDropdown";
import { renderSavedCities } from "../render/renderSavedCities";
import { appState } from "../state";
import { showWeather } from "../weatherController";

export const initSearch = () => {
  /** Empties the search input */
  const clearSearchInput = () => {
    searchInput.value = "";
    searchDropdown.innerHTML = "";
    appState.currentResults = [];
    appState.currentIndex = -1;
  };

  /** INPUT - Message while searching */
  const showSearchMessage = (message: string) => {
    searchDropdown.innerHTML = `<p class="search-message">${message}</p>`;
  };

  /** INPUT - CONTINUE THE SEARCH - handler for the live input-event*/
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

    appState.currentResults = await getCity(query);

    if (appState.currentResults.length === 0) {
      showSearchMessage("No cities found.");
      return;
    }
    appState.currentIndex = 0;
    renderDropdown(appState.currentResults, appState.currentIndex);
  };

  /**INPUT - Search field*/
  searchInput.addEventListener("input", async (event) => {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }
    await continueCitySearch(searchInput.value.trim());
  });

  /**DROPDOWN KEYS - Arrowing through the drop down menu - search with enter key - escape with "Esc"*/
  searchInput.addEventListener("keydown", async (event) => {
    if (event.key === "ArrowDown") {
      appState.currentIndex += 1;
      if (appState.currentIndex > appState.currentResults.length - 1) {
        appState.currentIndex = appState.currentResults.length - 1;
      }
    } else if (event.key === "ArrowUp") {
      appState.currentIndex -= 1;
      if (appState.currentIndex < -1) {
        appState.currentIndex = -1;
      }
    } else if (event.key === "Enter") {
      if (appState.currentIndex < 0) {
        appState.currentIndex = 0;
      }
      event.preventDefault();
      const selectedCity = appState.currentResults[appState.currentIndex];
      const weather = await getWeather(
        selectedCity.latitude,
        selectedCity.longitude,
      );
      showWeather(selectedCity, weather);

      clearSearchInput();
      return;
    } else if (event.key === "Escape") {
      searchDropdown.innerHTML = "";
      appState.currentResults = [];
      appState.currentIndex = -1;
      return;
    } else {
      return;
    }
    event.preventDefault();
    renderDropdown(appState.currentResults, appState.currentIndex);
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

    showWeather(selectedCity, weather);
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

      const savedCity = appState.currentResults.find(
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
      renderDropdown(appState.currentResults, appState.currentIndex);
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

    const selectedCity = appState.currentResults.find(
      (city) => city.latitude === latitude && city.longitude === longitude,
    );
    if (!selectedCity) {
      showSearchMessage("City not found.");
      return;
    }
    showWeather(selectedCity, weather);

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
      appState.currentResults = [];
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
    if (Number.isNaN(index) || index === appState.currentIndex) return;

    appState.currentIndex = index;

    renderDropdown(appState.currentResults, appState.currentIndex);
  });

  /**MOUSELEAVE - Mouse leaves the drop down menue*/
  searchDropdown.addEventListener("mouseleave", () => {
    appState.currentIndex = -1;
    if (appState.currentResults.length === 0) {
      return;
    }
    renderDropdown(appState.currentResults, appState.currentIndex);
  });
};
