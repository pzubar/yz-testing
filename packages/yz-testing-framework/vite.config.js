// <reference types="vitest" />;
import { resolve } from "path";
import { defineConfig } from "vite";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  plugins: [typescript()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "yz-testing",
      fileName: "yz-testing",
    },
    minify: false, // Disable minification
  },
  resolve: {
    alias: {
      "@yz": resolve(__dirname, "src/"),
    },
  },
  test: {
    environment: "jsdom",
  },
});
