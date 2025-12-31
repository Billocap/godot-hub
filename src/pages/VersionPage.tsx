import { open } from "@tauri-apps/plugin-dialog";
import { openPath } from "@tauri-apps/plugin-opener";
import { arch, platform } from "@tauri-apps/plugin-os";
import { BookIcon, FolderIcon, FolderPlusIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { When } from "react-if";

import AvailableVersion from "../components/AvailabelVersion";
import Button from "../components/Button";
import DownloadingVersion from "../components/DownloadingVersion";
import InstalledVersion from "../components/InstalledVersion";
import { useSettings } from "../hooks/useSettings";
import { useVersions } from "../hooks/useVersions";
import AppPage from "../layout/AppPage";
import octokit from "../services/octokit";

const repo = {
  owner: "godotengine",
  repo: "godot",
};

export default function VersionPage() {
  const { settings, dispatchSettings } = useSettings();
  const { installing, installedVersions, updateInstalled } = useVersions();

  const [versions, setVersions] = useState<any[]>([]);
  const [page, setPage] = useState(1);

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

  useEffect(() => {
    octokit.repos
      .listReleases({ ...repo, page })
      .then((res) => setVersions((prev) => [...prev, ...res.data]));
  }, [page]);

  return (
    <AppPage
      icon={() => <BookIcon />}
      title="Version Manager"
      headerChildren={() => (
        <div className="flex items-center gap-4 justify-between">
          <span
            className="flex items-center gap-1 w-full whitespace-nowrap overflow-hidden cursor-pointer"
            onClick={() => {
              openPath(settings.versionsFolder);
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
              {settings.versionsFolder}
            </span>
          </span>
          <Button
            className="bg-gray-900 text-gray-100 hover:bg-gray-700"
            onClick={async () => {
              const folder = await open({
                directory: true,
              });

              if (folder) {
                dispatchSettings(() => {
                  settings.versionsFolder = folder;
                }).finally(updateInstalled);
              }
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
      <When condition={Object.entries(installing).length}>
        <div className="flex flex-col items-stretch gap-2">
          <p className="text-2xl border-b">Installing Versions</p>
          {Object.entries(installing).map(([id, v]) => (
            <DownloadingVersion
              key={id}
              version={v}
            />
          ))}
        </div>
      </When>
      <When condition={settings.versionsFolder.length}>
        <div className="flex flex-col items-stretch gap-2">
          <p className="text-2xl border-b">Installed Versions</p>
          {installedVersions.map((version, id) => (
            <InstalledVersion
              key={version.key}
              id={id}
              version={version}
              onUpdate={() => {
                updateInstalled();
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
            />
          </When>
        ))}
      </div>
    </AppPage>
  );
}
