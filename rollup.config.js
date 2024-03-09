const typescript = require("@rollup/plugin-typescript");
const { defineConfig } = require("rollup");

module.exports = defineConfig({
  input: "src/index.ts",
  output: [
    { format: "esm", entryFileNames: "[name].mjs" },
    { format: "cjs", entryFileNames: "[name].js" },
  ].map((output) => ({
    sourcemap: true,
    dir: "dist",
    preserveModules: true,
    ...output,
  })),
  plugins: [typescript()],
});
