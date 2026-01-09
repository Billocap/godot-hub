import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

import classList from "@/utils/classList";

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

interface ExtraProps {
  variant?: "primary" | "secondary" | "destructive";
  size?: "regular" | "small" | "tiny";
}

export default function Button({
  className,
  variant = "primary",
  size = "regular",
  ...props
}: ButtonProps & ExtraProps) {
  return (
    <button
      type="button"
      className={classList("button", size, variant, className)}
      {...props}
    />
  );
}
