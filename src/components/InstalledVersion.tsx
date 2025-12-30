import { invoke } from "@tauri-apps/api/core";
import { openPath } from "@tauri-apps/plugin-opener";
import { FolderIcon, Trash2Icon } from "lucide-react";
import moment from "moment";

import GodotLogo from "../assets/godot-dark.svg?react";

import Button from "./Button";

interface InstalledVersionProps {
  id: number;
  version: any;
  onUpdate(): void;
}

export default function InstalledVersion({
  id,
  version,
  onUpdate,
}: InstalledVersionProps) {
  return (
    <div className="flex items-center justify-between p-2 transition-colors hover:bg-gray-200/50 rounded-lg">
      {/* Version Info */}
      <div className="flex flex-col items-stretch gap-1">
        <span
          className="cursor-pointer flex items-center gap-1 w-fit"
          onClick={() => openPath(version.path)}
        >
          <FolderIcon
            size={12}
            className="text-gray-500"
          />
          {version.name}
        </span>
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <span>{moment(version.created_at).format("HH:mm MM/DD/YYYY")}</span>
        </div>
      </div>
      {/* Version Info */}
      <div className="flex items-center gap-2">
        <Button
          onClick={() => {
            invoke("get_editor", { id }).then(console.log);
          }}
        >
          <GodotLogo className="size-4 text-gray-500" />
          Open Editor
        </Button>
        <Button
          className="text-red-500 hover:bg-red-500/10"
          onClick={() => {
            invoke("remove_version", { id }).finally(onUpdate);
          }}
        >
          <Trash2Icon size={16} />
          Delete Folder
        </Button>
      </div>
    </div>
  );
}
