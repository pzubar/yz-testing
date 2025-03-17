import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["/test/setup.ts"],
  },
  resolve: {
    alias: {
      "@yz": resolve(__dirname, "src/"),
    },
  },
});
