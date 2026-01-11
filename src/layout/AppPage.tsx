import { DetailedHTMLProps, FC, HTMLAttributes, ReactNode } from "react";
import { When } from "react-if";

import classList from "@/utils/classList";
import { TabPanel } from "@headlessui/react";

type DivProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

interface IconProps {
  size?: number;
}

interface AppPageProps {
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
}: AppPageProps) {
  return (
    <TabPanel className="content">
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
