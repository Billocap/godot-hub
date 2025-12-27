import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { BookIcon, FolderIcon } from "lucide-react";

import GodotLogo from "../assets/godot-dark.svg?react";
import VersionPage from "../pages/VersionPage";

import "../css/main.css";

import TitleBar from "./TitleBar";

export default function App() {
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
          <VersionPage />
        </TabPanel>
        <TabPanel className="content">pro</TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
