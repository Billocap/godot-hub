import GodotLogo from "../assets/godot-dark.svg?react";

import { useSideBar } from "@/hooks/useSideBar";
import Badge from "@/components/Badge";

export default function AppHeader() {
  const { collapsed } = useSideBar();

  return (
    <div
      className="app-header"
      data-collapsed={collapsed ? true : undefined}
    >
      <GodotLogo className="logo" />
      <div
        className="text"
        style={{
          lineHeight: 1,
        }}
      >
        <span className="hidden lg:inline">Godot </span>
        Hub
        <Badge>v0.1.0</Badge>
      </div>
    </div>
  );
}
