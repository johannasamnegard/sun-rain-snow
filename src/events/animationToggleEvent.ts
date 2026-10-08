import { animationToggle } from "../dom";
import { renderIcons } from "../icons";
import { getAnimationEnabled, setAnimationsEnabled } from "../data/storage";

function applyAnimationState(enabled: boolean) {
  document.body.classList.toggle("motion-paused", !enabled);
  animationToggle.setAttribute("aria-pressed", String(!enabled));
  animationToggle.setAttribute(
    "aria-label",
    enabled ? "Pause background animations" : "Resume background animations",
  );
  animationToggle
    .querySelector("[data-lucide]")
    ?.setAttribute("data-lucide", enabled ? "pause" : "play");
}
export const initAnimationToggle = () => {
  document.body.classList.toggle("motion-paused", !getAnimationEnabled());

  animationToggle.addEventListener("click", () => {
    const next = !getAnimationEnabled();
    setAnimationsEnabled(next);
    applyAnimationState(next);
    renderIcons();
  });
};
