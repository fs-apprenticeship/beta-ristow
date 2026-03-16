/**
 * @type {import('lint-staged').Configuration}
 */
const config = {
  // Excludes core files handled above to prevent the race condition, but formats everything else
  "**/!(package-lock|*.js|*.jsx|*.mjs|*.ts|*.tsx|*.css|*.prisma)": [
    "prettier --ignore-unknown --write",
  ],

  // Domain Specific Formatting and Linting
  "**/*.prisma": ["prisma format", "prisma validate", "prisma-lint"],
  "**/*.{css,module.css}": ["stylelint --fix", "prettier --write"],

  // Atomic Pipeline for Core Code
  "**/*.{js,jsx,mjs,ts,tsx}": [
    "eslint --fix --max-warnings 0",
    "prettier --write",
    () => "npm run check-types",
  ],
};

export default config;
