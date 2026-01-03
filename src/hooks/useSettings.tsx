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
import SettingsHandler from "../handler/SettingsHandler";

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
    SettingsHandler.loadSettings()
      .then(setSettings)
      .finally(() => setIsLoading(false));
  }, []);

  const context: SettingsContext = {
    settings,
    isLoading,
    dispatchSettings(callback) {
      callback();

      setSettings(settings.clone());

      return SettingsHandler.updateSettings(settings);
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
