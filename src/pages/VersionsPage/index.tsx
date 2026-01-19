import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { open } from "@tauri-apps/plugin-dialog";
import { openPath } from "@tauri-apps/plugin-opener";
import { arch, platform } from "@tauri-apps/plugin-os";
import {
  BookIcon,
  BookmarkIcon,
  CircleAlertIcon,
  FolderCheckIcon,
  FolderClockIcon,
  FolderIcon,
  FolderSearchIcon,
  RefreshCwIcon,
} from "lucide-react";
import { useMemo } from "react";
import { Else, If, Then, When } from "react-if";

import Button from "@/components/Button";
import Callout from "@/components/Callout";
import TooltipContainer from "@/components/Tooltip";
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

const PER_PAGE = 15;

export default function VersionPage() {
  const { settings, dispatchSettings } = useSettings();
  const { installing, installedVersions, updateInstalled } = useVersions();

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
    const p = currentPlatform;
    const a = arch();

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

  const latest = useQuery<Record<string, any>>({
    staleTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
    queryKey: ["latest-version"],
    queryFn: async () => {
      const { data } = await octokit.repos.getLatestRelease(repo);

      return data;
    },
  });

  const availableVersions = useInfiniteQuery({
    staleTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
    queryKey: ["available-versions"],
    initialPageParam: 1,
    queryFn: async ({ pageParam: page = 1 }) => {
      const { data, headers } = await octokit.repos.listReleases({
        ...repo,
        page,
        per_page: PER_PAGE,
      });

      const response: Record<string, any> = { data };

      if (headers.link?.includes('rel="next"')) response.nextCursor = page + 1;

      return response;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor;
    },
  });

  const versions = useMemo(() => {
    if (availableVersions.data) {
      const versions = [];

      for (const page of availableVersions.data.pages) {
        versions.push(...page.data);
      }

      return versions;
    }

    return [];
  }, [availableVersions]);

  const canPaginate = useMemo(() => {
    return !availableVersions.isFetching && availableVersions.hasNextPage;
  }, [availableVersions]);

  useBodyScroll(
    {
      canListen: canPaginate,
      handler(e) {
        if (canPaginate) {
          const target = e.target as HTMLDivElement;
          const scrollHeight = target.scrollHeight - target.clientHeight - 500;

          if (target.scrollTop >= scrollHeight) {
            availableVersions.fetchNextPage();
          }
        }
      },
    },
    [availableVersions, canPaginate],
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
          <TooltipContainer
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
          </TooltipContainer>
          <Button
            size="small"
            onClick={async () => {
              const folder = await open({
                directory: true,
              });

              if (folder) {
                try {
                  await dispatchSettings(() => {
                    settings.versionsFolder = folder;
                  });
                } finally {
                  updateInstalled();
                }
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
          <BookmarkIcon />
          <p className="w-full">Latest Version</p>
          <Button
            disabled={latest.isFetching}
            size="tiny"
            variant="secondary"
            onClick={() => {
              latest.refetch();
            }}
          >
            <RefreshCwIcon size={12} />
            Refresh
          </Button>
        </h2>
        <If condition={latest.isFetching}>
          <Then>
            <AvailableVersion.Skeleton />
          </Then>
          <Else>
            <AvailableVersion
              version={latest.data}
              platform={currentPlatform}
              arch={currentArch}
            />
          </Else>
        </If>
      </AppPage.Section>
      <AppPage.Section>
        <h2>
          <BookIcon />
          <p className="w-full">Available Versions</p>
          <Button
            disabled={availableVersions.isFetching}
            size="tiny"
            variant="secondary"
            onClick={() => {
              availableVersions.refetch();
            }}
          >
            <RefreshCwIcon size={12} />
            Refresh
          </Button>
        </h2>
        {versions.map((version) => (
          <AvailableVersion
            key={version.id}
            version={version}
            platform={currentPlatform}
            arch={currentArch}
          />
        ))}
        <When condition={availableVersions.isFetching}>
          {new Array(PER_PAGE).fill(0).map((_, id) => (
            <AvailableVersion.Skeleton key={id} />
          ))}
        </When>
      </AppPage.Section>
    </AppPage>
  );
}
