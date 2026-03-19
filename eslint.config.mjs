import markdown from "@eslint/markdown";
import vitest from "@vitest/eslint-plugin";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import boundaries from "eslint-plugin-boundaries";
import checkFile from "eslint-plugin-check-file";
import githubAction from "eslint-plugin-github-action";
import importPlugin from "eslint-plugin-import";
import perfectionist from "eslint-plugin-perfectionist";
import security from "eslint-plugin-security";
import yml from "eslint-plugin-yml";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...githubAction.configs.recommended,
  ...yml.configs.recommended,
  {
    ...perfectionist.configs["recommended-natural"],
    files: ["**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}"],
  },
  security.configs.recommended,
  {
    extends: ["markdown/recommended"],
    files: ["**/*.md"],
    plugins: { markdown },
  },
  {
    files: [
      "**/*.{test,spec}.{js,jsx,ts,tsx}",
      "**/__tests__/**/*.{js,jsx,ts,tsx}",
    ],
    ...vitest.configs.recommended,
  },
  {
    plugins: { import: importPlugin },
    rules: {
      "import/no-duplicates": "error",
    },
  },
  {
    plugins: { "check-file": checkFile },
    rules: {
      "check-file/filename-naming-convention": [
        "error",
        {
          "**/*.{js,jsx,mjs,ts,tsx}": "KEBAB_CASE",
        },
        {
          /*
           * Ignore the middle extensions of the filename to support filenames
           * like bable.config.js or smoke.spec.ts
           */
          ignoreMiddleExtensions: true,
        },
      ],
      "check-file/folder-naming-convention": [
        "error",
        {
          /*
           * all folders within src (except __tests__) should be named in
           * kebab-case
           */
          "src/**/!(__tests__)": "KEBAB_CASE",
        },
      ],
    },
  },
  /*
   * Enforce unidirectional codebase
   * - App can import from features and shared, but not the other way around
   * - Features cannot import from other features
   * - Features can import from shared, but not the other way around
   * - Special-case: Prisma cannot be used directly by app
   */
  {
    plugins: {
      boundaries,
    },
    rules: {
      ...boundaries.configs.recommended.rules,
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              allow: ["app", "feature", "shared", "test"],
              from: ["app"],
              message:
                "Compose routes from features, shared modules, and test utilities only.",
            },
            {
              disallow: ["prisma"],
              from: ["app"],
              message:
                "Do not use Prisma directly in src/app. Access data through a feature module.",
            },
            {
              allow: [
                ["feature", { elementName: "${from.elementName}" }],
                "shared",
                "prisma",
                "test",
              ],
              from: ["feature"],
              message:
                "Features are isolated. Import from the same feature or shared modules only.",
            },
            {
              allow: ["shared", "prisma"],
              from: ["shared"],
              message: "Shared modules must not depend on app or feature code.",
            },
            {
              allow: ["generated"],
              from: ["prisma"],
              message: "Prisma modules may import generated clients only.",
            },
            {
              allow: ["prisma", "shared", "generated"],
              from: ["test"],
              message:
                "Tests may import shared, prisma, and generated code only.",
            },
          ],
        },
      ],
      "boundaries/entry-point": "off",
    },
    settings: {
      ...boundaries.configs.recommended.settings,
      "boundaries/elements": [
        {
          mode: "file",
          pattern: "src/app/**",
          type: "app",
        },
        {
          capture: ["elementName"],
          pattern: "src/features/*",
          type: "feature",
        },
        {
          pattern: "src/lib/prisma",
          type: "prisma",
        },
        {
          pattern: "src/test/**",
          type: "test",
        },
        {
          pattern: "src/generated/**",
          type: "generated",
        },
        {
          capture: ["elementName"],
          pattern: "src/!(app|features)",
          type: "shared",
        },
      ],
    },
  },
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/generated/**",
  ]),
]);

export default eslintConfig;
