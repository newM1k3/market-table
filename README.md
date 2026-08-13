# Market Table

> **Status:** The interface is useful for product exploration, but authentication and server-managed data must not be treated as production-ready. The current SMS flow is a demo and must be replaced before any real user account data is accepted.

## What it does

Market Table is a mobile-focused web app for planning a visit to an Ontario farmers’ market. It brings together seasonal produce, recipes, vendors, market maps, shopping lists, scanning, and an account area. The project combines local sample data with a planned PocketBase backend and Netlify Functions. Several major flows, including SMS sign-in, scanning, analytics, and seasonal refresh, remain prototype or placeholder behaviour rather than production services.

## How the project is organized

| Location | Purpose |
|---|---|
| `src/pages/` | Contains the main screens for home, market, map, scan, and account journeys. |
| `src/components/` | Contains shared user-interface and feature components. |
| `src/hooks/` | Contains client-side stateful behaviour, including authentication helpers. |
| `src/lib/` | Contains PocketBase access and domain helpers. |
| `src/data/` | Contains local or sample market information. |
| `netlify/functions/` | Contains planned SMS, seasonal-sync, and analytics server-side functions. |
| `pocketbase/pb_schema.json` | Describes the intended PocketBase collections. |

## Main technologies

React, TypeScript, Vite, React Router, Tailwind CSS, PocketBase, Netlify Functions, PWA tooling, QR scanning, and Lucide icons.

## Get started

Use **Node.js 20–24** and **npm 10 or later**. The committed `package-lock.json` is the supported dependency snapshot.

```bash
npm ci
npm run dev
```

Open the local address printed by Vite. To prepare a production build, use:

```bash
npm run build
npm run preview
```

## Quality checks

The repository exposes separate checks so they can be run locally or in continuous integration.

```bash
npm run lint
npm run typecheck
npm run build
npm run check
```

`npm run check` runs the three commands above in sequence. These checks validate the source and build configuration; they do not prove that third-party services, browser permissions, payment flows, or device-specific behaviour work in production.

## Configuration and data

Copy `.env.example` for local configuration. Keep browser-visible `VITE_*` values free of secrets. Phone/SMS provider credentials and any administrator tokens belong only in the serverless-function or deployment secret store.

## Review priorities

1. Replace the demo SMS implementation with a rate-limited, cryptographically secure, short-lived, real identity flow; never log codes or return a shared demo token.
2. Fix filename/import casing and add a clean Linux build check so deployments on case-sensitive file systems are reliable.
3. Clearly label mock map, scan, and analytics flows until they persist data through authenticated and authorized APIs.
4. Define PocketBase access rules, derive identity from the authenticated session, scope queries, and avoid unbounded list reads as market data grows.

## Contributing

Keep changes small and reviewable. Run `npm run check` before opening a pull request, preserve the lockfile when changing dependencies, and avoid committing secrets, customer data, personal exports, or generated build output.

## License

No license file is currently included. Add one before distributing the project as open-source software.
