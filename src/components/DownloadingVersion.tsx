import { listen } from "@tauri-apps/api/event";
import { FolderIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface DownloadingVersionProps {
  version: any;
}

export default function DownloadingVersion({
  version,
}: DownloadingVersionProps) {
  const [downloadState, setDownloadState] = useState("Downloading...");

  useEffect(() => {
    listen<[number, string]>("file_updated", (e) => {
      const [id, state] = e.payload;

      if (id == version.id) setDownloadState(state);
    });
  }, []);

  return (
    <div className="flex flex-col gap-1 p-2">
      <span className="flex items-center gap-1">
        <FolderIcon
          size={12}
          className="text-slate-500"
        />
        {version.name}
      </span>
      <span className="text-xs">{downloadState}</span>
      <div className="text-xs text-slate-500 flex items-center gap-1">
        Started at: {version.createdAt}
      </div>
    </div>
  );
}
