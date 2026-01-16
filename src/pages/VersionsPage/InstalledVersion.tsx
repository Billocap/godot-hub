import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { openPath } from "@tauri-apps/plugin-opener";
import { filesize } from "filesize";
import { FolderIcon, FolderXIcon } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { Else, If, Then } from "react-if";

import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import TooltipContainer from "@/components/Tooltip";
import VersionController from "@/controllers/VersionController";
import { useVersions } from "@/hooks/controllers/useVersions";

interface InstalledVersionProps {
  version: VersionController;
}

export default function InstalledVersion({ version }: InstalledVersionProps) {
  const { uninstallVersion } = useVersions();

  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <div className="w-full flex flex-col items-stretch gap-2 overflow-hidden">
        <TooltipContainer
          as="span"
          position="right"
          tooltip="Click to open"
          onClick={() => openPath(version.path)}
          className="cursor-pointer flex items-center gap-1 w-fit"
        >
          <FolderIcon size={16} />
          {version.name}
          <Badge>{filesize(version.size)}</Badge>
        </TooltipContainer>
        <TooltipContainer
          position="right"
          tooltip="Click to copy"
          className="cursor-pointer w-fit text-xs text-slate-500 flex text-ellipsis whitespace-nowrap"
          onClick={() => {
            writeText(version.path);
          }}
        >
          {version.path}
        </TooltipContainer>
        <p className="text-xs text-slate-500">
          Created at: {moment(version.createdAt).format("HH:mm MM/DD/YYYY")}
        </p>
      </div>
      <Button
        disabled={isDeleting}
        variant="destructive"
        onClick={() => {
          setIsDeleting(true);

          uninstallVersion(version.id).finally(() => setIsDeleting(false));
        }}
      >
        <If condition={isDeleting}>
          <Then>
            <Spinner className="size-4" />
          </Then>
          <Else>
            <FolderXIcon size={16} />
          </Else>
        </If>
        Uninstall Version
      </Button>
    </div>
  );
}
