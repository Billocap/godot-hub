import {
  DetailedHTMLProps,
  HTMLAttributes,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { When } from "react-if";

import useBodyScroll from "../hooks/useBodyScroll";
import classList from "../utils/classList";

type DivProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

interface TooltipProps extends DivProps {
  tooltip?: string;
  position?: "top" | "left" | "bottom" | "right";
  anchor?: "start" | "center" | "end";
  tooltipClassName?: string;
}

export default function Tooltip({
  children,
  position = "top",
  anchor = "center",
  tooltip,
  tooltipClassName,
  onMouseEnter,
  onMouseLeave,
  ...props
}: TooltipProps) {
  const wrapper = useRef<HTMLDivElement>(null);
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

    if (node) {
      const boundingBox = node.getBoundingClientRect();
      const style: Record<string, any> = {};

      style[isVertical ? "top" : "left"] = boundingBox[position] + offset;

      if (isVertical) {
        style.left = boundingBox.left;

        switch (anchor) {
          case "center":
            style.left += boundingBox.width * 0.5;
            break;

          case "end":
            style.left += boundingBox.width;
            break;
        }
      } else {
        style.top = boundingBox.top;

        switch (anchor) {
          case "center":
            style.top += boundingBox.height * 0.5;
            break;

          case "end":
            style.top += boundingBox.height;
            break;
        }
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
    <div
      ref={wrapper}
      onMouseEnter={(e) => {
        setIsTooltipVisible(true);
        positionTooltip();

        if (onMouseEnter) onMouseEnter(e);
      }}
      onMouseLeave={(e) => {
        setIsTooltipVisible(false);

        if (onMouseLeave) onMouseLeave(e);
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
    </div>
  );
}
