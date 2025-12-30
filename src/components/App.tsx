import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { listen } from "@tauri-apps/api/event";
import { BookIcon, FolderIcon } from "lucide-react";
import { useEffect } from "react";

import GodotLogo from "../assets/godot-dark.svg?react";
import VersionPage from "../pages/VersionPage";

import TitleBar from "./TitleBar";

export default function App() {
  useEffect(() => {
    listen("file_updated", console.log);
  }, []);

  return (
    <TabGroup as="main">
      <TabList className="side-bar">
        <div className="header">
          <GodotLogo className="size-8 shrink-0" />
          <span className="hidden lg:inline">Godot </span>
          Hub
        </div>
        <Tab className="tab-selector">
          <BookIcon
            size={14}
            className="text-gray-500"
          />
          Versions
        </Tab>
        <Tab className="tab-selector">
          <FolderIcon
            size={14}
            className="text-gray-500"
          />
          Projects
        </Tab>
      </TabList>
      <TabPanels className="main-content">
        <TitleBar />
        <TabPanel className="content">
          <VersionPage />
        </TabPanel>
        <TabPanel className="content">Pro</TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
