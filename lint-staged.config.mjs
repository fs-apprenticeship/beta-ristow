/**
 * @type {import('lint-staged').Configuration}
 */

const config = {
  "*": [
    "eslint --fix --max-warnings 0 --no-warn-ignored",
    "prettier --ignore-unknown --write",
  ],
  // NOTE: we use the function syntax here to ignore filenames passed by
  // lint-staged. We need to check types against the whole codebase.
  "**/*.{js,jsx,mjs,ts,tsx}": [() => "npm run check-types"],
};

export default config;
