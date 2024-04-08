import globals from "globals";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["src/**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.es2021,
      }
    },
    rules: {
      "curly": "warn",
      "no-var": "warn",
      "camelcase": "warn",
      "semi": "warn",
      "no-use-before-define": "warn",
      "eqeqeq": "warn",
      "no-alert": "error",
      "no-unused-vars": "error",
      "no-undef": "error",
    },
  },
  {
    files: ["spec/**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.jest,
      }
    }
  },
  {
    ignores: ["dist"],
  },
];
