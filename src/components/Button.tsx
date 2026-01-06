import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

import classList from "@/utils/classList";

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export default function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={classList("button", className)}
      {...props}
    />
  );
}
