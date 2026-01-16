import { SiGodotengine } from "@icons-pack/react-simple-icons";
import { getVersion } from "@tauri-apps/api/app";
import { useEffect, useState } from "react";

import Badge from "@/components/Badge";
import { useSideBar } from "@/hooks/useSideBar";

export default function AppHeader() {
  const { collapsed } = useSideBar();

  const [version, setVersion] = useState("");

  useEffect(() => {
    getVersion().then(setVersion);
  }, []);

  return (
    <div
      className="app-header"
      data-collapsed={collapsed ? true : undefined}
    >
      <SiGodotengine className="logo" />
      <div className="text">
        <span className="hidden lg:inline">Godot </span>
        Hub
        <Badge className="font-normal">v{version}</Badge>
      </div>
    </div>
  );
}
