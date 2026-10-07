import type { City } from "../data/types";
import { renderIcons } from "../icons";
import { getSavedCities } from "../data/storage";
import { searchDropdown } from "../dom";

/**DROPDOWN - Mapping the city data to html - ul element*/
const cityList = (cities: City[], currentIndex: number) => {
  return `<ul class="search-result-list">${cities.map((city, index) => listItem(city, index, currentIndex)).join("")}</ul>`;
};

/**DROPDOWN - Creating the HTML for each city item and highlightning*/
const listItem = (city: City, index: number, currentIndex: number) => {
  const cssClass =
    index === currentIndex ? "city-item highlighted" : "city-item";
  const cityLabel = city.admin1
    ? `${city.name}, ${city.admin1}, ${city.country}`
    : `${city.name}, ${city.country}`;

  const isSaved = getSavedCities().some(
    (saved) =>
      saved.latitude === city.latitude && saved.longitude === city.longitude,
  );
  const savedButtonClass = isSaved
    ? "save-search-city-button saved"
    : "save-search-city-button";

  return `
        <li data-index="${index}" class="${cssClass}">
        <button type="button" 
        data-lat="${city.latitude}" data-lon="${city.longitude}" class="city-select-button">
        <i data-lucide="map-pin" class="map-pin-icon"></i>
        ${cityLabel} </button>
        <button type="button" class="${savedButtonClass}" aria-pressed="${isSaved}" data-lat="${city.latitude}" data-lon="${city.longitude}"><i data-lucide="heart" class="save-search-city-icon"></i></button>
        </li>
    `;
};

/**DROPDOWN - Reuses in every dropdown*/
export const renderDropdown = (
  currentResults: City[],
  currentIndex: number,
) => {
  searchDropdown.innerHTML = cityList(currentResults, currentIndex);
  renderIcons();
};
