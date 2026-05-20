/**
 * Normalize an OEM/part-number string so that variations resolve to one form.
 *
 * Examples — all collapse to "1R1808":
 *   "1R-1808", "1R 1808", "1R/1808", "1r1808",
 *   "CAT 1R-1808", "CAT-1R-1808", "Caterpillar 1R1808"
 *
 * Strategy:
 *   1. Uppercase.
 *   2. Strip a known brand prefix from the head (CAT, KOMATSU, ...).
 *   3. Strip every non-alphanumeric character.
 */
const BRAND_PREFIXES = [
  "CATERPILLAR",
  "CAT",
  "KOMATSU",
  "HITACHI",
  "VOLVO",
  "HYUNDAI",
  "JCB",
  "XCMG",
  "SDLG",
  "SHANTUI",
  "DOOSAN",
  "SANY",
  "LIEBHERR",
  "DONALDSON",
  "FLEETGUARD",
  "MANN",
  "PARKER",
  "HYDAC",
  "WIX",
  "BALDWIN",
  "SAKURA",
  "HENGST",
  "SF",
  "SF FILTER",
];

export function normalizeOem(input: string): string {
  if (!input) return "";
  let s = input.toUpperCase().trim();

  // Strip a leading brand token if present (and the separator after it).
  for (const brand of BRAND_PREFIXES) {
    if (s.startsWith(brand)) {
      const tail = s.slice(brand.length);
      // Only strip if the brand is followed by a non-alphanumeric separator
      // — protects against partial matches like "CATAMOUNT".
      if (tail === "" || /^[^A-Z0-9]/.test(tail)) {
        s = tail.trim();
        break;
      }
    }
  }

  return s.replace(/[^A-Z0-9]/g, "");
}

/**
 * Build the regex pattern used to find a product whose `oem` / `oemNumbers`
 * matches the user's query under normalization. We can't run normalize on
 * stored values without an index, so we OR two strategies:
 *   1. The literal (case-insensitive) substring  → cheap, hits indexed text.
 *   2. The normalized form treated as a "loose" pattern where any non-alnum
 *      char is allowed between digits/letters in the stored value.
 */
export function buildOemRegex(query: string): RegExp {
  const normalized = normalizeOem(query);
  if (!normalized) return new RegExp(escapeRegex(query), "i");
  // Convert "1R1808" into "1[^A-Z0-9]*R[^A-Z0-9]*1[^A-Z0-9]*8[^A-Z0-9]*0[^A-Z0-9]*8"
  const loose = normalized.split("").map(escapeRegex).join("[^A-Za-z0-9]*");
  return new RegExp(loose, "i");
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
