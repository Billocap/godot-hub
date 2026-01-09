import { Tab, TabList } from "@headlessui/react";
import { FC, ReactNode } from "react";

import { useSideBar } from "@/hooks/useSideBar";
import AppHeader from "@/layout/AppHeader";

interface SideBarProps {
  children: ReactNode;
}

export default function SideBar({ children }: SideBarProps) {
  return (
    <TabList className="side-bar">
      <AppHeader />
      {children}
    </TabList>
  );
}

interface IconProps {
  size?: number;
}

interface SelectorProps {
  icon: FC<IconProps>;
  children: ReactNode;
}

SideBar.Selector = function ({ icon: Icon, children }: SelectorProps) {
  const { collapsed } = useSideBar();

  return (
    <Tab className="tab-selector">
      <Icon size={24} />
      <span
        className="text"
        data-collapsed={collapsed ? true : undefined}
      >
        {children}
      </span>
    </Tab>
  );
};
