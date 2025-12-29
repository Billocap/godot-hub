import { invoke } from "@tauri-apps/api/core";
import { filesize } from "filesize";
import { ArrowBigDownIcon, ArrowBigUpIcon, LinkIcon } from "lucide-react";
import moment from "moment";
import { useMemo, useState } from "react";
import { Else, If, Then } from "react-if";

import Badge from "../components/Badge";

import DotNetLogo from "../assets/dotnet-tile.svg?react";
import GodotLogo from "../assets/godot-dark.svg?react";

import Spinner from "./Spinner";

interface AssetProps {
  title: string;
  asset: any;
  version: any;
  children: any;
  onDownloaded(): void;
}

function Asset({ title, asset, version, children, onDownloaded }: AssetProps) {
  const [isInstalling, setIsInstalling] = useState(false);

  const installVersion = () => {
    if (!isInstalling) {
      const params = {
        version,
        url: asset.browser_download_url,
        assetName: asset.name,
      };

      setIsInstalling(true);

      invoke("download_version", params).finally(() => {
        setIsInstalling(false);

        onDownloaded();
      });
    }
  };

  return (
    <button
      className="cursor-pointer flex flex-col items-center gap-1 p-2 text-xs text-gray-500"
      onClick={() => installVersion()}
    >
      <If condition={isInstalling}>
        <Then>
          <Spinner className="size-6" />
        </Then>
        <Else>{children}</Else>
      </If>
      {filesize(asset.size)}
    </button>
  );
}

interface AvailableVersionProps {
  version: any;
  platform: string;
  arch: string;
  onDownloaded(): void;
}

export default function AvailableVersion({
  version,
  platform,
  arch,
  onDownloaded,
}: AvailableVersionProps) {
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
    <div className="flex items-center justify-between px-2 transition-colors hover:bg-gray-200/50 rounded-lg">
      {/* Version Info */}
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
      {/* Version Info */}
      {/* Download Links */}
      <div className="flex items-center gap-2">
        {regularAssets.map((asset) => (
          <Asset
            key={asset.id}
            asset={asset}
            version={version.name}
            title={asset.name
              .replace(regularTag, "")
              .replace("windows_", "")
              .replace(".zip", "")}
            onDownloaded={onDownloaded}
          >
            <GodotLogo className="size-6 text-gray-500" />
          </Asset>
        ))}
        {monoAssets.map((asset) => (
          <Asset
            key={asset.id}
            asset={asset}
            version={`${version.name}-mono`}
            title={asset.name
              .replace(monoTag, "")
              .replace("windows_", "")
              .replace(".zip", "")}
            onDownloaded={onDownloaded}
          >
            <DotNetLogo className="size-6 text-gray-500" />
          </Asset>
        ))}
      </div>
      {/* Download Links */}
    </div>
  );
}
