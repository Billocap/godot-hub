import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { openPath } from "@tauri-apps/plugin-opener";
import { filesize } from "filesize";
import { CopyIcon, FolderIcon, Trash2Icon } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { Else, If, Then, Unless } from "react-if";

import GodotLogo from "@/assets/godot-dark.svg?react";
import VersionController from "@/controllers/VersionController";
import VersionsHandler from "@/handler/VersionsHandler";

import Badge from "./Badge";
import Button from "./Button";
import Spinner from "./Spinner";

interface InstalledVersionProps {
  version: VersionController;
  onUpdate(): void;
}

export default function InstalledVersion({
  version,
  onUpdate,
}: InstalledVersionProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="overflow-hidden flex items-center justify-between p-2 transition-colors rounded-lg gap-2">
      {/* Version Info */}
      <div className="flex flex-col items-stretch gap-1 overflow-hidden">
        <span
          data-cy-version-name
          className="cursor-pointer flex items-center gap-1 w-fit"
          onClick={() => openPath(version.path)}
        >
          <FolderIcon
            size={12}
            className="text-slate-500"
          />
          {version.name}
          <Badge>{filesize(version.size)}</Badge>
        </span>
        <span className="text-xs flex items-center gap-1">
          <Button
            size="tiny"
            variant="secondary"
            onClick={() => {
              writeText(version.editorPath);
            }}
          >
            <CopyIcon size={12} /> Editor Path
          </Button>
          <Button
            size="tiny"
            variant="secondary"
            onClick={() => {
              writeText(version.consolePath);
            }}
          >
            <CopyIcon size={12} /> Console Path
          </Button>
        </span>
        <div
          data-cy-location
          className="text-xs text-slate-500 flex items-center gap-1 text-ellipsis whitespace-nowrap"
        >
          {version.path}
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1">
          <span>
            Created at: {moment(version.createdAt).format("HH:mm MM/DD/YYYY")}
          </span>
        </div>
      </div>
      {/* Version Info */}
      <div className="flex items-center gap-2">
        <Unless condition={isDeleting}>
          <Button
            variant="secondary"
            disabled={isDeleting}
            onClick={() => {
              VersionsHandler.runEditor(version.id);
            }}
          >
            <GodotLogo className="icon size-4" />
            Open Editor
          </Button>
        </Unless>
        <Button
          variant="destructive"
          disabled={isDeleting}
          onClick={() => {
            setIsDeleting(true);

            VersionsHandler.uninstallVersion(version.id)
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
              <Spinner className="size-4" />
            </Then>
            <Else>
              <Trash2Icon size={16} />
            </Else>
          </If>
          Delete Folder
        </Button>
      </div>
    </div>
  );
}
