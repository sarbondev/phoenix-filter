# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Three independent npm packages, no workspaces — install per package:

- `server/` — Express + TypeScript + Mongoose API (`tsx watch` in dev, port `4000`)
- `admin/` — Vite + React 19 SPA (port `5173`, proxies `/api`, `/uploads`, `/socket.io` to the server)
- `client/` — Next.js 15 (App Router, Turbopack) public storefront

## Common commands

Run inside the relevant package directory.

| Package | Dev | Build | Lint | Other |
|---|---|---|---|---|
| `server` | `npm run dev` | `npm run build` | `npm run lint` | `npm run typecheck`, `npm run seed`, `npm run seed:phoenix`, `npm run parse:phoenix`, `npm start` (prod) |
| `admin` | `npm run dev` | `npm run build` (runs `tsc -b` then Vite) | `npm run lint` | `npm run preview` |
| `client` | `npm run dev` | `npm run build` | `npm run lint` | `npm start` |

There is no test runner configured in any package. Don't claim tests pass — there are none to run.

The server requires `.env` with `MONGODB_URI`, `JWT_SECRET` (≥32 chars), and `GEMINI_API_KEY`. Validation lives in `server/src/config/env.ts` (Zod) and the process exits on bad config.

## Server architecture

Per-domain folders under `server/src/modules/<name>/` follow a strict layered convention. Adding a new resource means creating all six files:

```
<name>.entity.ts      Mongoose interface + Response DTO + toResponse() mapper
<name>.schema.ts      Mongoose model + Zod request schemas (Create/Update DTOs)
<name>.repository.ts  Data access — only place that touches the model
<name>.service.ts     Business logic, takes repository in constructor
<name>.controller.ts  Express handlers, takes service in constructor
<name>.routes.ts      Wires repo→service→controller, applies middleware, exports Router
```

Then register the router in `server/src/app.ts` under `${api}/<name>`. Dependency injection is manual at the bottom of each `*.routes.ts` — there is no DI container.

**Cross-cutting infrastructure** lives in `server/src/shared/`:

- `middleware/auth.middleware.ts` — `authenticate` (JWT bearer → `req.user`) and `authorize(...roles)` (e.g. `'ADMIN'`, `'CALL_MANAGER'`). Applied per-route in `*.routes.ts`.
- `middleware/validate.middleware.ts` — `validate({ body, query, params })` runs Zod schemas; ZodErrors are caught by the global handler and returned as 422.
- `middleware/error-handler.middleware.ts` — defines `AppError`, `NotFoundError`, `ValidationError`, `UnauthorizedError`, `ForbiddenError`, `ConflictError`. Throw these from services; the global handler maps them plus Mongoose/Zod errors to JSON responses. Wrap async controller methods with `asyncHandler(...)`.
- `middleware/locale.middleware.ts` — sets `req.locale` from `?lang=` or `Accept-Language` (one of `uz | ru | en | kz`, default `en`).

## Multi-language data model (critical)

User-facing text is stored as `TranslatedField = { uz, ru, en, kz }` (defined in `server/src/shared/types/common.types.ts`), not as plain strings. This affects every layer:

- **Write path:** services call `geminiService.translate(...)` (`shared/services/gemini.service.ts`) to fill all four languages from a single source string before saving. See `ProductService.create` for the pattern.
- **Read path:** by default responses are flattened to the requested locale via `localizeResponse(data, req)` (`shared/utils/localize.ts`), which deep-walks the response and replaces any `TranslatedField`-shaped object with its locale string. Pass `?fullTranslation=true` to receive all four languages — the admin panel uses this for editing forms; the storefront does not.
- When adding a new translatable field, type it as `TranslatedField` in the entity, include it in the Gemini translate call in the service, and the locale middleware/utility will handle the rest.

## Real-time updates

`socket.service.ts` wraps Socket.io. Auth uses the same JWT as REST (passed via `socket.handshake.auth.token`). Connected sockets join three rooms: `role:<ROLE>`, `user:<id>`, and `staff` (admins + call managers). Services emit domain events via `emitToAll(...)` after writes (e.g. `order:new`, `product:updated`).

The admin panel (`admin/src/hooks/useSocket.ts`) listens for these events and calls `baseApi.util.invalidateTags([...])` to refresh RTK Query caches — this is how admin lists stay live without polling. When you add a new resource that the admin should see live, you must:
1. Add a `tagTypes` entry in `admin/src/store/api/baseApi.ts`.
2. Emit the socket event from the server service.
3. Wire the listener in `useSocket.ts` to invalidate that tag.

## Admin frontend (`admin/`)

Plain Vite SPA, React Router v7, Redux Toolkit + RTK Query. One `baseApi` (`admin/src/store/api/baseApi.ts`) with `injectEndpoints` per resource (`productApi.ts`, `orderApi.ts`, etc.). Auth token is read from the `auth` slice and attached as `Authorization: Bearer ...` automatically; a 401 dispatches `logout()`.

Routing in `App.tsx` wraps most pages in `<AdminOnly>`, which redirects non-`ADMIN` users (e.g. call managers see only orders/reviews/product-requests/settings).

Path alias `@/*` → `admin/src/*`. Vite dev server proxies `/api`, `/uploads`, and `/socket.io` to `localhost:4000`, so the SPA fetches with same-origin paths.

## Client frontend (`client/`)

Next.js 15 App Router with **Feature-Sliced Design** layering:

- `app/[lang]/...` — route segments, all pages live under a locale dynamic segment
- `widgets/` — large composed sections (header, footer, hero, navbar)
- `features/` — user-facing interactions (smart-search, product-request, wishlist, toast)
- `entities/` — domain UI (product card, category card, etc.)
- `shared/` — UI primitives, hooks, i18n dictionaries, types

