import type { Preview } from "@storybook/react-vite";

import "../public/css/droid-sans.css";
import "../src/css/main.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
