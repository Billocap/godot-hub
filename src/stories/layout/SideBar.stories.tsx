import type { Meta, StoryObj } from "@storybook/react-vite";
import { BookIcon } from "lucide-react";

import SideBar from "@/components/SideBar";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof SideBar.Selector> = {
  title: "layout/SideBar",
  component: SideBar.Selector,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    icon: BookIcon,
    children: "asdf",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
