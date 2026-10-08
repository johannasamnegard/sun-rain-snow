import { animationToggle } from "../dom";
import type { City } from "./types";

const savedCitiesKey = "savedCities";
const animationsEnabledKey = "animationsEnabled";

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

export function getAnimationEnabled(): boolean {
  const stored = localStorage.getItem(animationsEnabledKey);

  if (stored === null) {
    return true;
  }
  return stored === "true";
}

export function setAnimationsEnabled(enabled: boolean): void {
  localStorage.setItem(animationsEnabledKey, String(enabled));
}
