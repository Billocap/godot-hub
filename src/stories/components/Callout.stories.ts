import { Meta, StoryObj } from "@storybook/react-vite";
import { BookIcon } from "lucide-react";

import Callout from "@/components/Callout";

const meta: Meta<typeof Callout> = {
  title: "components/Callout",
  component: Callout,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    icon: BookIcon,
    children: "Callout content",
    title: "Title",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
