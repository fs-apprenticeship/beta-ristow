import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import githubAction from "eslint-plugin-github-action";
import perfectionist from "eslint-plugin-perfectionist";
import security from "eslint-plugin-security";
import yml from "eslint-plugin-yml";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...githubAction.configs.recommended,
  ...yml.configs.recommended,
  perfectionist.configs["recommended-natural"],
  security.configs.recommended,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  prettier,
]);

export default eslintConfig;
