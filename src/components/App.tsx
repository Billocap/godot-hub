import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { BookIcon, FolderIcon } from "lucide-react";

import GodotLogo from "../assets/godot-dark.svg?react";
import { useSettings } from "../hooks/useSettings";
import AppPage from "../layout/AppPage";
import VersionPage from "../pages/VersionPage";

import TitleBar from "./TitleBar";

export default function App() {
  const { settings } = useSettings();

  return (
    <TabGroup as="main">
      <TabList className="side-bar">
        <div className="header">
          <GodotLogo className="size-8 shrink-0" />
          <span className="hidden lg:inline">Godot </span>
          Hub
        </div>
        <Tab className="tab-selector">
          <BookIcon size={14} />
          Versions
        </Tab>
        <Tab className="tab-selector">
          <FolderIcon size={14} />
          Projects
        </Tab>
      </TabList>
      <TabPanels className="main-content">
        <TitleBar />
        <TabPanel className="content">
          <VersionPage defaultFolder={settings.versions_folder} />
        </TabPanel>
        <TabPanel className="content">
          <AppPage
            title="Project Manager"
            icon={() => <FolderIcon />}
          >
            asdf
          </AppPage>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
