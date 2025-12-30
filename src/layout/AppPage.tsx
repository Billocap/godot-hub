import { JSX, ReactNode } from "react";

interface AppPageProps {
  title: string;
  icon(): JSX.Element;
  headerChildren?: () => JSX.Element;
  children: ReactNode;
}

export default function AppPage({
  title,
  children,
  headerChildren: HeaderChildren,
  icon: Icon,
}: AppPageProps) {
  return (
    <div className="flex flex-col items-stretch gap-8">
      {/* Header */}
      <div className="flex flex-col items-stretch gap-4">
        <h1 className="flex items-center gap-1">
          <span className="text-gray-400">
            <Icon />
          </span>
          {title}
        </h1>
        {HeaderChildren ? <HeaderChildren /> : null}
      </div>
      {/* Header */}
      {children}
    </div>
  );
}
