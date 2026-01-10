import { Button as TwButton } from "@headlessui/react";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

import classList from "@/utils/classList";

type DivProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

interface ButtonProps extends DivProps {
  variant?: "primary" | "secondary" | "destructive";
  size?: "regular" | "small" | "tiny";
}

export default function Button({
  className,
  variant = "primary",
  size = "regular",
  ...props
}: ButtonProps) {
  return (
    <TwButton
      type="button"
      className={classList("button", size, variant, className)}
      {...props}
    />
  );
}
