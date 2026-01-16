import { getCurrentWindow } from "@tauri-apps/api/window";
import {
  BookOpenIcon,
  CopyIcon,
  GlobeIcon,
  PanelLeftDashedIcon,
  PanelLeftIcon,
  SquareIcon,
  Tally1Icon,
  XIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Else, If, Then } from "react-if";

import ModeSwitch from "@/components/ModeSwitch";
import TooltipContainer from "@/components/Tooltip";
import { useSideBar } from "@/hooks/useSideBar";

export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const { collapsed, setCollapsed } = useSideBar();

  const appWindow = useMemo(() => getCurrentWindow(), []);

  const checkMaximized = useCallback(async () => {
    const isMaximized = await appWindow.isMaximized().catch((_) => false);

    setIsMaximized(isMaximized);
  }, [appWindow]);

  useEffect(() => {
    checkMaximized();
  }, []);

  useEffect(() => {
    appWindow.onResized(checkMaximized);
  }, [appWindow]);

  return (
    <div
      data-tauri-drag-region
      className="title-bar"
    >
      <div className="group">
        <TooltipContainer
          as="button"
          position="bottom"
          tooltip={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className="action"
          onClick={() => {
            setCollapsed((prev) => !prev);
          }}
        >
          <If condition={collapsed}>
            <Then>
              <PanelLeftDashedIcon size={16} />
            </Then>
            <Else>
              <PanelLeftIcon size={16} />
            </Else>
          </If>
        </TooltipContainer>
        <ModeSwitch className="mx-2" />
      </div>
      <div className="w-full" />
      <div className="group">
        <TooltipContainer
          as="a"
          position="bottom"
          tooltip="Godot's Docs"
          href="https://docs.godotengine.org"
          target="_blank"
          rel="noopener noreferrer"
          className="action"
        >
          <BookOpenIcon size={16} />
        </TooltipContainer>
        <TooltipContainer
          as="a"
          position="bottom"
          tooltip="Godot's Site"
          href="https://godotengine.org"
          target="_blank"
          rel="noopener noreferrer"
          className="action"
        >
          <GlobeIcon
            size={16}
            strokeWidth={1.5}
          />
        </TooltipContainer>
      </div>
      <div className="group">
        <button
          className="action"
          onClick={() => {
            appWindow.minimize();
          }}
        >
          <Tally1Icon
            className="-rotate-90"
            size={16}
          />
        </button>
        <button
          className="action"
          onClick={() => {
            appWindow.toggleMaximize();
          }}
        >
          <If condition={isMaximized}>
            <Then>
              <CopyIcon
                className="-scale-x-100"
                size={16}
              />
            </Then>
            <Else>
              <SquareIcon size={16} />
            </Else>
          </If>
        </button>
        <button
          className="action destructive"
          onClick={() => {
            appWindow.close();
          }}
        >
          <XIcon size={16} />
        </button>
      </div>
    </div>
  );
}
