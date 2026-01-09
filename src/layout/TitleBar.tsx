import { getCurrentWindow } from "@tauri-apps/api/window";
import {
  BookOpenIcon,
  CopyIcon,
  GlobeIcon,
  MenuIcon,
  SquareIcon,
  Tally1Icon,
  XIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Else, If, Then } from "react-if";

import ModeSwitch from "@/components/ModeSwitch";
import { useSideBar } from "@/hooks/useSideBar";

export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const { setCollapsed } = useSideBar();

  const appWindow = useMemo(() => getCurrentWindow(), []);

  useEffect(() => {
    appWindow.onResized(async () => {
      const isMaximized = await appWindow.isMaximized().catch((_) => false);

      setIsMaximized(isMaximized);
    });
  }, [appWindow]);

  return (
    <div
      data-tauri-drag-region
      className="title-bar"
    >
      <div className="group">
        <button
          className="action"
          onClick={() => {
            setCollapsed((prev) => !prev);
          }}
        >
          <MenuIcon size={16} />
        </button>
        <ModeSwitch className="mx-2" />
      </div>
      <div className="w-full" />
      <div className="group">
        <a
          href="https://docs.godotengine.org"
          target="_blank"
          rel="noopener noreferrer"
          className="action"
        >
          <BookOpenIcon size={16} />
        </a>
        <a
          href="https://godotengine.org"
          target="_blank"
          rel="noopener noreferrer"
          className="action"
        >
          <GlobeIcon
            size={16}
            strokeWidth={1.5}
          />
        </a>
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
