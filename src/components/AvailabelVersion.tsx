import { filesize } from "filesize";
import { ArrowBigDownIcon, ArrowBigUpIcon, LinkIcon } from "lucide-react";
import moment from "moment";
import { useMemo, useState } from "react";
import { Else, If, Then, When } from "react-if";

import Badge from "../components/Badge";
import { useVersions } from "../hooks/useVersions";

import DotNetLogo from "../assets/dotnet-tile.svg?react";
import GodotLogo from "../assets/godot-dark.svg?react";

import Button from "./Button";
import Spinner from "./Spinner";

interface AssetProps {
  asset: any;
  version: any;
  children: any;
}

function Asset({ asset, version, children }: AssetProps) {
  const { installVersion, installing } = useVersions();

  const [isInstalling, setIsInstalling] = useState(false);

  return (
    <Button
      disabled={isInstalling || asset.id in installing}
      className="py-0 px-2 flex-col text-xs text-gray-500"
      onClick={() => {
        if (!isInstalling && !(asset.id in installing)) {
          setIsInstalling(true);

          installVersion(
            asset.id,
            version,
            asset.browser_download_url,
            asset.name
          ).finally(() => setIsInstalling(false));
        }
      }}
    >
      <If condition={isInstalling || asset.id in installing}>
        <Then>
          <Spinner className="size-6" />
        </Then>
        <Else>{children}</Else>
      </If>
      {filesize(asset.size)}
    </Button>
  );
}

function AssetSkeleton() {
  return (
    <Button className="py-0 px-2 flex-col text-xs text-gray-500">
      <div className="size-6 rounded bg-gray-200" />
      <div
        className="h-3 rounded bg-gray-200"
        style={{
          width: `${20 + Math.random() * 20}px`,
        }}
      />
    </Button>
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
    <div className="overflow-hidden flex items-center justify-between p-2 transition-colors border border-transparent hover:bg-gray-200/25 hover:border-gray-200 rounded-lg">
      {/* Version Info */}
      <div className="flex flex-col items-stretch gap-1">
        <a
          href={version.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 w-fit"
        >
          <LinkIcon
            size={12}
            className="text-gray-500"
          />
          {version.name}
        </a>
        {/* <div className="flex items-center gap-1">
          <When condition={() => version.reactions["+1"]}>
            {() => (
              <Badge>
                <ArrowBigUpIcon size={12} />
                {version.reactions["+1"]}
              </Badge>
            )}
          </When>
          <When condition={() => version.reactions["-1"]}>
            {() => (
              <Badge>
                <ArrowBigDownIcon size={12} />
                {version.reactions["-1"]}
              </Badge>
            )}
          </When>
          <When condition={() => version.reactions.confused}>
            {() => (
              <Badge>
                🤔
                {version.reactions.confused}
              </Badge>
            )}
          </When>
          <When condition={() => version.reactions.laugh}>
            {() => (
              <Badge>
                😂
                {version.reactions.laugh}
              </Badge>
            )}
          </When>
          <When condition={() => version.reactions.hooray}>
            {() => (
              <Badge>
                🎉
                {version.reactions.hooray}
              </Badge>
            )}
          </When>
          <When condition={() => version.reactions.heart}>
            {() => (
              <Badge>
                ❤️
                {version.reactions.heart}
              </Badge>
            )}
          </When>
          <When condition={() => version.reactions.rocket}>
            {() => (
              <Badge>
                🚀
                {version.reactions.rocket}
              </Badge>
            )}
          </When>
          <When condition={() => version.reactions.eyes}>
            {() => (
              <Badge>
                👀
                {version.reactions.eyes}
              </Badge>
            )}
          </When>
        </div> */}
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <span>
            Created at: {moment(version.created_at).format("HH:mm MM/DD/YYYY")}
          </span>
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
            <GodotLogo className="size-6 text-gray-500" />
          </Asset>
        ))}
        {monoAssets.map((asset) => (
          <Asset
            key={asset.id}
            asset={asset}
            version={`${version.name}-mono`}
          >
            <DotNetLogo className="size-6 text-gray-500" />
          </Asset>
        ))}
      </div>
      {/* Download Links */}
    </div>
  );
}

AvailableVersion.Skeleton = function () {
  return (
    <div className="animate-pulse overflow-hidden flex items-center justify-between p-2 border border-transparent">
      {/* Version Info */}
      <div className="flex flex-col items-stretch gap-1">
        <div className="flex items-center gap-1 w-fit">
          <LinkIcon
            size={12}
            className="text-gray-500"
          />
          <div
            className="h-4 rounded bg-gray-200"
            style={{
              width: `${100 + Math.random() * 50}px`,
            }}
          />
        </div>
        <div className="text-xs text-gray-500 flex items-center gap-1">
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
