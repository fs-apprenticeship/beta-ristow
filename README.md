# :teacher: Beverly Ristow

An ongoing experimental project, resembling an adaptive/generative LMS.

## Development

### Getting started

1. Install the [mise-en-place](https://mise.jdx.dev/getting-started.html) tool version manager
1. Install and run a local Postgres 17 server; on MacOS, use [Postgres.app](https://postgresapp.com/)
1. Clone this repo and `cd` into your clone
1. Ensure proper tool versions; `mise trust && mise install`
1. Set up your local dotenv files; `cp .env{.example,} && cp .env.test{.example,}`
1. Install dependencies; `npm install`
1. Generate the Prisma client; `npx prisma generate`
1. Set up your test DB; `NODE_ENV=test npx prisma migrate reset --force`
1. Run tests; `npm test`
1. Set up your development DB; `npx prisma migrate dev` (or `npx prisma migrate reset`)
1. Seed your development DB; `npx prisma db seed`
1. Run the Next.js server (and [Prisma Studio](#prisma-studio)); `npm run dev`

### Next.js

To learn more about Next.js, take a look at the following resources:

- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Next.js GitHub repository](https://github.com/vercel/next.js) - feedback and contributions welcome.

### Clerk

We use [Clerk](https://clerk.com/) for authentication and user/session management.

For local development, set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in `.env` (see `.env.example`). You can test auth flows at `/sign-in` and `/sign-up`; route protection is enforced in `src/proxy.ts`.

### Project structure

Generally, we adhere to [bulletproof-react](https://github.com/alan2207/bulletproof-react) guidelines. In particular, we aim to [factor our code into feature domains and maintain a unidirectional codebase](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md):

![](https://github.com/alan2207/bulletproof-react/raw/master/docs/assets/unidirectional-codebase.png)

### Prisma

We use the [Prisma ORM](https://www.prisma.io/docs/orm) to interact with our database.

#### Local DB

For local development, use Postgres.app or a Homebrew service to run a local Postgres server. The `DATABASE_URL` in `.env.example` should work with most servers. Run `npx prisma migrate dev` or `npx prisma migrate reset` to create your DB and initialize the schema. Note that you must also generate your local Prisma client; `npx prisma generate`.

#### Seeding

Seed logic lives in `prisma/seed.ts`. Run it with the `npx prisma db seed`.

#### Schema & Migrations

Our ORM, [Prisma](https://www.prisma.io/docs/orm), uses a declarative schema (`prisma/schema.prisma`). To add or change your database structure, update the schema first, then run `npx prisma migrate dev` to create and apply migrations against your local database. See the [Prisma schema docs](https://www.prisma.io/docs/orm/prisma-schema) and [Prisma Migrate docs](https://www.prisma.io/docs/orm/prisma-migrate) for details.

Note: you will need to keep your test database in sync as well: `NODE_ENV=test npx prisma migrate reset --force`.

#### Prisma Studio

Use `npx prisma studio` to browse and edit local data in a lightweight UI. For more details, see the [Prisma Studio docs](https://www.prisma.io/studio).

### Testing

Vitest is our test runner.

We use `vitest-axe` for accessibility assertions in component tests.

Importantly, we use an isolated test DB. This means any changes to the schema need to be applied to the test database as well: `NODE_ENV=test npx prisma migrate reset --force`.

We use a transactional test setup for Prisma along with generated factories:

- With help from [transactional-prisma-testing](https://github.com/chax-at/transactional-prisma-testing), each test runs in a DB transaction which is rolled back after the test.
- The [factory-js](https://github.com/factory-js/factory-js?tab=readme-ov-file#prisma-plugin) Prisma plugin provides generated factories, which we wrap in `src/test/factories/*` to initialize and override any defaults necessary (which [faker](https://github.com/faker-js/faker) helps with).

After changing the Prisma schema, run `npx prisma generate` to refresh the factories.

### Linting & Formatting

[Husky](https://typicode.github.io/husky/) with [lint-staged](https://github.com/lint-staged/lint-staged) provide pre-commit hooks; see `.lintstagedrc.json` and `.husky/pre-commit` for details. Note that, if needed, you can skip these hooks using the `--no-verify` flag; e.g., `git commit --no-verify`.

We use [ESLint](https://eslint.org/) for linting (`npm run lint`), and [Prettier](https://prettier.io/) for formatting (`npm run format`). We automatically fix lint issues & apply formatting in the pre-commit hook.

Use `npm run check-types` to... well, check types. This is also performed in the pre-commit hook.

## Deployment

The application is deployed and hosted by Vercel; https://vercel.com/flatiron-school/beverly-ristow.

Note: deployments are promoted to production only when the “Lint & Test” GitHub Action passes (see `.github/workflows/ci.yml`).

### Postgres

[Neon](https://neon.com/) is the managed Postgres provider for deploy previews and production, configured through Vercel (https://vercel.com/flatiron-school/~/stores).

The **Vercel-managed** Neon integration provides the database connection URLs through Vercel environment variables. Each Vercel deploy preview will have its own dedicated Postgres branch from Neon, which is a copy of production. For more details, see [this page](https://neon.com/docs/guides/vercel-managed-integration).

#### DB Admin

The production database is accessible through the following:

1. The Neon console (through [Vercel](https://vercel.com/flatiron-school/~/integrations/neon/icfg_9wsSAxWhjD0i2V5jeAbCo4Br/resources/storage/store_HWaypUpbShQMku9s/guides); click "Open in Neon")
1. A locally run Prisma Studio; e.g. `npx prisma studio --url <production-postgres-url>`
1. A locally run DB editor connected to the production URL; e.g. [Postico](https://eggerapps.at/postico2/)

:warning: If used, be careful to remember that you are operating on production data! Close your connection immediately after use to avoid mistaken operations. That is, if you use Prisma Studio on your local DB often, it's easy to forget you're connected to prod—avoid that!
