# Hammer SolidStart SSR

A self-contained **SolidStart 2 streaming SSR** fixture for testing GitHub imports, Node application servers, server/client module boundaries, hydration, route-level data, prerendering, API handlers, mutations, cookies, and HTTP semantics in edit-test.dev.

It uses the current stable SolidStart 2 toolchain and the official project structure: Vite environment builds plus Nitro 3's Node server output.

## Runtime and commands

SolidStart 2 requires **Node.js 24 or newer**.

- `npm install`
- `npm run dev` — SSR development server on `0.0.0.0`
- `npm run typecheck` — strict TypeScript check
- `npm run build` — client, SSR, Nitro server, and `/static` prerender builds
- `npm start` — run `.output/server/index.mjs`
- `npm run preview` — preview the completed production build through Vite
- `npm run check` — typecheck and production build
- `npm run test:smoke` — typecheck, build, start the Node server, and assert the HTTP matrix

### Hammer built-in npm compatibility

The checked-in lockfile is emitted with npm 10.9.2 so Hammer's built-in npm can install it directly. Newer npm 11 releases add `libc` selector metadata that is not part of Hammer's currently modeled lockfile surface; the npm 10 lock preserves the same package versions, registry URLs, integrity hashes, and dependency graph without those fields.

The optional Rolldown WASI binding and `NAPI_RS_ENFORCE_VERSION_CHECK` environment setting let the same Vite commands run through Hammer's WJS runtime as well as a conventional Node.js installation. Keep the committed lockfile when importing the fixture.

## Rendering and protocol matrix

| Route | Behavior under test |
| --- | --- |
| `/` | Request-time server query, SSR HTML, static asset, hydrated Solid counter |
| `/products/anvil` | Dynamic parameter, server-only data module, serialized query |
| `/products/unknown` | Data-dependent 404 from a dynamic route |
| `/static` | Explicit Nitro build-time prerender target |
| `/stream` | Immediate shell plus delayed server resource through nested Suspense |
| `/client` | SSR shell/fallback plus lazy `clientOnly()` browser module using localStorage |
| `/session` | Progressive `<form method="post">`, server action, validation, signed HTTP-only session cookie, redirect, revalidation |
| `/api/status` | GET headers/JSON and POST JSON echo |
| `/api/products/:id` | Dynamic API route and API-level 404 |
| `/redirect` | HTTP 302 and Location header |
| `/error` | Intentional SSR render failure handled with status 500 |
| any other path | Filesystem catch-all with status 404 |

## Suggested edit-test.dev checks

1. Import the GitHub repository and confirm Node 24 is selected before installing.
2. Run `npm run dev`, then inspect page source at `/`: the heading, counter value, and server snapshot should already be HTML.
3. Click the counter and confirm its state label changes from “awaiting hydration” to “Hydrated in the browser.”
4. Open `/products/anvil` directly to exercise a fresh dynamic SSR request.
5. Load `/stream` with throttling and observe the shell/fallback before the delayed result arrives.
6. Load `/client` with JavaScript disabled (server fallback), then enabled (browser panel).
7. Submit `/session`, verify the redirect and cookie, then edit validation or session fields and repeat.
8. Exercise `/redirect`, `/error`, a missing route, and both API methods while watching status codes and headers.
9. Run `npm run test:smoke`, then start the artifact independently with `npm start`.

## Fixture-only security note

The session signing key is deliberately checked in so the fixture runs without secrets. It is labelled and scoped as test data. Replace it with a high-entropy environment secret before adapting this code for a real application.

No database, external API, third-party account, or network access is required after dependency installation.
