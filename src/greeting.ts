import { getWeatherDetails } from "./data/weatherData";

const greetingByHour = () => {
  const hour = new Date().getHours();
  if (hour < 5) return "Still up?";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening!";
};

export const showGreeting = () => {
  const greetingText = document.getElementById("greetingText");
  if (greetingText) {
    greetingText.textContent = greetingByHour();
  }
};

const weatherSubtexts: Record<string, string> = {
  sun: "Seems like the sun will shine today!",
  "cloud-sun": "Today will bring some clouds... And sun!",
  cloud: "Behind those clouds their is a sun... I think...",
  "cloud-fog": "A bit harder to see today...",
  "cloud-drizzle": "Look out for some smaller drops today...",
  "cloud-hail": "No snow, just frozen balls of rain...",
  "cloud-rain": "A little rain never hurted no one...",
  "cloud-rain-wind": "No need to wather the plants today...",
  "cloud-snow": "Look, it´s snowing!",
  snowflake: "Do you wanna build a Snowman?",
  "cloud-lightning": "Best to stay inside today and get cosy...",
  "circle-off": "Uh-oh... Unknown weather...",
};

export const getWeatherSubtext = (weatherCode: number): string => {
  const details = getWeatherDetails(weatherCode);
  return weatherSubtexts[details.icon] ?? "Time to check out some weather?";
};

export const updateGreetingSubtext = (weatherCode: number) => {
  console.log("updateGreetingSubtext called with", weatherCode);
  const subText = document.getElementById("greetingSubtext");
  if (subText) {
    subText.textContent = getWeatherSubtext(weatherCode);
  }
};
