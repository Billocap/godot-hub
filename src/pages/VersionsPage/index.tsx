import { open } from "@tauri-apps/plugin-dialog";
import { openPath } from "@tauri-apps/plugin-opener";
import { arch, platform } from "@tauri-apps/plugin-os";
import {
  BookIcon,
  CircleAlertIcon,
  FolderCheckIcon,
  FolderClockIcon,
  FolderIcon,
  FolderSearchIcon,
  RefreshCwIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { When } from "react-if";

import Button from "@/components/Button";
import Callout from "@/components/Callout";
import Tooltip from "@/components/Tooltip";
import { useSettings } from "@/hooks/controllers/useSettings";
import { useVersions } from "@/hooks/controllers/useVersions";
import useBodyScroll from "@/hooks/useBodyScroll";
import AppPage from "@/layout/AppPage";
import octokit from "@/services/octokit";

import AvailableVersion from "./AvailableVersion";
import DownloadingVersion from "./DownloadingVersion";
import InstalledVersion from "./InstalledVersion";

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
      icon={BookIcon}
      title="Version Installer"
      description="Install different versions of Godot."
    >
      <AppPage.Section>
        <h2>
          <FolderIcon /> Installation Folder
        </h2>
        <Callout
          icon={CircleAlertIcon}
          title="Choose an installation folder."
          variant="blue"
        >
          It is recommended you keep all your Godot installs on the same folder.
        </Callout>
        <div className="flex items-center gap-4 justify-between">
          <Tooltip
            as="span"
            position="right"
            tooltip="Click to open"
            onClick={() => openPath(settings.versionsFolder)}
            className="flex items-center gap-1 whitespace-nowrap overflow-hidden cursor-pointer"
          >
            <FolderIcon size={16} />
            <span className="overflow-hidden text-ellipsis">
              {settings.versionsFolder}
            </span>
          </Tooltip>
          <Button
            size="small"
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
            <FolderSearchIcon size={14} />
            Select Folder
          </Button>
        </div>
      </AppPage.Section>
      <When condition={Object.entries(installing).length}>
        <AppPage.Section>
          <h2>
            <FolderClockIcon /> Install Queue
          </h2>
          {Object.entries(installing).map(([id, version]) => (
            <DownloadingVersion
              key={id}
              version={version}
            />
          ))}
        </AppPage.Section>
      </When>
      <When
        condition={
          settings.versionsFolder.length != 0 && installedVersions.length != 0
        }
      >
        <AppPage.Section>
          <h2>
            <FolderCheckIcon /> Installed Versions
          </h2>
          {installedVersions.map((version) => (
            <InstalledVersion
              key={version.key}
              version={version}
            />
          ))}
        </AppPage.Section>
      </When>
      <AppPage.Section>
        <h2>
          <BookIcon />
          <p className="w-full">Available Versions</p>
          <Button
            size="tiny"
            variant="secondary"
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
      </AppPage.Section>
    </AppPage>
  );
}
