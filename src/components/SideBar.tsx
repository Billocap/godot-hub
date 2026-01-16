import { Tab, TabList } from "@headlessui/react";
import { FC, ReactNode } from "react";

import { useSideBar } from "@/hooks/useSideBar";
import AppHeader from "@/layout/AppHeader";
import classList from "@/utils/classList";

import TooltipContainer from "./Tooltip";

interface SideBarProps {
  children: ReactNode;
}

export default function SideBar({ children }: SideBarProps) {
  return (
    <TabList
      as="aside"
      className="side-bar"
    >
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
  children: string;
}

SideBar.Selector = function ({ icon: Icon, children }: SelectorProps) {
  const { collapsed } = useSideBar();

  return (
    <TooltipContainer
      as={Tab}
      tooltip={children}
      position="right"
      className="tab-selector"
      tooltipClassName={classList(collapsed ? "" : "hidden")}
    >
      <Icon size={24} />
      <span
        className="text"
        data-collapsed={collapsed ? true : undefined}
      >
        {children}
      </span>
    </TooltipContainer>
  );
};
