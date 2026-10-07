import { weatherEffects } from "./dom";
import { getWeatherDetails } from "./data/weatherData";

interface RainIntensity {
  count: number;
  minDuration: number;
  maxDuration: number;
  driftX: number;
  rotate: number;
  hasLightning: boolean;
}

const snowIcons = ["cloud-snow", "snowflake"];
const cloudIcons = ["cloud", "cloud-fog"];
const rainIcons = [
  "cloud-drizzle",
  "cloud-rain",
  "cloud-hail",
  "cloud-rain-wind",
  "cloud-lightning",
];
const rainIntensity: Record<string, RainIntensity> = {
  "cloud-drizzle": {
    count: 20,
    minDuration: 1.2,
    maxDuration: 1.7,
    driftX: 0,
    rotate: 0,
    hasLightning: false,
  },
  "cloud-rain": {
    count: 20,
    minDuration: 1,
    maxDuration: 1.5,
    driftX: 0,
    rotate: 0,
    hasLightning: false,
  },
  "cloud-hail": {
    count: 40,
    minDuration: 0.7,
    maxDuration: 1.1,
    driftX: 0,
    rotate: 0,
    hasLightning: false,
  },
  "cloud-rain-wind": {
    count: 80,
    minDuration: 0.4,
    maxDuration: 0.6,
    driftX: 60,
    rotate: -7,
    hasLightning: false,
  },
  "cloud-lightning": {
    count: 100,
    minDuration: 0.3,
    maxDuration: 0.5,
    driftX: 80,
    rotate: -15,
    hasLightning: true,
  },
};
const sunIcons = ["sun", "cloud-sun"];

/* PARTICLES - SUN */
const renderParticles = () => {
  const particleCount = 25;
  const particle = Array.from({ length: particleCount }, () => {
    const left = Math.random() * 100;
    const duration = 20 + Math.random() * 6;
    const delay = -Math.random() * duration;
    const sway = (Math.random() - 0.5) * 60;
    return `<span class="particle" style="--left: ${left}%; --delay: ${delay}s; --duration: ${duration}s; --sway: ${sway}px"></span>`;
  }).join("");
  weatherEffects.innerHTML = particle;
};

/* PARTICLES - CLOUD */
const renderCloudDrift = () => {
  const cloudCount = 40;
  const cloud = Array.from({ length: cloudCount }, () => {
    const top = Math.random() * 100;
    const duration = 40 + Math.random() * 6;
    const delay = -Math.random() * duration;
    const sway = (Math.random() - 0.5) * 60;
    return `<span class="cloud-particle" style="--top: ${top}%; --delay: ${delay}s; --duration: ${duration}s; --sway: ${sway}px"></span>`;
  }).join("");
  weatherEffects.innerHTML = cloud;
};

/* RAIN */
const renderRain = ({
  count,
  minDuration,
  maxDuration,
  driftX,
  rotate,
  hasLightning,
}: RainIntensity) => {
  const drops = Array.from({ length: count }, () => {
    const left = Math.random() * 115 - 15;
    const duration = minDuration + Math.random() * (maxDuration - minDuration);
    const delay = Math.random() * 2;
    return `<span class="raindrop" style="--left: ${left}%; --delay: ${delay}s; --duration: ${duration}s; --driftX: ${driftX}px; --rotate: ${rotate}deg"></span>`;
  }).join("");
  const flash = hasLightning ? `<div class="lightning-flash"></div>` : "";
  weatherEffects.innerHTML = drops + flash;
};

/* SNOW */
const renderSnow = () => {
  const flakeCount = 35;
  const flakes = Array.from({ length: flakeCount }, () => {
    const left = Math.random() * 100;
    const duration = 8 + Math.random() * 7;
    const delay = -Math.random() * duration;
    const sway = (Math.random() - 0.5) * 60;
    return `<span class="snowflake" style="--left: ${left}%; --delay: ${delay}s; --duration: ${duration}s; --sway: ${sway}px"></span>`;
  }).join("");
  weatherEffects.innerHTML = flakes;
};

/** Decides which weather effect (if any) matches this weathercode, and renders it */
export const updateWeatherEffect = (weathercode: number) => {
  const description = getWeatherDetails(weathercode);
  if (rainIcons.includes(description.icon)) {
    renderRain(rainIntensity[description.icon]);
  } else if (snowIcons.includes(description.icon)) {
    renderSnow();
  } else if (sunIcons.includes(description.icon)) {
    renderParticles();
  } else if (cloudIcons.includes(description.icon)) {
    renderCloudDrift();
  } else {
    weatherEffects.innerHTML = "";
  }
};
