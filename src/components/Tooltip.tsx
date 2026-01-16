import React, { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { When } from "react-if";

import useBodyScroll from "@/hooks/useBodyScroll";
import classList from "@/utils/classList";

interface TooltipProps<T> {
  as?: T;
  tooltip?: string;
  position?: "top" | "left" | "bottom" | "right";
  anchor?: "start" | "center" | "end";
  tooltipClassName?: string;
}

export default function TooltipContainer<T extends React.ElementType = "div">({
  as,
  children,
  position = "top",
  anchor = "center",
  tooltip,
  tooltipClassName,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onContextMenu,
  ...props
}: TooltipProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof TooltipProps<T>>) {
  const Element = as ?? "div";

  const wrapper = useRef<T>(null);

  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState({});

  const isVertical = useMemo(() => {
    return ["top", "bottom"].includes(position);
  }, [position]);
  const offset = useMemo(() => {
    return ["top", "left"].includes(position) ? -8 : 8;
  }, [position]);

  const positionTooltip = () => {
    const node = wrapper.current;

    if (node && node instanceof HTMLElement) {
      const boundingBox = node.getBoundingClientRect();
      const style: Record<string, number> = {};
      const size = boundingBox[isVertical ? "width" : "height"];
      const factor = anchor === "end" ? 1 : 0.5;
      const correction = anchor !== "start" ? size * factor : 0;

      style[isVertical ? "top" : "left"] = boundingBox[position] + offset;

      if (isVertical) {
        style.left = boundingBox.left + correction;
      } else {
        style.top = boundingBox.top + correction;
      }

      setTooltipStyle(style);
    }
  };

  useBodyScroll({
    handler() {
      setIsTooltipVisible(false);
    },
  });

  return (
    <Element
      ref={wrapper as any}
      onMouseEnter={(e: any) => {
        setIsTooltipVisible(true);
        positionTooltip();

        if (onMouseEnter) onMouseEnter(e);
      }}
      onMouseLeave={(e: any) => {
        setIsTooltipVisible(false);

        if (onMouseLeave) onMouseLeave(e);
      }}
      onClick={(e: any) => {
        setIsTooltipVisible(false);

        if (onClick) onClick(e);
      }}
      onContextMenu={(e: any) => {
        setIsTooltipVisible(false);

        if (onContextMenu) onContextMenu(e);
      }}
      {...props}
    >
      <When condition={tooltip}>
        {createPortal(
          <div
            className={classList(
              "tooltip",
              position,
              anchor,
              isTooltipVisible ? "opacity-100" : "opacity-0",
              tooltipClassName
            )}
            style={tooltipStyle}
          >
            {tooltip}
          </div>,
          document.body
        )}
      </When>
      {children}
    </Element>
  );
}
