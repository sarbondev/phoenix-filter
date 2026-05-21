/**
 * Deterministic decorative placeholder photos via Picsum.
 *
 * These purely *decorate* static marketing pages (about, services, projects,
 * industries…) that have no data-backed image of their own. They mirror the
 * server seed approach (`server/src/seed-init.ts`) so the storefront never
 * shows bare grey boxes. Each call keeps a stable `seed`, so the same photo
 * renders across reloads. Swap for real art-directed photos when available.
 *
 * Seeds here start at 100 to avoid colliding with the seed-init range (11–71).
 */
export const decorImg = (seed: number, w = 1200, h = 800): string =>
  `https://picsum.photos/seed/pf${seed}/${w}/${h}`;
