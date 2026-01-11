import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { openPath } from "@tauri-apps/plugin-opener";
import { CopyIcon, FolderCheckIcon, FolderIcon, PlayIcon } from "lucide-react";

import Button from "@/components/Button";
import Tooltip from "@/components/Tooltip";
import { useVersions } from "@/hooks/controllers/useVersions";
import AppPage from "@/layout/AppPage";
import VersionsHandler from "@/handler/VersionsHandler";

export default function InstalledPage() {
  const { installedVersions } = useVersions();

  return (
    <AppPage
      icon={FolderCheckIcon}
      title="Installed Versions"
      description="Manage the Godot versions you have installed."
    >
      {installedVersions.map((version) => (
        <AppPage.Section key={version.id}>
          <h2>
            <FolderIcon /> {version.name}
          </h2>
          <div className="flex items-center gap-2">
            <div className="w-full flex flex-col items-stretch gap-1">
              <Tooltip
                position="right"
                tooltip="Click to copy"
                className="text-slate-500 text-xs w-fit cursor-pointer"
                onClick={() => {
                  writeText(version.path);
                }}
              >
                Location: {version.path}
              </Tooltip>
              <div className="flex items-center gap-1">
                <Button
                  size="tiny"
                  variant="secondary"
                  onClick={() => {
                    writeText(version.editorPath);
                  }}
                >
                  <CopyIcon size={12} />
                  Copy Editor Path
                </Button>
                <Button
                  size="tiny"
                  variant="secondary"
                  onClick={() => {
                    writeText(version.consolePath);
                  }}
                >
                  <CopyIcon size={12} />
                  Copy Console Path
                </Button>
              </div>
              <div className="text-slate-500 text-xs flex items-center gap-2">
                <span>Created at: {version.createdAt}</span>
                <span>Updated at: {version.updatedAt}</span>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                openPath(version.path);
              }}
            >
              <FolderIcon size={16} /> Open Folder
            </Button>
            <Button
              onClick={() => {
                VersionsHandler.runEditor(version.id);
              }}
            >
              <PlayIcon size={16} /> Start Editor
            </Button>
          </div>
        </AppPage.Section>
      ))}
    </AppPage>
  );
}
