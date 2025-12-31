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
import SettingsController from "../controllers/SettingsController";

interface SettingsContext {
  settings: SettingsController;
  isLoading: boolean;
  dispatchSettings(callback: () => void): Promise<unknown>;
}

const SettingsContext = createContext({} as SettingsContext);

export const useSettings = () => useContext(SettingsContext);

interface SettingsProviderProps {
  children: ReactNode;
}

export default function SettingsProvider({ children }: SettingsProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState(new SettingsController());

  useEffect(() => {
    invoke<Settings>("load_settings")
      .then((source) => setSettings(SettingsController.from(source)))
      .finally(() => setIsLoading(false));
  }, []);

  const context: SettingsContext = {
    settings,
    isLoading,
    dispatchSettings(callback) {
      callback();

      setSettings(settings.clone());

      return invoke("update_settings", {
        settings: settings.serialize(),
      });
    },
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
