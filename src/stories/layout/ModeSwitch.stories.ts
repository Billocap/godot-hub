import type { Meta, StoryObj } from "@storybook/react-vite";

import ModeSwitch from "@/components/ModeSwitch";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof ModeSwitch> = {
  title: "layout/ModeSwitch",
  component: ModeSwitch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
