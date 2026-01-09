import { MoonStarIcon, SunIcon } from "lucide-react";
import { useEffect } from "react";

import classList from "@/utils/classList";

interface ModeSwitchProps {
  className?: string;
}

export default function ModeSwitch({ className }: ModeSwitchProps) {
  const toggleMode = (theme = "dark") => {
    document.body.dataset.theme = theme;

    localStorage.setItem("theme", theme);
  };

  useEffect(() => {
    const theme = localStorage.getItem("theme");

    if (theme === null) {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      toggleMode(isDark ? "dark" : "light");
    } else {
      toggleMode(theme);
    }
  }, []);

  return (
    <div
      className={classList("mode-switch", className)}
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
