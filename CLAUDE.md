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
| `server` | `npm run dev` | `npm run build` | `npm run lint` | `npm run typecheck`, `npm run seed`, `npm start` (prod) |
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

## Conventions worth following

- New REST resources go through the six-file module pattern above; don't shortcut by putting logic in routes/controllers.
- Throw `AppError` subclasses from services rather than returning error objects — the global handler does the rest.
- Don't bypass `localizeResponse` by hand-picking a language in the controller; the middleware + util exist precisely so controllers stay locale-agnostic.
- When deleting a module (e.g. the `banners` removal currently in progress), remove all of: server module folder, server route registration in `app.ts`, admin/client `*Api.ts` slice, the `Banner` entry in `baseApi.tagTypes`, socket listeners in `useSocket.ts`, and any UI pages — these are all coupled.
