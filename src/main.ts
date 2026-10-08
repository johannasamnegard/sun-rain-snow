import { initSearch } from "./events/searchEvents";
import { initForecast } from "./events/forecastEvents";
import { initSavedCities } from "./events/savedCitiesEvent";
import { initApp } from "./appStartup";
import { initAnimationToggle } from "./events/animationToggleEvent";

initSearch();
initForecast();
initSavedCities();
initApp();
initAnimationToggle();
