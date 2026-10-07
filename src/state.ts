import type { City, CurrentWeather } from "./data/types";

/** Index enables to arowing up and down in the drop down */

export const appState = {
  currentIndex: 0,
  currentResults: [] as City[],
  currentCity: null as City | null,
  currentWeather: null as CurrentWeather | null,
};
