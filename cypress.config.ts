import { defineConfig } from "cypress";

export default defineConfig({
  fixturesFolder: "test/fixtures",
  viewportWidth: 800,
  viewportHeight: 600,
  component: {
    specPattern: "test/components/**/*.{spec,test,cy}.ts?(x)",
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
  e2e: {
    watchForFileChanges: false,
  },
});