Locale routing is enforced by `client/src/middleware.ts`: any path without one of `uz | ru | en | kz` is redirected to `/ru/...`. Server requests should pass `?lang=<locale>` to get localized strings back (see locale middleware above).

Same RTK Query pattern as admin — single `baseApi` with `injectEndpoints` per resource under `client/src/store/api/`.

## Filter catalogue domain

This is a B2B/B2C filter shop built around the **Phoenix Catalogue 2024** (~3,300 SKUs). The killer use case is *cross-reference search*: a customer types their old filter's part number (e.g. `71769795` from a FIAT) and lands on the matching Phoenix product. Treat that flow as the most important UX path.

### Category hierarchy

Two top-level roots, set up in `server/src/scripts/restructure-categories.ts`:

- **Avto** (`slug: avto`) — all 18 catalogue subcategories nest under it (Air Filter EUR/JP/KR/USA, Cabin Air, Channel Air, ECO Oil & Fuel, Heavy Duty ×4, In-Tank Fuel, Inline Fuel, LPG, Spin-On Oil ×3, Transmission)
- **Maishiy** (`slug: maishiy`) — empty placeholder for future household filters

Filtering by parent category traverses descendants: `ProductService.expandCategoryFilter` → `CategoryRepository.collectDescendants` returns `[parentId, ...allChildIds]`, then `ProductRepository.findAll` matches `category.$in: [...ids]`. The product page accepts both `?category=<id>` and `?categorySlug=<slug>` (slug→id resolved client-side via `useGetCategoriesQuery`).

### Filter-specific Product fields

Beyond standard e-commerce fields, `Product` carries six filter-domain fields (defined in `server/src/modules/products/product.entity.ts`):

- `oem?: string` — primary OEM number from the vehicle manufacturer
- `crossReferences: Array<{ partNumber, manufacturer }>` — equivalent part numbers from other brands (MANN, FRAM, WIX, etc.). **Indexed and text-searchable** — this is what powers the cross-reference search.
- `material?: string` (e.g. "Aluminum Case")
- `application?: string` — vehicle compatibility text (e.g. "Sonata 99'~05' Trajet 2.0 2.7")
- `dimensions?: { height, outerDiameter, innerDiameter, threadSize, inletDiameter, outletDiameter }`
- `vehicleBrand?: string` — uppercase brand from PDF section header (HYUNDAI, OPEL, etc.)

`ProductRepository.findAll` `search` filter ORs across `name.{uz,ru,en}`, `description.*`, `sku`, `oem`, `application`, and `crossReferences.partNumber` — so a customer's free-text query hits any of these.

### Phoenix import pipeline

- Source PDFs live in `~/Downloads/PHOENIX CATALOGUE 2024/` (not in repo)
- `server/scripts/parse-phoenix-catalogue.py` (Python, requires `pdftotext` from `brew install poppler`) parses all 18 PDFs:
  - Format A (LPG, Channel, Spin-On Oil ×3, In-Tank, Inline Fuel) — split-by-2-spaces row parsing
  - Format B (Air filters, Cabin Air, Heavy Duty ×4, ECO, Transmission) — TSV bounding-box parsing via `pdftotext -tsv` (column anchors derived from header word x-positions)
- Output: `server/seeds/phoenix-products.json` (~875 KB, 3,353 SKUs, 23,000 cross-references) — committed so seeding is deterministic without re-parsing
- `server/src/seed-phoenix.ts` reads the JSON, ensures the 18 categories exist (idempotent by slug), and bulk-inserts products skipping any SKU already in the DB
- One-off helper scripts in `server/src/scripts/` for re-parenting categories under Avto and toggling activation/stock

When you add a new filter category to the catalogue, you must:
1. Add a mapping in `category_for()` in the parser script
2. Add a parser config block in `parse_pdf()` for that PDF's format
3. Re-run `npm run parse:phoenix` then `npm run seed:phoenix`

### Where the filter UX lives

- Smart search dropdown (`client/src/features/smart-search/SmartSearch.tsx`) — `MatchHint` subcomponent inspects each result against the user's query and surfaces *which field matched* (OEM, cross-reference + manufacturer, or default category/SKU). This is essential — without it, a customer typing "71769795" sees a product called "Phoenix NF-G2911" and has no idea why it matched.
- Product detail (`client/src/app/[lang]/products/[slug]/ProductDetailClient.tsx`) — renders SKU/OEM/brand pills, application box, dimensions table, and the grouped cross-reference table.
- Product card (`client/src/entities/product/ProductCard.tsx`) — shows SKU, vehicleBrand pill, and application as a one-line subtitle.
- Admin product form (`admin/src/pages/products/ProductForm.tsx`) — fieldsets for filter details, dimensions, and a dynamic cross-reference list editor.

## Conventions worth following

- New REST resources go through the six-file module pattern above; don't shortcut by putting logic in routes/controllers.
- Throw `AppError` subclasses from services rather than returning error objects — the global handler does the rest.
- Don't bypass `localizeResponse` by hand-picking a language in the controller; the middleware + util exist precisely so controllers stay locale-agnostic.
- When deleting a module (e.g. the `banners` removal already done), remove all of: server module folder, server route registration in `app.ts`, admin/client `*Api.ts` slice, the tag entry in `baseApi.tagTypes`, socket listeners in `useSocket.ts`, and any UI pages — these are all coupled.
- The admin's `Select` component takes `options` as a prop (array of `{value, label}`) — passing JSX `<option>` children breaks it (`options.map` on undefined). See `admin/src/components/ui/Select.tsx`.
