import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { openPath } from "@tauri-apps/plugin-opener";
import { platform } from "@tauri-apps/plugin-os";
import { filesize } from "filesize";
import { FolderCheckIcon, FolderIcon, PlayIcon } from "lucide-react";
import { default as nodePath } from "path-browserify";
import { useCallback } from "react";

import Button from "@/components/Button";
import TooltipContainer from "@/components/Tooltip";
import VersionsHandler from "@/handler/VersionsHandler";
import { useVersions } from "@/hooks/controllers/useVersions";
import AppPage from "@/layout/AppPage";

export default function InstalledPage() {
  const { installedVersions } = useVersions();

  const currentPlatform = platform();

  const basename = useCallback(
    (p: string) => {
      const path = p.replace(/\\/g, "/");

      return nodePath.basename(path);
    },
    [currentPlatform],
  );

  return (
    <AppPage
      icon={FolderCheckIcon}
      title="Installed Versions"
      description="Detailed information about the Godot versions you have installed."
    >
      {installedVersions.map((version) => (
        <AppPage.Section key={version.id}>
          <h2>
            <FolderIcon /> {version.name}
          </h2>
          <div className="flex items-center gap-2">
            <div className="text-slate-500 text-xs w-full flex flex-col items-stretch gap-1 overflow-hidden">
              <div className="w-fit overflow-hidden text-ellipsis whitespace-nowrap">
                Size: {filesize(version.size)}
              </div>
              <TooltipContainer
                position="right"
                tooltip="Click to copy"
                className="w-fit cursor-pointer max-w-full text-ellipsis whitespace-nowrap"
                onClick={() => {
                  writeText(version.path);
                }}
              >
                Location: {version.path}
              </TooltipContainer>
              <TooltipContainer
                position="right"
                tooltip="Click to copy"
                className="w-fit cursor-pointer max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                onClick={() => {
                  writeText(version.editorPath);
                }}
              >
                Editor: {basename(version.editorPath)}
              </TooltipContainer>
              <TooltipContainer
                position="right"
                tooltip="Click to copy"
                className="w-fit cursor-pointer max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                onClick={() => {
                  writeText(version.consolePath);
                }}
              >
                Console: {basename(version.consolePath)}
              </TooltipContainer>
              <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
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
