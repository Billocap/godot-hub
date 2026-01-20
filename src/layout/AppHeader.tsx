import { getVersion } from "@tauri-apps/api/app";
import { useEffect, useState } from "react";

import Badge from "@/components/Badge";
import { useSideBar } from "@/hooks/useSideBar";
import { useTheme } from "@/hooks/useTheme";

export default function AppHeader() {
  const { collapsed } = useSideBar();
  const { theme } = useTheme();

  const [version, setVersion] = useState("");

  useEffect(() => {
    getVersion().then(setVersion);
  }, []);

  return (
    <div
      className="app-header"
      data-collapsed={collapsed ? true : undefined}
    >
      <img
        src={`/assets/logo-${theme}.png`}
        className="logo"
      />
      <div className="text">
        <span className="hidden lg:inline">Godot </span>
        Hub
        <Badge className="font-normal">v{version}</Badge>
      </div>
    </div>
  );
}
