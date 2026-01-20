import { MoonStarIcon, SunIcon } from "lucide-react";

import { useTheme } from "@/hooks/useTheme";
import classList from "@/utils/classList";

interface ModeSwitchProps {
  className?: string;
}

export default function ModeSwitch({ className }: ModeSwitchProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={classList("mode-switch", className)}
      onClick={() => {
        toggleTheme(theme === "dark" ? "light" : "dark");
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
