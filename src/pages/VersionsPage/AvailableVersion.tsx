import { open } from "@tauri-apps/plugin-dialog";
import { filesize } from "filesize";
import {
  ArrowBigDownIcon,
  ArrowBigUpIcon,
  FolderIcon,
  FolderSearchIcon,
  LinkIcon,
} from "lucide-react";
import moment from "moment";
import { useMemo, useState } from "react";
import { Else, If, Then } from "react-if";

import DotNetLogo from "@/assets/dotnet-tile.svg?react";
import GodotLogo from "@/assets/godot-dark.svg?react";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import Tooltip from "@/components/Tooltip";
import { useSettings } from "@/hooks/controllers/useSettings";
import { useVersions } from "@/hooks/controllers/useVersions";

interface AssetProps {
  asset: any;
  version: any;
  children: any;
}

function Asset({ asset, version, children }: AssetProps) {
  const { installVersion, installing } = useVersions();
  const { settings } = useSettings();

  const [isInstalling, setIsInstalling] = useState(false);

  return (
    <div className="button-group">
      <span className="flex items-center gap-1 py-1 px-2 text-xs text-slate-500">
        {children}
        {filesize(asset.size)}
      </span>
      <Tooltip tooltip="Install">
        <Button
          disabled={isInstalling || asset.id in installing}
          size="small"
          variant="secondary"
          className="h-full rounded-none"
          onClick={async () => {
            if (!isInstalling && !(asset.id in installing)) {
              setIsInstalling(true);

              try {
                await installVersion(
                  settings.versionsFolder,
                  asset.id,
                  version,
                  asset.browser_download_url,
                  asset.name
                );
              } finally {
                setIsInstalling(false);
              }
            }
          }}
        >
          <If condition={isInstalling || asset.id in installing}>
            <Then>
              <Spinner className="size-4.5" />
            </Then>
            <Else>
              <FolderIcon size={18} />
            </Else>
          </If>
        </Button>
      </Tooltip>
      <Tooltip tooltip="Install at">
        <Button
          disabled={isInstalling || asset.id in installing}
          size="small"
          variant="secondary"
          className="h-full rounded-none"
          onClick={async () => {
            const folder = await open({
              directory: true,
            });

            if (!isInstalling && !(asset.id in installing) && folder) {
              setIsInstalling(true);

              try {
                await installVersion(
                  folder,
                  asset.id,
                  version,
                  asset.browser_download_url,
                  asset.name
                );
              } finally {
                setIsInstalling(false);
              }
            }
          }}
        >
          <If condition={isInstalling || asset.id in installing}>
            <Then>
              <Spinner className="size-4.5" />
            </Then>
            <Else>
              <FolderSearchIcon size={18} />
            </Else>
          </If>
        </Button>
      </Tooltip>
    </div>
  );
}

function AssetSkeleton() {
  return (
    <div className="relative flex items-stretch border rounded-md overflow-hidden divide-x">
      <span className="flex items-center gap-1 py-1 px-2">
        <div className="size-5 rounded bg-slate-200 dark:bg-slate-800" />
        <div
          className="h-3 rounded bg-slate-200 dark:bg-slate-800 hidden lg:inline"
          style={{
            width: `${20 + Math.random() * 20}px`,
          }}
        />
      </span>
      <div className="py-1 px-2 text-xs text-slate-500 rounded-none">
        <FolderIcon size={18} />
      </div>
      <div className="py-1 px-2 text-xs text-slate-500 rounded-none">
        <FolderSearchIcon size={18} />
      </div>
    </div>
  );
}

interface AvailableVersionProps {
  version: any;
  platform: string;
  arch: string;
}

export default function AvailableVersion({
  version,
  platform,
  arch,
}: AvailableVersionProps) {
  const regularAssets = useMemo(() => {
    const assets: any[] = [];
    const regex = new RegExp(
      `Godot_v${version.name.replace("-", "[\\-_]")}_${platform}`
    );

    for (const asset of version.assets) {
      const name = asset.name as string;

      if (name.endsWith(".zip") && name.match(regex) && name.includes(arch)) {
        assets.push(asset);
      }
    }

    return assets;
  }, [version, platform, arch]);

  const monoAssets = useMemo(() => {
    const assets: any[] = [];
    const regex = new RegExp(
      `Godot_v${version.name.replace("-", "[\\-_]")}_mono_${platform}`
    );

    for (const asset of version.assets) {
      const name = asset.name as string;

      if (name.endsWith(".zip") && name.match(regex) && name.includes(arch)) {
        assets.push(asset);
      }
    }

    return assets;
  }, [version, platform, arch]);

  return (
    <div className="overflow-hidden flex items-center justify-between">
      {/* Version Info */}
      <div className="flex flex-col items-stretch gap-1">
        <a
          href={version.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 w-fit underline"
        >
          <LinkIcon size={16} />
          {version.name}
        </a>
        <div className="flex items-center gap-1">
          <Badge>
            <ArrowBigUpIcon size={12} />
            <If condition={version.reactions && "+1" in version.reactions}>
              <Then>{() => version.reactions["+1"]}</Then>
              <Else>0</Else>
            </If>
          </Badge>
          <Badge>
            <ArrowBigDownIcon size={12} />
            <If condition={version.reactions && "-1" in version.reactions}>
              <Then>{() => version.reactions["-1"]}</Then>
              <Else>0</Else>
            </If>
          </Badge>
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1">
          Created at: {moment(version.created_at).format("HH:mm MM/DD/YYYY")}
        </div>
      </div>
      {/* Version Info */}
      {/* Download Links */}
      <div className="flex items-center gap-2">
        {regularAssets.map((asset) => (
          <Asset
            key={asset.id}
            asset={asset}
            version={version.name}
          >
            <GodotLogo className="size-5 text-slate-500" />
          </Asset>
        ))}
        {monoAssets.map((asset) => (
          <Asset
            key={asset.id}
            asset={asset}
            version={`${version.name}-mono`}
          >
            <DotNetLogo className="size-5 text-slate-500" />
          </Asset>
        ))}
      </div>
      {/* Download Links */}
    </div>
  );
}

AvailableVersion.Skeleton = function () {
  return (
    <div className="animate-pulse overflow-hidden flex items-center justify-between">
      {/* Version Info */}
      <div className="flex flex-col items-stretch gap-1">
        <div className="flex items-center gap-1 w-fit">
          <LinkIcon size={12} />
          <div
            className="h-4 rounded bg-slate-200 dark:bg-slate-800"
            style={{
              width: `${100 + Math.random() * 50}px`,
            }}
          />
        </div>
        <div className="flex items-center gap-1">
          <div
            className="h-4 rounded bg-slate-200 dark:bg-slate-800"
            style={{
              width: `${16 + Math.random() * 16}px`,
            }}
          />
          <div
            className="h-4 rounded bg-slate-200 dark:bg-slate-800"
            style={{
              width: `${16 + Math.random() * 16}px`,
            }}
          />
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1">
          <span>Created at: HH:mm MM/DD/YYYY</span>
        </div>
      </div>
      {/* Version Info */}
      {/* Download Links */}
      <div className="flex items-center gap-2">
        <AssetSkeleton />
        <AssetSkeleton />
      </div>
      {/* Download Links */}
    </div>
  );
};
