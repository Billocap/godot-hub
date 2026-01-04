import { open } from "@tauri-apps/plugin-dialog";
import { openPath } from "@tauri-apps/plugin-opener";
import { arch, platform } from "@tauri-apps/plugin-os";
import {
  BookIcon,
  FolderIcon,
  FolderPlusIcon,
  RefreshCwIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { When } from "react-if";

import AvailableVersion from "../components/AvailabelVersion";
import Button from "../components/Button";
import DownloadingVersion from "../components/DownloadingVersion";
import InstalledVersion from "../components/InstalledVersion";
import { useSettings } from "../hooks/controllers/useSettings";
import { useVersions } from "../hooks/controllers/useVersions";
import useBodyScroll from "../hooks/useBodyScroll";
import AppPage from "../layout/AppPage";
import octokit from "../services/octokit";

const repo = {
  owner: "godotengine",
  repo: "godot",
};

interface Pagination {
  page: number;
  canPaginate: boolean;
}

export default function VersionPage() {
  const { settings, dispatchSettings } = useSettings();
  const { installing, installedVersions, updateInstalled } = useVersions();

  const [isLoading, setIsLoading] = useState(true);
  const [versions, setVersions] = useState<any[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    canPaginate: true,
  });

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

  const fetchVersions = async (page = 1) => {
    setIsLoading(true);

    const { data, headers } = await octokit.repos.listReleases({
      ...repo,
      page,
    });

    setPagination({
      page,
      canPaginate: headers.link?.includes('rel="next"') ?? false,
    });

    setVersions((prev) => (page > 1 ? [...prev, ...data] : data));

    setIsLoading(false);
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  useBodyScroll(
    {
      canListen: !isLoading && pagination.canPaginate,
      handler(e) {
        if (!isLoading && pagination.canPaginate) {
          const target = e.target as HTMLDivElement;
          const scrollHeight = target.scrollHeight - target.clientHeight - 500;

          if (target.scrollTop >= scrollHeight) {
            fetchVersions(pagination.page + 1);
          }
        }
      },
    },
    [isLoading, pagination]
  );

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
          <h2>Install Queue</h2>
          {Object.entries(installing).map(([id, v]) => (
            <DownloadingVersion
              key={id}
              version={v}
            />
          ))}
        </div>
      </When>
      <When
        condition={
          settings.versionsFolder.length != 0 && installedVersions.length != 0
        }
      >
        <div className="flex flex-col items-stretch gap-2">
          <h2>Installed Versions</h2>
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
        <h2 className="flex items-center justify-between">
          Available Versions
          <Button
            className="px-2 py-1 hover:bg-gray-200 text-xs"
            onClick={() => {
              fetchVersions();
            }}
          >
            <RefreshCwIcon size={12} />
            Refresh
          </Button>
        </h2>
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
        <When condition={isLoading}>
          {new Array(30).fill(0).map((_, id) => (
            <AvailableVersion.Skeleton key={id} />
          ))}
        </When>
      </div>
    </AppPage>
  );
}
