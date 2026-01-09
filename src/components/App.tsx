import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { BookIcon } from "lucide-react";

import AppHeader from "../layout/AppHeader";
import TitleBar from "../layout/TitleBar";
import VersionPage from "../pages/VersionPage";

export default function App() {
  return (
    <TabGroup as="main">
      <TabList className="side-bar">
        <AppHeader />
        <Tab className="tab-selector">
          <BookIcon
            size={14}
            className="text-slate-500"
          />
          Version Manager
        </Tab>
      </TabList>
      <TabPanels className="main-content">
        <TitleBar />
        <TabPanel className="content">
          <VersionPage />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
