import { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import Badge from "@/components/Badge";

const meta: Meta<typeof Badge> = {
  title: "components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    children: "Badge",
    onClose: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
  },
};
