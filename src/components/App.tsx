import { TabGroup, TabPanels } from "@headlessui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BookIcon, FolderCheckIcon } from "lucide-react";
import { StrictMode } from "react";

import SideBarProvider from "@/hooks/useSideBar";
import ThemeProvider from "@/hooks/useTheme";
import TitleBar from "@/layout/TitleBar";
import InstalledPage from "@/pages/InstalledPage";
import VersionPage from "@/pages/VersionsPage";

import SideBar from "./SideBar";

const queryClient = new QueryClient();

export default function App() {
  return (
    <StrictMode>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <SideBarProvider>
            <TabGroup as="main">
              <SideBar>
                <SideBar.Selector icon={BookIcon}>
                  Version Installer
                </SideBar.Selector>
                <SideBar.Selector icon={FolderCheckIcon}>
                  Installed Versions
                </SideBar.Selector>
              </SideBar>
              <TabPanels className="main-content">
                <TitleBar />
                <VersionPage />
                <InstalledPage />
              </TabPanels>
            </TabGroup>
          </SideBarProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
