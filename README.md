# Aipithet

Aipithet is a second take on the AI-EDI labeling platform.

## Getting Started

Make sure to use `pnpm` to respect the project's lockfile:

```bash
pnpm install
```

You can then run the dev server:

```bash
pnpm dev
```

### Database migrations

You can generate migrations locally to update the database schema:

```bash
pnpm db:generate
```

and then apply newly generated migrations to the database instance accessible through your `.env`
variables:

```bash
pnpm db:migrate
```

## Details

### Authentication

Authentication is built directly into our database without any external services. We currently
provide only email & password flow with confirmation codes used to both confirm users' emails and
allow for invitations.

### Authorization

Throughout the app, authorization draws on two complementary strategies: role-based access control
and database query helpers (reusable user-based `WHERE` clauses) for some more granular semblant of
attribute-based access control.

### Internationalization (i18n)

Use of translations is twofold: some translations such as UI contents and error messages are
hard-coded at the app level, others such as project titles and descriptions are defined dynamically
and saved in the database.

#### App-level translations

Aipithet uses Inlang and Paraglide-js for translated in-app messages.

#### Database-level translations

A versatile approach is adopted to allow easy addition of languages in the future without requiring
any extensive schema modification.

## Production

Things are not deployed yet. This is still early work in progress and is more provided to illustrate
the proposed data model.
