import type { City, CurrentWeather } from "./types";

const urlSearch = "https://geocoding-api.open-meteo.com/v1/search?name=";
const urlWeather =
  "https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m,precipitation,weather_code,relative_humidity_2m,apparent_temperature&daily=weather_code,sunrise,sunset,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant&past_days={past}&forecast_days={forecast}&timezone=auto&hourly=temperature_2m,weather_code,apparent_temperature,precipitation,wind_speed_10m,wind_direction_10m"; //WEATHER - Fetching weather data from API

/** Calculating how many days it is since monday */
export function getTodayIndex() {
  return (new Date().getDay() + 6) % 7;
}

/** FETCHING all the data. forecastDays counts 7 days minus(-) days already passed */
export async function getWeather(
  latitude: number,
  longitude: number,
): Promise<CurrentWeather> {
  const pastDays = getTodayIndex();
  const forecastDays = 7 - getTodayIndex();

  const response = await fetch(
    urlWeather
      .replace("{lat}", latitude.toString())
      .replace("{lon}", longitude.toString())
      .replace("{past}", pastDays.toString())
      .replace("{forecast}", forecastDays.toString()),
  );
  const data = await response.json();

  return {
    temperature: data.current.temperature_2m,
    feelslike: data.current.apparent_temperature,
    weathercode: data.current.weather_code,
    windspeed: data.current.wind_speed_10m,
    winddirection: data.current.wind_direction_10m,
    rain: data.current.precipitation,
    sunrise: data.daily.sunrise[0],
    sunset: data.daily.sunset[0],
    tempMax: data.daily.temperature_2m_max[0],
    tempMin: data.daily.temperature_2m_min[0],
    hourly: {
      time: data.hourly.time,
      weathercode: data.hourly.weather_code,
      temperature: data.hourly.temperature_2m,
      feelslike: data.hourly.apparent_temperature,
      rain: data.hourly.precipitation,
      windspeed: data.hourly.wind_speed_10m,
      winddirection: data.hourly.wind_direction_10m,
    },
    forecast: {
      time: data.daily.time,
      weathercode: data.daily.weather_code,
      tempMax: data.daily.temperature_2m_max,
      tempMin: data.daily.temperature_2m_min,
      sunrise: data.daily.sunrise,
      sunset: data.daily.sunset,
      feelslikemax: data.daily.apparent_temperature_max,
      feelslikemin: data.daily.apparent_temperature_min,
      rain: data.daily.precipitation_sum,
      windspeed: data.daily.wind_speed_10m_max,
      winddirection: data.daily.wind_direction_10m_dominant,
    },
  };
}

/** CITY - Fetching cities from API */
export async function getCity(city: string): Promise<City[]> {
  try {
    const response = await fetch(urlSearch + encodeURIComponent(city));
    const data = await response.json();
    return data.results ?? [];
  } catch (error) {
    console.error("Error when fetching the city:", error);
    return [];
  }
}
