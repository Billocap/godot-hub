import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface SideBarContext {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}

const SideBarContext = createContext({} as SideBarContext);

export const useSideBar = () => useContext(SideBarContext);

interface SideBarProviderProps {
  children: ReactNode;
}

export default function SideBarProvider({ children }: SideBarProviderProps) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const collapsed = localStorage.getItem("side-bar-collapsed");

    if (collapsed) setCollapsed(collapsed == "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("side-bar-collapsed", String(collapsed));
  }, [collapsed]);

  const context: SideBarContext = {
    collapsed,
    setCollapsed,
  };

  return (
    <SideBarContext.Provider value={context}>
      {children}
    </SideBarContext.Provider>
  );
}
