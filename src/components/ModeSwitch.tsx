import { MoonStarIcon, SunIcon } from "lucide-react";
import { useEffect } from "react";

export default function ModeSwitch() {
  const toggleMode = (theme = "dark") => {
    document.body.dataset.theme = theme;

    localStorage.setItem("theme", theme);
  };

  useEffect(() => {
    toggleMode(localStorage.getItem("theme") ?? "dark");
  }, []);

  return (
    <div
      className="mode-switch"
      onClick={() => {
        const theme = localStorage.getItem("theme");

        toggleMode(theme === "dark" ? "light" : "dark");
      }}
    >
      <div className="swatch" />
      <div className="icon">
        <SunIcon size={12} />
      </div>
      <div className="icon">
        <MoonStarIcon size={12} />
      </div>
    </div>
  );
}
