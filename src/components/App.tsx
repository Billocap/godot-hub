import { TabGroup, TabPanels } from "@headlessui/react";
import { BookIcon, FolderCheckIcon } from "lucide-react";

import SideBarProvider from "@/hooks/useSideBar";
import TitleBar from "@/layout/TitleBar";
import InstalledPage from "@/pages/InstalledPage";
import VersionPage from "@/pages/VersionsPage";

import SideBar from "./SideBar";

export default function App() {
  return (
    <SideBarProvider>
      <TabGroup as="main">
        <SideBar>
          <SideBar.Selector icon={BookIcon}>Version Installer</SideBar.Selector>
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
  );
}
