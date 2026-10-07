import { initSearch } from "./events/searchEvents";
import { initForecast } from "./events/forecastEvents";
import { initSavedCities } from "./events/savedCitiesEvent";
import { initApp } from "./appStartup";

initSearch();
initForecast();
initSavedCities();
initApp();
