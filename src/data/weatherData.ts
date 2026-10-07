import type { WeatherDetails } from "./types";

/**WEATHER - Connecting weather-index to name and icon */
const weatherDescriptions: Record<number, WeatherDetails> = {
  0: { text: "Sunny", icon: "sun" },
  1: { text: "Mainly sunny", icon: "sun" },
  2: { text: "Partly cloudy", icon: "cloud-sun" },
  3: { text: "Cloudy", icon: "cloud" },
  45: { text: "Foggy", icon: "cloud-fog" },
  51: { text: "Light drizzle", icon: "cloud-drizzle" },
  53: { text: "Drizzle", icon: "cloud-drizzle" },
  55: { text: "Heavy drizzle", icon: "cloud-drizzle" },
  61: { text: "Light rain", icon: "cloud-hail" },
  63: { text: "Rain", icon: "cloud-rain" },
  65: { text: "Heavy rain", icon: "cloud-rain-wind" },
  71: { text: "Light snow", icon: "cloud-snow" },
  73: { text: "Snow", icon: "snowflake" },
  75: { text: "Heavy snow", icon: "snowflake" },
  80: { text: "Rain showers", icon: "cloud-rain-wind" },
  81: { text: "Rain showers", icon: "cloud-rain-wind" },
  82: { text: "Heavy rain showers", icon: "cloud-rain-wind" },
  95: { text: "Thunderstorm", icon: "cloud-lightning" },
};

/**WEATHER - Looks up text/icon for a weathercode, falls back to "unknown*/
export const getWeatherDetails = (weatherCode: number): WeatherDetails => {
  return (
    weatherDescriptions[weatherCode] ?? {
      text: "Unknown weather",
      icon: "circle-off",
    }
  );
};
