# :teacher: Beverly Ristow

An ongoing experimental project, resembling an adaptive/generative LMS.

## Development

### Getting started

1. Install & run a local Postgres 17 server. You can use [Postgres.app](https://postgresapp.com/) or a [Homebrew service](https://wiki.postgresql.org/wiki/Homebrew), for example.
1. Clone this repo
1. Set up your `.env`; e.g. `cp .env{.example,}` (ensure the `DATABASE_URL` matches your local Postgres server; the value in `.env.example` is standard for local servers and should work for both Postgres.app and Homebrew)
1. Install dependencies; `npm install`
1. Generate the Prisma client; `npx prisma generate`
1. Set up your local DB; `npx prisma migrate dev` (or `npx prisma migrate reset`)
1. Seed your local DB; `npx prisma db seed`
1. Run the Next.js server; `npm run dev`

### Next.js

To learn more about Next.js, take a look at the following resources:

- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Next.js GitHub repository](https://github.com/vercel/next.js) - feedback and contributions welcome.

### Project structure

Generally, we adhere to [bulletproof-react](https://github.com/alan2207/bulletproof-react) guidelines. In particular, we aim to [factor our code into feature domains and maintain a unidirectional codebase](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md):

![](https://github.com/alan2207/bulletproof-react/raw/master/docs/assets/unidirectional-codebase.png)

### Prisma

We use the [Prisma ORM](https://www.prisma.io/docs/orm) to interact with our database.

#### Local DB

For local development, use Postgres.app or a Homebrew service to run a local Postgres server. The `DATABASE_URL` in `.env.example` should work with most servers. Run `npx prisma migrate dev` or `npx prisma migrate reset` to create your DB and initialize the schema.

To get started, you must run the following:

```bash
npx prisma generate
npx prisma migrate dev
```

##### Seeding

Seed logic lives in `prisma/seed.ts`. Run it with the `npx prisma db seed`.

##### Schema & Migrations

Our ORM, [Prisma](https://www.prisma.io/docs/orm), uses a declarative schema (`prisma/schema.prisma`). To add or change your database structure, update the schema first, then run `npx prisma migrate dev` to create and apply migrations against your local database. See the [Prisma schema docs](https://www.prisma.io/docs/orm/prisma-schema) and [Prisma Migrate docs](https://www.prisma.io/docs/orm/prisma-migrate) for details.

##### Prisma Studio

Use `npx prisma studio` to browse and edit local data in a lightweight UI. For more details, see the [Prisma Studio docs](https://www.prisma.io/studio).

### Linting & Formatting

[Husky](https://typicode.github.io/husky/) with [lint-staged](https://github.com/lint-staged/lint-staged) provide pre-commit hooks; see `.lintstagedrc.json` and `.husky/pre-commit` for details. Note that, if needed, you can skip these hooks using the `--no-verify` flag; e.g., `git commit --no-verify`.

We use [ESLint](https://eslint.org/) for linting (`npm run lint`), and [Prettier](https://prettier.io/) for formatting (`npm run format`). We automatically fix lint issues & apply formatting in the pre-commit hook.

Use `npm run check-types` to... well, check types. This is also performed in the pre-commit hook.

## Deployment

The application is deployed and hosted by Vercel; https://vercel.com/flatiron-school/beverly-ristow.

Note: deployments are promoted to production only when the “Lint & Test” GitHub Action passes (see `.github/workflows/ci.yml`).

### Postgres

[Neon](https://neon.com/) is the managed Postgres provider for deploy previews and production, configured through Vercel (https://vercel.com/flatiron-school/~/stores).

The Neon/Vercel integration provides the database connection URLs through Vercel environment variables. Each Vercel deploy preview will have its own dedicated Postgres branch from Neon, which is a copy of production.

#### DB Admin

The production database is accessible through the following:

1. The Neon console (through [Vercel](https://vercel.com/flatiron-school/~/integrations/neon/icfg_9wsSAxWhjD0i2V5jeAbCo4Br/resources/storage/store_HWaypUpbShQMku9s/guides); click "Open in Neon")
1. A locally run Prisma Studio; e.g. `npx prisma studio --url <production-postgres-url>`
1. A locally run DB editor connected to the production URL; e.g. [Postico](https://eggerapps.at/postico2/)

:warning: If used, be careful to remember that you are operating on production data! Close your connection immediately after use to avoid mistaken operations. That is, if you use Prisma Studio on your local DB often, it's easy to forget you're connected to prod—avoid that!
