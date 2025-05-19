import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
  // JS/TS/React rules for all files, but no TS parser/project
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: globals.browser,
    },
    plugins: {
      js,
      react: pluginReact,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
    },
    settings: {
      react: { version: "detect" },
    },
  },
  // Type-aware TS/TSX rules only for src/
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: path.resolve(__dirname, "./tsconfig.json"),
        tsconfigRootDir: __dirname,
        ecmaFeatures: { jsx: true },
      },
      ecmaVersion: 2022,
      sourceType: "module",
      globals: globals.browser,
    },
    plugins: {
      js,
      "@typescript-eslint": tseslint.plugin,
      react: pluginReact,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
    },
    settings: {
      react: { version: "detect" },
    },
  },
]);
