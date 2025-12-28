import { invoke } from "@tauri-apps/api/core";
import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext<any>({});

export const useSettings = () => useContext(SettingsContext);

interface SettingsProviderProps {
  children: any;
}

export default function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    invoke("load_settings")
      .then(setSettings)
      .finally(() => setIsLoading(false));
  }, []);

  const context = {
    settings,
    isLoading,
  };

  return (
    <SettingsContext.Provider value={context}>
      {isLoading ? null : children}
    </SettingsContext.Provider>
  );
}
