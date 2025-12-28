import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { openPath } from "@tauri-apps/plugin-opener";
import {
  ArrowBigDownIcon,
  ArrowBigUpIcon,
  FolderIcon,
  FolderPlusIcon,
  LinkIcon,
} from "lucide-react";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { When } from "react-if";

import Badge from "../components/Badge";
import Button from "../components/Button";
import octokit from "../services/octokit";

const repo = {
  owner: "godotengine",
  repo: "godot",
};

interface VersionPageProps {
  defaultFolder: string;
}

export default function VersionPage({ defaultFolder = "" }: VersionPageProps) {
  const [versions, setVersions] = useState<any[]>([]);
  const [installedVersions, setInstalledVersions] = useState<any[]>([]);
  const [currentFolder, setCurrentFolder] = useState(defaultFolder);

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
    invoke<any[]>("list_versions", {
      folder: currentFolder,
    }).then((installedVersions) => {
      setInstalledVersions(installedVersions);
    });
  }, [currentFolder]);

  return (
    <div className="flex flex-col items-stretch gap-8">
      <div className="flex flex-col items-stretch gap-4">
        <span className="border-b text-3xl py-2">Version Manager</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 w-full">
            Current Folder:
            <span className="text-gray-500">{currentFolder}</span>
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
            className="bg-gray-900 text-gray-100 hover:bg-gray-800"
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
            <div className="flex flex-col items-stretch gap-1">
              <a
                href={ver.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                {ver.name}
                <LinkIcon
                  size={12}
                  className="text-gray-500"
                />
              </a>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Badge>
                  <ArrowBigUpIcon size={12} />
                  {ver.reactions["+1"]}
                </Badge>
                <Badge>
                  <ArrowBigDownIcon size={12} />
                  {ver.reactions["-1"]}
                </Badge>
                <span>{moment(ver.created_at).format("HH:mm MM/DD/YYYY")}</span>
              </div>
            </div>
          </When>
        ))}
      </div>
    </div>
  );
}
