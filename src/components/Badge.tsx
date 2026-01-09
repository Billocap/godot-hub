import { XIcon } from "lucide-react";
import { DetailedHTMLProps, HTMLAttributes, MouseEventHandler } from "react";
import { When } from "react-if";

import classList from "@/utils/classList";

type BadgeProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

interface ExtraProps {
  variant?: "primary" | Colors;
  closeable?: boolean;
  onClose?: MouseEventHandler<HTMLButtonElement>;
}

export default function Badge({
  className,
  variant = "primary",
  children,
  closeable,
  onClose = () => {},
  ...props
}: BadgeProps & ExtraProps) {
  return (
    <div
      className={classList("badge", variant, className)}
      {...props}
    >
      {children}
      <When condition={closeable}>
        <button
          type="button"
          onClick={onClose}
        >
          <XIcon size={12} />
        </button>
      </When>
    </div>
  );
}
