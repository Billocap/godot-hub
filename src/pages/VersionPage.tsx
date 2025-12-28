import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { openPath } from "@tauri-apps/plugin-opener";
import { arch, platform } from "@tauri-apps/plugin-os";
import {
  ArrowBigDownIcon,
  ArrowBigUpIcon,
  FolderIcon,
  FolderPlusIcon,
  LinkIcon,
} from "lucide-react";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { When } from "react-if";

import Badge from "../components/Badge";
import Button from "../components/Button";
import { useSettings } from "../hooks/useSettings";
import octokit from "../services/octokit";

import GodotLogo from "../assets/godot-dark-outline.svg?react";

const repo = {
  owner: "godotengine",
  repo: "godot",
};

interface AvailableVersionProps {
  version: any;
  platform: string;
  arch: string;
  onDownloaded(): void;
}

function AvailableVersion({
  version,
  platform,
  arch,
  onDownloaded,
}: AvailableVersionProps) {
  const { settings } = useSettings();
  const regularTag = useMemo(() => `Godot_v${version.name}_`, [version]);

  const regularAssets = useMemo(() => {
    const assets: any[] = [];

    for (const asset of version.assets) {
      const name = asset.name as string;

      if (
        name.endsWith(".zip") &&
        name.startsWith(regularTag + platform) &&
        name.includes(arch)
      ) {
        assets.push(asset);
      }
    }

    return assets;
  }, [version, platform, arch]);

  const monoTag = useMemo(() => `Godot_v${version.name}_mono_`, [version]);

  const monoAssets = useMemo(() => {
    const assets: any[] = [];

    for (const asset of version.assets) {
      const name = asset.name as string;

      if (
        name.endsWith(".zip") &&
        name.startsWith(monoTag + platform) &&
        name.includes(arch)
      ) {
        assets.push(asset);
      }
    }

    return assets;
  }, [version, platform, arch]);

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-col items-stretch gap-1">
        <a
          href={version.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 w-fit"
        >
          {version.name}
          <LinkIcon
            size={12}
            className="text-gray-500"
          />
        </a>
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <Badge>
            <ArrowBigUpIcon size={12} />
            {version.reactions["+1"]}
          </Badge>
          <Badge>
            <ArrowBigDownIcon size={12} />
            {version.reactions["-1"]}
          </Badge>
          <span>{moment(version.created_at).format("HH:mm MM/DD/YYYY")}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex">
          {regularAssets.map((asset) => (
            <button
              key={asset.id}
              className="cursor-pointer flex flex-col items-center gap-1 p-2 text-xs text-gray-500"
              onClick={() => {
                invoke("download_version", {
                  url: asset.browser_download_url,
                  target: settings.versions_folder,
                  assetName: asset.name,
                  version: version.name,
                }).finally(onDownloaded);
              }}
            >
              <GodotLogo className="size-6 text-gray-500" />
              {asset.name
                .replace(regularTag, "")
                .replace("windows_", "")
                .replace(".zip", "")}
            </button>
          ))}
        </div>
        <div className="flex">
          {monoAssets.map((asset) => (
            <button
              key={asset.id}
              className="cursor-pointer flex flex-col items-center p-2 text-xs text-gray-500"
              onClick={() => {
                invoke("download_version", {
                  url: asset.browser_download_url,
                  target: settings.versions_folder,
                  assetName: asset.name,
                  version: `${version.name}-mono`,
                }).finally(onDownloaded);
              }}
            >
              <p className="text-lg text-gray-500 font-bold">.NET</p>
              {asset.name
                .replace(monoTag, "")
                .replace("windows_", "")
                .replace(".zip", "")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

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

    invoke("update_settings", {
      settings: {
        versions_folder: folder,
      },
    });

    setCurrentFolder(folder as string);
  }, [currentFolder]);

  useEffect(() => {
    octokit.repos.listReleases(repo).then((res) => setVersions(res.data));
  }, []);

  useEffect(() => {
    if (currentFolder) {
      invoke<any[]>("list_versions", {
        folder: currentFolder,
      }).then((installedVersions) => {
        setInstalledVersions(installedVersions);
      });
    }
  }, [currentFolder]);

  return (
    <div className="flex flex-col items-stretch gap-8">
      <div className="flex flex-col items-stretch gap-4">
        <span className="border-b text-3xl py-2">Version Manager</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 w-full whitespace-nowrap overflow-hidden">
            <span className="hidden lg:inline">Current Folder:</span>
            <span className="inline lg:hidden">
              <FolderIcon
                size={16}
                className="text-gray-700"
              />
            </span>
            <span className="text-gray-500 overflow-hidden text-ellipsis">
              {currentFolder}
            </span>
          </span>
          <When condition={currentFolder.length}>
            <Button
              className="bg-transparent hover:bg-gray-200"
              onClick={() => {
                openPath(currentFolder);
              }}
            >
              <FolderIcon
                size={16}
                strokeWidth={2.5}
              />
              Open Folder
            </Button>
          </When>
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
      </div>
      <When condition={currentFolder.length}>
        <div className="flex flex-col items-stretch gap-4">
          <p className="text-2xl border-b">Installed Versions</p>
          {installedVersions.map((path) => (
            <div
              className="flex flex-col items-stretch gap-1"
              key={path.name}
            >
              <div className="flex items-center gap-1">{path.name}</div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <span>
                  {moment(path.created_at).format("HH:mm MM/DD/YYYY")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </When>
      <div className="flex flex-col items-stretch gap-4">
        <p className="text-2xl border-b">Available Versions</p>
        {versions.map((ver) => (
          <When
            key={ver.id}
            condition={ver.name}
          >
            <AvailableVersion
              version={ver}
              platform={currentPlatform}
              arch={currentArch}
              onDownloaded={() => {
                invoke<any[]>("list_versions", {
                  folder: currentFolder,
                }).then((installedVersions) => {
                  setInstalledVersions(installedVersions);
                });
              }}
            />
          </When>
        ))}
      </div>
    </div>
  );
}
