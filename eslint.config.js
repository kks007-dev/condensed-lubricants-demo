import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function loadOptionalPlugin(name) {
  try {
    return require(name);
  } catch {
    return null;
  }
}

const reactRefresh = loadOptionalPlugin("eslint-plugin-react-refresh");

const reactRefreshConfig = reactRefresh
  ? [
      {
        plugins: {
          "react-refresh": reactRefresh,
        },
        rules: {
          "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
        },
      },
    ]
  : [];

export default [
  {
    ignores: ["dist", ".eslintrc.cjs"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      "no-undef": "off",
    },
  },
  ...reactRefreshConfig,
];
