import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { openPath } from "@tauri-apps/plugin-opener";
import { arch, platform } from "@tauri-apps/plugin-os";
import { BookIcon, FolderIcon, FolderPlusIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { When } from "react-if";

import AvailableVersion from "../components/AvailabelVersion";
import Button from "../components/Button";
import InstalledVersion from "../components/InstalledVersion";
import AppPage from "../layout/AppPage";
import octokit from "../services/octokit";

const repo = {
  owner: "godotengine",
  repo: "godot",
};

interface VersionPageProps {
  defaultFolder: string;
}

export default function VersionPage({ defaultFolder = "" }: VersionPageProps) {
  const [versions, setVersions] = useState<any[]>([]);
  const [installedVersions, setInstalledVersions] = useState<any[]>([]);
  const [currentFolder, setCurrentFolder] = useState(defaultFolder);

  const currentPlatform = useMemo(() => {
    const p = platform();

    switch (p) {
      case "windows":
        return "win";

      case "macos":
        return "osx";

      default:
        return p;
    }
  }, []);

  const currentArch = useMemo(() => {
    const a = arch();
    const p = currentPlatform;

    switch (a) {
      case "x86":
        return `${p}32`;

      case "x86_64":
        return `${p}64`;

      case "arm":
        return "arm64";

      default:
        return "";
    }
  }, [currentPlatform]);

  const chooseDirectory = useCallback(async () => {
    const folder = await open({
      directory: true,
    });

    if (folder) {
      invoke("update_settings", {
        settings: {
          versions_folder: folder,
        },
      });

      setCurrentFolder(folder as string);
    }
  }, [currentFolder]);

  useEffect(() => {
    octokit.repos
      .listReleases({ ...repo, page: 1 })
      .then((res) => setVersions(res.data));
  }, []);

  useEffect(() => {
    if (currentFolder) {
      invoke<any[]>("list_versions").then((installedVersions) => {
        setInstalledVersions(installedVersions);
      });
    }
  }, [currentFolder]);

  return (
    <AppPage
      icon={() => <BookIcon />}
      title="Version Manager"
      headerChildren={() => (
        <div className="flex items-center gap-4 justify-between">
          <span
            className="flex items-center gap-1 w-full whitespace-nowrap overflow-hidden cursor-pointer"
            onClick={() => {
              if (currentFolder) openPath(currentFolder);
            }}
          >
            <span className="hidden lg:inline">Current Folder:</span>
            <span className="inline lg:hidden">
              <FolderIcon
                size={16}
                className="text-gray-400"
              />
            </span>
            <span className="text-gray-500 overflow-hidden text-ellipsis">
              {currentFolder}
            </span>
          </span>
          <Button
            className="bg-gray-900 text-gray-100 hover:bg-gray-700"
            onClick={() => {
              chooseDirectory();
            }}
          >
            <FolderPlusIcon
              size={16}
              strokeWidth={2.5}
            />
            Select Folder
          </Button>
        </div>
      )}
    >
      <When condition={currentFolder.length}>
        <div className="flex flex-col items-stretch gap-2">
          <p className="text-2xl border-b">Installed Versions</p>
          {installedVersions.map((version, id) => (
            <InstalledVersion
              key={version.name}
              id={id}
              version={version}
              onUpdate={() => {
                invoke<any[]>("list_versions").then((installedVersions) => {
                  setInstalledVersions(installedVersions);
                });
              }}
            />
          ))}
        </div>
      </When>
      <div className="flex flex-col items-stretch gap-2">
        <p className="text-2xl border-b">Available Versions</p>
        {versions.map((version) => (
          <When
            key={version.id}
            condition={version.name}
          >
            <AvailableVersion
              version={version}
              platform={currentPlatform}
              arch={currentArch}
              onDownloaded={() => {
                invoke<any[]>("list_versions").then((installedVersions) => {
                  setInstalledVersions(installedVersions);
                });
              }}
            />
          </When>
        ))}
      </div>
    </AppPage>
  );
}
