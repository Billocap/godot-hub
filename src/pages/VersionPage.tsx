import { open } from "@tauri-apps/plugin-dialog";
import moment from "moment";
import { useEffect, useState } from "react";
import { When } from "react-if";

import Button from "../components/Button";
import octokit from "../services/octokit";

const repo = {
  owner: "godotengine",
  repo: "godot",
};

export default function VersionPage() {
  const [versions, setVersions] = useState<any[]>([]);

  useEffect(() => {
    octokit.repos.listReleases(repo).then((res) => setVersions(res.data));
  }, []);

  return (
    <div className="flex flex-col items-stretch gap-4">
      <div>
        <Button
          className="bg-gray-900 text-gray-100 hover:bg-gray-800"
          onClick={() => {
            open({
              directory: true,
            });
          }}
        >
          Select Folder
        </Button>
      </div>
      <p className="text-2xl border-b">Available Versions</p>
      {versions.map((ver: any) => (
        <When
          key={ver.id}
          condition={ver.name}
        >
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-stretch gap-1">
              <span>{ver.name}</span>
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <a
                  href={ver.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ver.html_url}
                </a>
                <span>{moment(ver.created_at).format("HH:mm MM/DD/YYYY")}</span>
              </div>
            </div>
          </div>
        </When>
      ))}
    </div>
  );
}
