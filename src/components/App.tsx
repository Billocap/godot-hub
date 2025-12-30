import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { BookIcon } from "lucide-react";

import GodotLogo from "../assets/godot-dark.svg?react";
import { useSettings } from "../hooks/useSettings";
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
          <BookIcon
            size={14}
            className="text-gray-500"
          />
          Versions
        </Tab>
      </TabList>
      <TabPanels className="main-content">
        <TitleBar />
        <TabPanel className="content">
          <VersionPage defaultFolder={settings.versions_folder} />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
