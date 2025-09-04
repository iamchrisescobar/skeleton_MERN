import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,ts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      }
    }
  },
  tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    rules: {
      // These will catch your issues
      "@typescript-eslint/no-non-null-assertion": "error", // Catches port!
      "@typescript-eslint/no-unused-vars": "error",
      "no-constant-condition": "error",
      "prefer-const": "error"
    }
  }
]);