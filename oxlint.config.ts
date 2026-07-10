import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import svelte from "ultracite/oxlint/svelte";

export default defineConfig({
  extends: [core, svelte],
  ignorePatterns: [
    ...core.ignorePatterns,
    ".playwright-mcp/**",
    "docs/screenshots/**",
  ],
  rules: {
    // Stylistic-only rules that conflict with idiomatic Svelte 5 runes code
    // (bind:value / bind:this / $bindable props read as "never reassigned"
    // by a JS-only analyzer) or with this project's chosen conventions.
    "func-style": "off",
    "sort-keys": "off",
    "unicorn/filename-case": "off",
    "unicorn/prefer-ternary": "off",
    "unicorn/no-immediate-mutation": "off",
    "import/consistent-type-specifier-style": "off",
    "promise/prefer-await-to-then": "off",
    "require-unicode-regexp": "off",
    "prefer-named-capture-group": "off",
  },
  overrides: [
    {
      files: ["**/*.svelte"],
      rules: {
        "prefer-const": "off",
        "no-unassigned-vars": "off",
      },
    },
    {
      // SvelteKit's ambient module pattern requires an empty `export {}`
      // so `declare global` augments rather than shadows the global scope.
      files: ["src/app.d.ts"],
      rules: {
        "unicorn/require-module-specifiers": "off",
      },
    },
  ],
});
