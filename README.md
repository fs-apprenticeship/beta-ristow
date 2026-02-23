# :teacher: Beverly Ristow

An ongoing experimental project, resembling an adaptive/generative LMS.

## Development

### Quickstart

```bash
git clone git@github.com:flatiron-labs/beverly-ristow.git # clone this repo
cd beverly-ristow
npm install # install dependencies
npm run dev # run the NextJS server (http://localhost:3000)
```

### Next.js

To learn more about Next.js, take a look at the following resources:

- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Next.js GitHub repository](https://github.com/vercel/next.js) - feedback and contributions welcome.

### Linting & Formatting

[Husky](https://typicode.github.io/husky/) with [lint-staged](https://github.com/lint-staged/lint-staged) provide pre-commit hooks; see `.lintstagedrc.json` and `.husky/pre-commit` for details. Note that, if needed, you can skip these hooks using the `--no-verify` flag; e.g., `git commit --no-verify`.

We use [ESLint](https://eslint.org/) for linting (`npm run lint`), and [Prettier](https://prettier.io/) for formatting (`npm run format`). We automatically fix lint issues & apply formatting in the pre-commit hook.

Use `npm run check-types` to... well, check types. This is also performed in the pre-commit hook.

## Deployment

https://vercel.com/flatiron-school/beverly-ristow

Note: deployments are promoted to production only when the “Lint & Test” GitHub Action passes (see `.github/workflows/ci.yml`).
