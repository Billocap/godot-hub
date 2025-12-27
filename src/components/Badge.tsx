import { DetailedHTMLProps, HTMLAttributes } from "react";

import classList from "../utils/classList";

type BadgeProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export default function Badge({ className, ...props }: BadgeProps) {
  return (
    <div
      className={classList("badge", className)}
      {...props}
    />
  );
}
