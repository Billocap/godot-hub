import { invoke } from "@tauri-apps/api/core";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { useSettings } from "./useSettings";
import { listen } from "@tauri-apps/api/event";
import moment from "moment";

interface VersionsContext {
  installing: Record<number, any>;
  availableVersions: VersionData[];
  installedVersions: VersionData[];
  updateInstalled(): void;
  installVersion(
    id: number,
    version: string,
    url: string,
    assetName: string
  ): Promise<unknown>;
}

const VersionContext = createContext({} as VersionsContext);

export const useVersions = () => useContext(VersionContext);

interface VersionsProviderProps {
  children: ReactNode;
}

export default function VersionsProvider({ children }: VersionsProviderProps) {
  const { isLoading } = useSettings();

  const [availableVersions, setAvailableVersions] = useState<VersionData[]>([]);
  const [installedVersions, setInstalledVersions] = useState<VersionData[]>([]);
  const [installing, setInstalling] = useState<Record<number, any>>({});

  const updateInstalled = async () => {
    const installed = await invoke<VersionData[]>("list_versions");

    setInstalledVersions(installed);
  };

  useEffect(() => {
    if (!isLoading) {
      updateInstalled();
    }
  }, [isLoading]);

  const context: VersionsContext = {
    installing,
    availableVersions,
    installedVersions,
    updateInstalled,
    async installVersion(id, version, url, assetName) {
      const params = {
        id,
        version,
        url,
        assetName,
      };

      try {
        const descriptor = {
          version,
          createdAt: moment().format("HH:mm MM/DD/YYYY"),
          state: "Downloading...",
          unlisten: await listen<[number, string]>("file_updated", (e) => {
            if (id == e.payload[0]) {
              descriptor.state = e.payload[1];

              setInstalling({ ...installing });
            }
          }),
        };

        installing[id] = descriptor;

        setInstalling({ ...installing });

        await invoke("download_version", params);
      } finally {
        installing[id].unlisten();

        delete installing[id];

        setInstalling({ ...installing });

        updateInstalled();
      }
    },
  };

  return (
    <VersionContext.Provider value={context}>
      {children}
    </VersionContext.Provider>
  );
}
