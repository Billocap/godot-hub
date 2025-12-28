import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { BookIcon, FolderIcon } from "lucide-react";

import GodotLogo from "../assets/godot-dark.svg?react";
import { useSettings } from "../hooks/useSettings";
import VersionPage from "../pages/VersionPage";

import "../css/main.css";

import TitleBar from "./TitleBar";

export default function App() {
  const { settings } = useSettings();

  return (
    <TabGroup
      as="main"
      className="size-full flex"
    >
      <TabList className="side-bar">
        <div className="header">
          <GodotLogo className="size-8 shrink-0" />
          Godot Hub
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
        <TabPanel className="content">pro</TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
