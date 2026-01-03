import GodotLogo from "../assets/godot-dark.svg?react";

import Badge from "../components/Badge";

export default function AppHeader() {
  return (
    <div className="app-header">
      <GodotLogo className="logo" />
      <div
        className="text"
        style={{
          lineHeight: 1,
        }}
      >
        <span className="hidden lg:inline">Godot </span>
        Hub
      </div>
      <Badge>v0.1.0</Badge>
    </div>
  );
}
