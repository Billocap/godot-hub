import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
import { useEffect, useMemo, useState } from "react";
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

interface VersionPageProps {
  selected: boolean;
}

export default function VersionPage({ selected }: VersionPageProps) {
  const { settings, dispatchSettings } = useSettings();
  const { installing, installedVersions, updateInstalled } = useVersions();
  const [pseudoPage, setPseudoPage] = useState(1);

  const queryClient = useQueryClient();
  const isCached = useMemo(() => {
    const cache = queryClient.getQueryCache().find({
      queryKey: ["available-versions"],
    });

    return cache !== undefined;
  }, [queryClient]);

  useEffect(() => {
    if (!selected) setPseudoPage(1);
  }, [selected]);

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

      return isCached ? versions.slice(0, pseudoPage * PER_PAGE) : versions;
    }

    return [];
  }, [availableVersions, pseudoPage, isCached]);

  const canPaginate = useMemo(() => {
    return !availableVersions.isFetching && availableVersions.hasNextPage;
  }, [availableVersions]);

  const canPaginateCache = useMemo(() => {
    return isCached && versions.length >= pseudoPage * PER_PAGE;
  }, [isCached, pseudoPage, versions]);

  useBodyScroll(
    {
      canListen: canPaginate || canPaginateCache,
      handler(e) {
        if (canPaginate || canPaginateCache) {
          const target = e.target as HTMLDivElement;
          const scrollHeight = target.scrollHeight - target.clientHeight - 500;

          if (target.scrollTop >= scrollHeight) {
            if (canPaginateCache) {
              setPseudoPage((page) => page + 1);
            } else {
              availableVersions.fetchNextPage();
            }
          }
        }
      },
    },
    [availableVersions, canPaginate, canPaginateCache],
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
        <When condition={availableVersions.isFetching}>
          {new Array(PER_PAGE).fill(0).map((_, id) => (
            <AvailableVersion.Skeleton key={id} />
          ))}
        </When>
      </AppPage.Section>
    </AppPage>
  );
}
