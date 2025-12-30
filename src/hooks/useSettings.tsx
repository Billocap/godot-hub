import { invoke } from "@tauri-apps/api/core";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Else, If, Then } from "react-if";

import Spinner from "../components/Spinner";

interface SettingsContext {
  settings: any;
  isLoading: boolean;
}

const SettingsContext = createContext({} as SettingsContext);

export const useSettings = () => useContext(SettingsContext);

interface SettingsProviderProps {
  children: ReactNode;
}

export default function SettingsProvider({ children }: SettingsProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<any>({
    versions_folder: "",
  });

  useEffect(() => {
    invoke("load_settings")
      .then(setSettings)
      .finally(() => setIsLoading(false));
  }, []);

  const context: SettingsContext = {
    settings,
    isLoading,
  };

  return (
    <SettingsContext.Provider value={context}>
      <If condition={isLoading}>
        <Then>
          <div className="size-full flex items-center justify-center">
            <Spinner className="size-16 border-4" />
          </div>
        </Then>
        <Else>{children}</Else>
      </If>
    </SettingsContext.Provider>
  );
}
