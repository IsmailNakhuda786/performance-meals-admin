# Performance Meals Shopify app

This directory contains the server-side Shopify application. The repository
root remains the Figma Make prototype so its preview continues to work.

## Development store setup

1. Install the Shopify CLI and log in to the Shopify Partner account that owns
   the development store.
2. From this directory, run `pnpm install`.
3. Run `pnpm config:link` and select or create the Performance Meals app.
4. Run `pnpm dev`, select the development store, and install the app.

The CLI supplies `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `SHOPIFY_APP_URL`, and
`SCOPES` during development. Do not commit those values.

## Current integration boundary

- Shopify OAuth, embedded sessions, App Bridge, and webhook verification use
  Shopify's official React Router packages.
- Session data is stored with Prisma and SQLite for local development.
- The authenticated `/app` route performs a live Admin GraphQL query for store
  identity and products before rendering the imported admin portal.
- Portal tables still use prototype data. Replace each dataset with route
  loaders/actions as the corresponding Shopify resource is integrated.

## Verification

```sh
pnpm setup
pnpm typecheck
pnpm build
```

Before production deployment, select persistent database and hosting providers,
configure their environment secrets, and change the Prisma datasource if the
host does not provide persistent local storage.
