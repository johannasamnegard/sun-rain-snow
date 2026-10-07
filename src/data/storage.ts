import type { City } from "./types";

const savedCitiesKey = "savedCities";

/**SAVING - Reads an array of saved cities*/
export function getSavedCities(): City[] {
  const storedCities = localStorage.getItem(savedCitiesKey);

  if (!storedCities) {
    return [];
  }
  return JSON.parse(storedCities);
}

/**SAVING - Writes getSavedCities array back to localStorage*/
export function saveCities(cities: City[]): void {
  localStorage.setItem(savedCitiesKey, JSON.stringify(cities));
}
