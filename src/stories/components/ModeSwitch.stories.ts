import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import ModeSwitch from "@/components/ModeSwitch";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof ModeSwitch> = {
  title: "components/ModeSwitch",
  component: ModeSwitch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onClick: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
