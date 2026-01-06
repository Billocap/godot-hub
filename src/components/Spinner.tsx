import { DetailedHTMLProps, HTMLAttributes } from "react";

import classList from "@/utils/classList";

type SpinnerProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export default function Spinner({
  className,
  children: _,
  ...props
}: SpinnerProps) {
  return (
    <div
      className={classList("spinner", className)}
      {...props}
    />
  );
}
