import { TabGroup, TabPanel, TabPanels } from "@headlessui/react";
import { BookIcon } from "lucide-react";

import SideBarProvider from "@/hooks/useSideBar";
import TitleBar from "@/layout/TitleBar";
import VersionPage from "@/pages/VersionPage";

import SideBar from "./SideBar";

export default function App() {
  return (
    <SideBarProvider>
      <TabGroup as="main">
        <SideBar>
          <SideBar.Selector icon={BookIcon}>Version Manager</SideBar.Selector>
        </SideBar>
        <TabPanels className="main-content">
          <TitleBar />
          <TabPanel className="content">
            <VersionPage />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </SideBarProvider>
  );
}
