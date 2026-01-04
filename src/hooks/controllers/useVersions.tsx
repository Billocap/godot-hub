import moment from "moment";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import VersionController from "../../controllers/VersionController";
import VersionsHandler from "../../handler/VersionsHandler";

import { useSettings } from "./useSettings";

interface VersionsContext {
  installing: Record<number, any>;
  installedVersions: VersionController[];
  updateInstalled(): void;
  installVersion(
    at: string,
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

  const [installedVersions, setInstalledVersions] = useState<
    VersionController[]
  >([]);
  const [installing, setInstalling] = useState<Record<number, any>>({});

  const updateInstalled = async () => {
    const installed = await VersionsHandler.listInstalledVersions();

    setInstalledVersions(installed);
  };

  useEffect(() => {
    if (!isLoading) {
      updateInstalled();
    }
  }, [isLoading]);

  const context: VersionsContext = {
    installing,
    installedVersions,
    updateInstalled,
    async installVersion(at, id, version, url, assetName) {
      try {
        setInstalling((prev) => {
          prev[id] = {
            id,
            name: version,
            createdAt: moment().format("HH:mm MM/DD/YYYY"),
          };

          return { ...prev };
        });

        await VersionsHandler.installVersion(at, id, version, url, assetName);
      } finally {
        setInstalling((prev) => {
          delete prev[id];

          return { ...prev };
        });

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
