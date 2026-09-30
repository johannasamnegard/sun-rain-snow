export interface City {
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperature: number;
  feelslike: number;
  weathercode: number;
  windspeed: number;
  winddirection: number;
  rain: number;
  sunrise: string;
  sunset: string;
  tempMax: number;
  tempMin: number;
  forecast: DailyForecast;
  hourly: HourlyForecast;
}

export interface DailyForecast {
  time: string[];
  weathercode: number[];
  tempMax: number[];
  tempMin: number[];
  sunrise: string[];
  sunset: string[];
  feelslikemax: number[];
  feelslikemin: number[];
  rain: number[];
  windspeed: number[];
  winddirection: number[];
}

export interface HourlyForecast {
  time: string[];
  weathercode: number[];
  temperature: number[];
  feelslike: number[];
  rain: number[];
  windspeed: number[];
  winddirection: number[];
}

export interface WeatherDetails {
  text: string;
  icon: string;
}
