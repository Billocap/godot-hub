import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import classList from "@/utils/classList";
import { When } from "react-if";

interface IconProps {
  size?: number;
}

type DivProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

interface CalloutProps extends DivProps {
  icon?: FC<IconProps>;
  variant?: "primary" | Colors;
}

export default function Callout({
  icon: Icon,
  className,
  variant = "primary",
  title,
  children,
  ...props
}: CalloutProps) {
  return (
    <div
      {...props}
      className={classList("callout", className, variant)}
    >
      {Icon ? <Icon size={14} /> : null}
      <div className="flex flex-col gap-1">
        <When condition={title}>
          <b>{title}</b>
        </When>
        {children}
      </div>
    </div>
  );
}
