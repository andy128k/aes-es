import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "src/index.mjs",
  outDir: "dist/",
  format: "esm",
  exports: true,
});
