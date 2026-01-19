import { DetailedHTMLProps, FC, HTMLAttributes, ReactNode } from "react";
import { When } from "react-if";

import classList from "@/utils/classList";
import { TabPanel, TabPanelProps } from "@headlessui/react";

type DivProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

interface IconProps {
  size?: number;
}

export interface AppPageProps extends TabPanelProps {
  title: string;
  description?: string;
  icon: FC<IconProps>;
  children: ReactNode;
}

export default function AppPage({
  title,
  description,
  children,
  icon: Icon,
  className,
  ...props
}: AppPageProps) {
  return (
    <TabPanel
      className={classList("content", className)}
      {...props}
    >
      {/* Header */}
      <div className="flex flex-col items-stretch gap-4">
        <h1>
          <Icon size={30} />
          {title}
        </h1>
        <When condition={description}>
          <p>{description}</p>
        </When>
      </div>
      {/* Header */}
      {children}
    </TabPanel>
  );
}

AppPage.Section = function ({ className, ...props }: DivProps) {
  return (
    <div
      className={classList("flex flex-col gap-4 items-stretch", className)}
      {...props}
    />
  );
};
