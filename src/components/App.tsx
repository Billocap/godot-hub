import { TabGroup, TabPanels } from "@headlessui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BookIcon, FolderCheckIcon } from "lucide-react";
import { StrictMode, useState } from "react";

import SideBarProvider from "@/hooks/useSideBar";
import TitleBar from "@/layout/TitleBar";
import InstalledPage from "@/pages/InstalledPage";
import VersionPage from "@/pages/VersionsPage";

import SideBar from "./SideBar";

const queryClient = new QueryClient();

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <SideBarProvider>
          <TabGroup
            as="main"
            onChange={setSelectedIndex}
          >
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
              <VersionPage selected={selectedIndex === 0} />
              <InstalledPage />
            </TabPanels>
          </TabGroup>
        </SideBarProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
