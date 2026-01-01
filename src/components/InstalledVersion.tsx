import { invoke } from "@tauri-apps/api/core";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { openPath } from "@tauri-apps/plugin-opener";
import { filesize } from "filesize";
import { CopyIcon, FolderIcon, Trash2Icon } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { Else, If, Then, Unless } from "react-if";

import GodotLogo from "../assets/godot-dark.svg?react";
import VersionController from "../controllers/VersionController";

import Badge from "./Badge";
import Button from "./Button";
import Spinner from "./Spinner";

interface InstalledVersionProps {
  id: number;
  version: VersionController;
  onUpdate(): void;
}

export default function InstalledVersion({
  id,
  version,
  onUpdate,
}: InstalledVersionProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="overflow-hidden flex items-center justify-between p-2 transition-colors border border-transparent hover:bg-gray-200/25 hover:border-gray-200 rounded-lg">
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
          <Badge>{filesize(version.size)}</Badge>
        </span>
        <span className="text-xs flex items-center gap-1">
          <Badge
            className="cursor-pointer"
            onClick={() => {
              writeText(version.editorPath);
            }}
          >
            <CopyIcon size={12} /> Editor Path
          </Badge>
          <Badge
            className="cursor-pointer"
            onClick={() => {
              writeText(version.consolePath);
            }}
          >
            <CopyIcon size={12} /> Console Path
          </Badge>
        </span>
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <span>
            Created at: {moment(version.createdAt).format("HH:mm MM/DD/YYYY")}
          </span>
        </div>
      </div>
      {/* Version Info */}
      <div className="flex items-center gap-2">
        <Unless condition={isDeleting}>
          <Button
            disabled={isDeleting}
            className="flex-col py-0 px-2 text-xs"
            onClick={() => {
              invoke("start_editor", { id });
            }}
          >
            <GodotLogo className="size-6 text-gray-500" />
            Open Editor
          </Button>
        </Unless>
        <Button
          disabled={isDeleting}
          className="flex-col py-0 px-2 text-xs text-red-500"
          onClick={() => {
            setIsDeleting(true);

            invoke("remove_version", { id })
              .catch((_) => {
                setIsDeleting(false);
              })
              .finally(() => {
                onUpdate();
              });
          }}
        >
          <If condition={isDeleting}>
            <Then>
              <Spinner className="size-6" />
            </Then>
            <Else>
              <Trash2Icon size={24} />
            </Else>
          </If>
          Delete Folder
        </Button>
      </div>
    </div>
  );
}
