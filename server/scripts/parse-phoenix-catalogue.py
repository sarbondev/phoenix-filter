#!/usr/bin/env python3
"""
Parse Phoenix Catalogue 2024 PDFs into a unified JSON file used by the seed script.

Usage:
    python3 server/scripts/parse-phoenix-catalogue.py [PDF_DIR]

If PDF_DIR is omitted, defaults to ~/Downloads/PHOENIX CATALOGUE 2024.

Requires `pdftotext` (poppler) on PATH.
Output: server/seeds/phoenix-products.json — committed so we don't re-parse
on every seed run.

Output JSON shape (one entry per unique Phoenix part number):
    {
      "sku": "NF-G2911",
      "category": "LPG Filter",
      "categoryKey": "lpg-filter",
      "vehicleBrand": null,
      "oem": null,
      "material": "Aluminum Case",
      "application": null,
      "dimensions": {"height": 64, "outerDiameter": 65, "threadSize": "3/4-16UNF"},
      "remark": "LPG FILTER/GAS TYPE",
      "crossReferences": [{"partNumber": "...", "manufacturer": "..."}, ...],
      "sourceFiles": ["LPG FILTER.pdf"]
    }

Cross-PDF dedup: when the same Phoenix Nr appears in multiple catalogues
(common for spin-on oil filters carried in EUR / Japan-Korea / USA), records
are merged: cross-references unioned, dimensions filled from whichever file has
them, all source filenames listed.
"""
from __future__ import annotations

import json
import re
import shutil
import subprocess
import sys
from collections import OrderedDict
from pathlib import Path

DEFAULT_PDF_DIR = Path.home() / "Downloads" / "PHOENIX CATALOGUE 2024"
SCRIPT_DIR = Path(__file__).resolve().parent
SEEDS_DIR = SCRIPT_DIR.parent / "seeds"
OUT_PATH = SEEDS_DIR / "phoenix-products.json"

PHOENIX_NR_RE = re.compile(r"^N[A-Z]{1,3}[-\.][A-Z0-9/.\-]+[A-Z0-9]?$")
SPLIT_RE = re.compile(r"\s{2,}")


def category_for(filename: str) -> dict:
    f = filename.upper()
    if "LPG" in f:
        return {"category": "LPG Filter", "key": "lpg-filter"}
    if "CHANNEL" in f:
        return {"category": "Channel Air Filter", "key": "channel-air-filter"}
    if "EUROPEAN" in f and "AIR" in f:
        return {"category": "Air Filter (European)", "key": "air-filter-european"}
    if "JAPANESE" in f and "AIR" in f:
        return {"category": "Air Filter (Japanese)", "key": "air-filter-japanese"}
    if "KOREAN" in f and "AIR" in f:
        return {"category": "Air Filter (Korean)", "key": "air-filter-korean"}
    if "USA" in f and "AIR" in f:
        return {"category": "Air Filter (USA)", "key": "air-filter-usa"}
    if "HEAVY DUTY AIR" in f:
        return {"category": "Heavy Duty Air Filter", "key": "heavy-duty-air-filter"}
    if "HEAVY DUTY OIL" in f:
        return {"category": "Heavy Duty Oil Filter", "key": "heavy-duty-oil-filter"}
    if "HEAVY DUTY FUEL" in f:
        return {"category": "Heavy Duty Fuel Filter", "key": "heavy-duty-fuel-filter"}
    if "HEAVY DUTY CABIN" in f:
        return {"category": "Heavy Duty Cabin Air Filter", "key": "heavy-duty-cabin-air-filter"}
    if "CABIN AIR" in f:
        return {"category": "Cabin Air Filter", "key": "cabin-air-filter"}
    if "ECO" in f:
        return {"category": "ECO Oil & Fuel Cartridge", "key": "eco-oil-fuel-cartridge"}
    if "IN-TANK" in f or "INTANK" in f:
        return {"category": "In-Tank Plastic Fuel Filter", "key": "in-tank-fuel-filter"}
    if "INLINE FUEL" in f:
        return {"category": "Inline Fuel Filter", "key": "inline-fuel-filter"}
    if "SPIN-ON OIL FILTER FOR EUR" in f:
        return {"category": "Spin-On Oil Filter (European)", "key": "spin-on-oil-european"}
    if "SPIN-ON OIL FILTER FOR JAPAN" in f:
        return {"category": "Spin-On Oil Filter (Japan/Korea)", "key": "spin-on-oil-japan-korea"}
    if "SPIN-ON OIL FILTER FOR USA" in f:
        return {"category": "Spin-On Oil Filter (USA)", "key": "spin-on-oil-usa"}
    if "TRANSMIS" in f:
        return {"category": "Transmission Filter", "key": "transmission-filter"}
    return {"category": "Filter", "key": "filter"}


def is_phoenix_nr(s: str) -> bool:
    return bool(PHOENIX_NR_RE.match(s.strip()))


def to_int(s):
    try:
        return int(s)
    except (TypeError, ValueError):
        return None


def pdf_to_text(pdf_path: Path) -> str:
    result = subprocess.run(
        ["pdftotext", "-layout", str(pdf_path), "-"],
        check=True, capture_output=True, text=True,
    )
    return result.stdout


def pdf_to_tsv(pdf_path: Path):
    """Run `pdftotext -tsv` and yield word records with absolute coordinates.
    Each yielded item is a dict {page, top, left, width, text}."""
    result = subprocess.run(
        ["pdftotext", "-tsv", str(pdf_path), "-"],
        check=True, capture_output=True, text=True,
    )
    page = 0
    for line in result.stdout.splitlines():
        parts = line.split("\t")
        if len(parts) < 12:
            continue
        if parts[0] == "level":
            continue
        try:
            level = int(parts[0])
        except ValueError:
            continue
        if level == 1:
            page += 1
            continue
        if level != 5:
            continue
        text = parts[11]
        if not text or text.startswith("###"):
            continue
        try:
            left = float(parts[6])
            top = float(parts[7])
            width = float(parts[8])
        except ValueError:
            continue
        yield {"page": page, "top": top, "left": left, "width": width, "text": text}


def group_words_into_lines(words, y_tolerance=3.0):
    """Group words into lines where words on similar y coordinates belong together.
    Returns list of lines, each line is list of {left, top, width, text} sorted by `left`."""
    by_page = {}
    for w in words:
        by_page.setdefault(w["page"], []).append(w)
    lines = []
    for pg in sorted(by_page):
        page_words = sorted(by_page[pg], key=lambda w: (w["top"], w["left"]))
        current = []
        current_top = None
        for w in page_words:
            if current_top is None or abs(w["top"] - current_top) <= y_tolerance:
                current.append(w)
                current_top = w["top"] if current_top is None else current_top
            else:
                lines.append(sorted(current, key=lambda x: x["left"]))
                current = [w]
                current_top = w["top"]
        if current:
            lines.append(sorted(current, key=lambda x: x["left"]))
    return lines


def line_text(line, sep=" "):
    return sep.join(w["text"] for w in line)


# ─────────────────────────────────────────────────────────────────────────────
# Format A — Phoenix | Cross Ref | Cross Maker | optional dims/remarks
# Used for: LPG, Channel, In-Tank, Spin-On Oil (×3), Inline Fuel
# ─────────────────────────────────────────────────────────────────────────────
NUM_DIM_KEYS = {"height", "outerDiameter", "innerDiameter", "inletDiameter", "outletDiameter"}
ALL_DIM_KEYS = NUM_DIM_KEYS | {"threadSize"}


def parse_format_a(text: str, source_name: str, cat: dict, header_signature_re, columns):
    products = OrderedDict()
    seen_header = False

    for line in text.splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        if not seen_header:
            if header_signature_re.search(line):
                seen_header = True
            continue

        cells = SPLIT_RE.split(stripped)
        if len(cells) < 3:
            continue
        while len(cells) < len(columns):
            cells.append("")
        row = dict(zip(columns, cells))

        phoenix = row.get("sku", "").strip()
        if not is_phoenix_nr(phoenix):
            continue
        cross_ref = row.get("crossRef", "").strip()
        cross_maker = row.get("crossMaker", "").strip()
        if not cross_ref or not cross_maker:
            continue

        prod = products.setdefault(phoenix, {
            "sku": phoenix,
            "category": cat["category"],
            "categoryKey": cat["key"],
            "vehicleBrand": None,
            "oem": None,
            "material": None,
            "application": None,
            "dimensions": {},
            "remark": None,
            "crossReferences": [],
            "sourceFiles": [source_name],
        })

        existing = {(r["partNumber"], r["manufacturer"]) for r in prod["crossReferences"]}
        if (cross_ref, cross_maker) not in existing:
            prod["crossReferences"].append({"partNumber": cross_ref, "manufacturer": cross_maker})

        for key in columns:
            if key in ("sku", "crossRef", "crossMaker"):
                continue
            val = row.get(key, "").strip()
            if not val:
                continue
            if key in ALL_DIM_KEYS:
                if key in NUM_DIM_KEYS:
                    n = to_int(val)
                    if n is not None and key not in prod["dimensions"]:
                        prod["dimensions"][key] = n
                else:
                    if key not in prod["dimensions"]:
                        prod["dimensions"][key] = val
            elif key in ("material", "remark", "application"):
                if not prod[key]:
                    prod[key] = val

    return list(products.values())


# ─────────────────────────────────────────────────────────────────────────────
# Format B — wide tables with named manufacturer columns and multi-line cells.
# Used for: Air Filters (EUR / Japan / Korea / USA), Cabin Air, Heavy Duty,
# ECO Oil & Fuel, Transmission.
#
# Strategy:
#  1. Detect column character ranges from the header line.
#  2. Walk lines; when leftmost column has a Phoenix Nr → emit previous,
#     start new product. Otherwise treat the line as a continuation.
#  3. Lines with only a brand-like word (no Phoenix Nr, no OEM) become the
#     current vehicleBrand for subsequent products (HYUNDAI / SUZUKI / …).
# ─────────────────────────────────────────────────────────────────────────────

# These first-three columns are SKU / OEM / description in every Format B PDF
# (with slightly different header text). Everything after is a manufacturer
# cross-reference column.
NON_REF_COLUMNS = {
    "PHOENIX", "PHOENIX NO.", "PHOENIX NO", "PHOENIX Nr.", "PHOEIX", "PHOENIX.",
    "Phoenix.", "Phoenix Nr.", "NO.", "NE NO.", "NE.NO.", "Itm No.",
    "OEM", "OEM.NO.", "OEM. NO.", "O.E.M. NO.", "O E M NO.",
    "DESCRIPTION & APPLICATION", "MODEL", "MACHINE MODEL", "Application",
    "REMARK", "REF. NO.", "REF.NO.", "Remark", "Maker",
}


def detect_columns(header_line: str):
    """Return list of (col_name, start_pos) sorted by start position.
    Handles wide headers where words are separated by 2+ spaces."""
    cols = []
    i, n = 0, len(header_line)
    while i < n:
        if header_line[i].isspace():
            i += 1
            continue
        start = i
        j = i
        while j < n:
            if header_line[j].isspace() and j + 1 < n and header_line[j + 1].isspace():
                break
            j += 1
        name = header_line[start:j].strip()
        if name:
            cols.append((name, start))
        i = j
    return cols


def slice_columns(line: str, cols):
    """Return dict {col_name: cell_text}, slicing line by header positions."""
    out = {}
    for idx, (name, start) in enumerate(cols):
        end = cols[idx + 1][1] if idx + 1 < len(cols) else len(line)
        out[name] = (line[start:end] if start < len(line) else "").strip()
    return out


def is_section_header_line(stripped_upper: str) -> bool:
    """A line that is a vehicle brand on its own (HYUNDAI, SUZUKI, etc.)."""
    if not stripped_upper or len(stripped_upper) > 60:
        return False
    if PHOENIX_NR_RE.match(stripped_upper):
        return False
    if any(ch.isdigit() for ch in stripped_upper):
        return False
    # Reject lines that look like text descriptions (multiple lowercase words)
    return all(c.isalpha() or c.isspace() or c in "&-/().," for c in stripped_upper)


def find_header_line(lines, must_have):
    """Return the first line containing all the required header markers."""
    for line in lines:
        joined = line_text(line).upper()
        if all(token.upper() in joined for token in must_have):
            return line
    return None


def build_column_anchors(header_line, sku_label_words, oem_label_words, desc_label_words=None):
    """Identify column anchor (left x-position + name) from the header words.
    Adjacent words that semantically belong to the same column header (e.g.
    'PUROLATOR' + 'LUBER-FINER' separated by < 12px on a long-column header
    will *not* be merged here — we treat each header word as its own column.
    """
    columns = []  # list of (name, x_left, x_right)
    # Sort words by left
    words = sorted(header_line, key=lambda w: w["left"])
    skip_indices = set()

    def consume_label(start_idx, label_words):
        """Try to match a multi-word label starting at words[start_idx]."""
        if not label_words:
            return None
        n = len(label_words)
        if start_idx + n > len(words):
            return None
        for k in range(n):
            if words[start_idx + k]["text"].upper().rstrip(".") != label_words[k].upper().rstrip("."):
                return None
        x_left = words[start_idx]["left"]
        x_right = words[start_idx + n - 1]["left"] + words[start_idx + n - 1]["width"]
        return (" ".join(label_words), x_left, x_right, n)

    i = 0
    while i < len(words):
        # Try sku label
        m = consume_label(i, sku_label_words) if sku_label_words else None
        if m:
            columns.append(("__SKU__", m[1], m[2]))
            for k in range(m[3]):
                skip_indices.add(i + k)
            i += m[3]
            continue
        m = consume_label(i, oem_label_words) if oem_label_words else None
        if m:
            columns.append(("__OEM__", m[1], m[2]))
            for k in range(m[3]):
                skip_indices.add(i + k)
            i += m[3]
            continue
        m = consume_label(i, desc_label_words) if desc_label_words else None
        if m:
            columns.append(("__DESC__", m[1], m[2]))
            for k in range(m[3]):
                skip_indices.add(i + k)
            i += m[3]
            continue
        # Otherwise: each header word is its own column (manufacturer name)
        w = words[i]
        # Combine with next if they look like a hyphenated single label (e.g. "LUBER-FINER")
        # but pdftotext should emit those as one token already. So we keep one word per column.
        text = w["text"].rstrip(":,;.")
        # Skip pure markup like "&" alone
        if text and text not in ("&", "/", "(", ")"):
            columns.append((text, w["left"], w["left"] + w["width"]))
        i += 1

    # Sort by x_left
    columns.sort(key=lambda c: c[1])
    # Build right boundaries: each column extends until midpoint to next column
    boundaries = []
    for idx, (name, x_left, x_right) in enumerate(columns):
        if idx + 1 < len(columns):
            next_x = columns[idx + 1][1]
            mid = (x_right + next_x) / 2
        else:
            mid = float("inf")
        boundaries.append((name, x_left, mid))
    return boundaries


def words_to_columns(line, columns):
    """Assign each word in a line to a column by x-coordinate.
    Returns dict {col_name: [words]} preserving order."""
    out = OrderedDict((name, []) for name, _, _ in columns)
    for w in line:
        x_center = w["left"] + w["width"] / 2
        # Find column whose [x_left, mid_to_next] contains x_center
        chosen = None
        for name, x_left, x_right in columns:
            if x_left - 5 <= x_center < x_right:
                chosen = name
                break
        if chosen is None:
            # fall back: closest column by left edge
            chosen = min(columns, key=lambda c: abs(c[1] - x_center))[0]
        out[chosen].append(w["text"])
    return out


def parse_format_b(pdf_path, source_name: str, cat: dict, sku_label, oem_label, desc_label,
                   y_tolerance: float = 3.5):
    """Parse a Format B PDF using TSV bounding-box data.
    sku_label / oem_label / desc_label: list of header words, e.g. ['PHOENIX', 'NO.']."""
    words = list(pdf_to_tsv(pdf_path))
    lines = group_words_into_lines(words, y_tolerance=y_tolerance)

    # Find header
    must_have = sku_label + oem_label
    header = find_header_line(lines, must_have)
    if header is None:
        return []

    columns = build_column_anchors(header, sku_label, oem_label, desc_label or [])
    if not any(c[0] == "__SKU__" for c in columns):
        return []

    products = []
    current = None
    vehicle_brand = None
    sku_col_x_left = next(c[1] for c in columns if c[0] == "__SKU__")
    sku_col_x_right = next(c[2] for c in columns if c[0] == "__SKU__")

    def flush():
        if current and current["sku"]:
            products.append(current)

    for line in lines:
        cells = words_to_columns(line, columns)
        sku_words = cells.get("__SKU__", [])
        sku_text = " ".join(sku_words).strip().rstrip(",;.")

        # Skip header/repeated-header lines
        if any(w.upper() in ("PHOENIX", "PHOEIX", "MODEL", "FRAM", "MANN", "OEM") for w in sku_words[:1]) and len(line) > 4:
            # If line text matches header signature, skip
            joined = line_text(line).upper()
            if all(t.upper() in joined for t in must_have):
                continue

        if is_phoenix_nr(sku_text):
            flush()
            current = {
                "sku": sku_text,
                "category": cat["category"],
                "categoryKey": cat["key"],
                "vehicleBrand": vehicle_brand,
                "oem": None,
                "material": None,
                "application": None,
                "dimensions": {},
                "remark": None,
                "crossReferences": [],
                "sourceFiles": [source_name],
            }
            apply_b_cells(current, cells)
            continue

        # Section header: line contains only one or two words, all to the LEFT of the SKU column right edge,
        # and the words are alphabetic (vehicle brand).
        words_in_line = [w for w in line]
        all_left = all(w["left"] + w["width"] <= sku_col_x_right + 30 for w in words_in_line)
        only_alpha = all(re.match(r"^[A-Z][A-Z &\-/().,]*$", w["text"].upper()) for w in words_in_line)
        if all_left and only_alpha and len(words_in_line) <= 4 and line_text(line).upper() not in ("PHOENIX",):
            text = line_text(line).strip().upper()
            if 1 <= len(text) <= 50 and is_section_header_line(text):
                vehicle_brand = text
                continue

        # Continuation line
        if current is None:
            continue
        apply_b_cells(current, cells)

    flush()
    return products


JUNK_TOKENS = {
    "AIR", "FILTER", "FOR", "EUROPEAN", "JAPANESE", "KOREAN", "USA", "AUTO", "AUTO.",
    "CABIN", "OIL", "FUEL", "HEAVY", "DUTY", "SPIN-ON", "TRANSMISSON", "TRANSMISSION",
    "PHOENIX", "PHOEIX", "MODEL", "REF.", "REF", "NO.", "NO", "OEM", "OEM.",
    "O.E.M.", "DESCRIPTION", "&", "APPLICATION", "MACHINE", "REMARK",
    "SERVICE", "CHAMP", "FRAM", "MANN", "WIX", "MAHLE", "HENGST", "BALDWIN",
    "FLEETGUARD", "DONALDSON", "PUROLATOR", "LUBER-FINER", "SAKURA",
    "ACDELCO", "CHAMPION", "KNECHT", "ALCO", "TECNOCAR", "HANGST",
}


def is_part_number_like(token: str) -> bool:
    """A real part number should have at least one digit OR be a known
    alphanumeric pattern (e.g. 'PH4997', 'C2469'). Reject pure-uppercase
    words that are catalogue chrome (AIR, FILTER, FOR, etc.)."""
    t = token.strip()
    if len(t) < 3:
        return False
    if t.upper() in JUNK_TOKENS:
        return False
    # Must contain at least one digit OR a hyphen with a digit nearby
    if any(c.isdigit() for c in t):
        return True
    # Allow tokens like "C-932" - rare but valid
    return False


def apply_b_cells(prod, cells):
    for name, words in cells.items():
        val = " ".join(words).strip()
        if not val:
            continue
        if name == "__SKU__":
            continue  # already handled
        if name == "__OEM__":
            for token in words:
                token = token.strip(",;")
                if not is_part_number_like(token):
                    continue
                if not prod["oem"]:
                    prod["oem"] = token
                elif token not in prod["oem"].split():
                    prod["oem"] += " " + token
        elif name == "__DESC__":
            cleaned = " ".join(w for w in words if w.upper() not in JUNK_TOKENS)
            if cleaned:
                prod["application"] = (prod["application"] + " " + cleaned).strip() if prod["application"] else cleaned
        else:
            # Manufacturer cross-reference column
            for token in words:
                token = token.strip(",;")
                if not is_part_number_like(token):
                    continue
                pair = (token, name)
                if pair not in {(r["partNumber"], r["manufacturer"]) for r in prod["crossReferences"]}:
                    prod["crossReferences"].append({"partNumber": token, "manufacturer": name})


def parse_pdf(pdf_path: Path):
    text = pdf_to_text(pdf_path)
    name = pdf_path.stem.upper()
    cat = category_for(pdf_path.name)

    if "LPG FILTER" in name:
        return parse_format_a(
            text, pdf_path.name, cat,
            re.compile(r"Phoenix Nr\..*Cross Ref"),
            columns=["sku", "crossRef", "crossMaker", "material", "remark"],
        )
    if "CHANNEL AIR FILTER" in name:
        return parse_format_a(
            text, pdf_path.name, cat,
            re.compile(r"PHOENIX Nr\..*CROSS Ref"),
            columns=["sku", "crossRef", "crossMaker"],
        )
    if "IN-TANK PLASTIC FUEL FILTER" in name:
        return parse_format_a(
            text, pdf_path.name, cat,
            re.compile(r"Phoenix Nr\..*Cross Ref.*REMARK"),
            columns=["sku", "crossRef", "crossMaker", "application"],
        )
    if "SPIN-ON OIL FILTER" in name:
        return parse_format_a(
            text, pdf_path.name, cat,
            re.compile(r"Phoenix Nr\..*Cross Ref.*H\(mm\)"),
            columns=["sku", "crossRef", "crossMaker", "height", "outerDiameter", "threadSize", "remark"],
        )
    if "INLINE FUEL FILTER" in name:
        return parse_format_a(
            text, pdf_path.name, cat,
            re.compile(r"Phoenix Nr\..*Cross Ref"),
            columns=["sku", "crossRef", "crossMaker", "height", "outerDiameter",
                     "inletDiameter", "outletDiameter", "material"],
        )

    if "AIR FILTER FOR KOREAN AUTO" in name:
        return parse_format_b(pdf_path, pdf_path.name, cat,
            sku_label=["PHOENIX", "NO."], oem_label=["O.E.M.", "NO."],
            desc_label=["DESCRIPTION", "&", "APPLICATION"])
    if "AIR FILTER FOR EUROPEAN AUTO" in name:
        return parse_format_b(pdf_path, pdf_path.name, cat,
            sku_label=["PHOENIX", "NO."], oem_label=["OEM.NO."],
            desc_label=["MODEL"])
    if "AIR FILTER FOR JAPANESE AUTO" in name:
        return parse_format_b(pdf_path, pdf_path.name, cat,
            sku_label=["PHOEIX"], oem_label=["O.E.M.", "NO."],
            desc_label=["DESCRIPTION", "&", "APPLICATION"])
    if "AIR FILTER FOR USA AUTO" in name:
        return parse_format_b(pdf_path, pdf_path.name, cat,
            sku_label=["PHOENIX"], oem_label=["O.E.M.", "NO."],
            desc_label=None)
    if "CABIN AIR FILTER" in name and "HEAVY" not in name:
        return parse_format_b(pdf_path, pdf_path.name, cat,
            sku_label=["PHOENIX", "NO."], oem_label=["O.E.M.", "NO."],
            desc_label=["MACHINE", "MODEL"])
    if "HEAVY DUTY CABIN AIR FILTER" in name:
        return parse_format_b(pdf_path, pdf_path.name, cat,
            sku_label=["NE.NO."], oem_label=["O.E.M.", "NO."],
            desc_label=["MACHINE", "MODEL"])
    if "HEAVY DUTY AIR FILTER" in name:
        return parse_format_b(pdf_path, pdf_path.name, cat,
            sku_label=["NE", "NO."], oem_label=["O", "E", "M", "NO."],
            desc_label=None)
    if "HEAVY DUTY OIL FILTER" in name:
        return parse_format_b(pdf_path, pdf_path.name, cat,
            sku_label=["Phoenix.", "NO."], oem_label=["OEM.", "NO."],
            desc_label=None)
    if "HEAVY DUTY FUEL FILTER" in name:
        return parse_format_b(pdf_path, pdf_path.name, cat,
            sku_label=["Phoenix."], oem_label=["OEM.", "NO."],
            desc_label=None, y_tolerance=8.0)
    if "ECO OIL & FUEL FILTER" in name:
        return parse_format_b(pdf_path, pdf_path.name, cat,
            sku_label=["PHOENIX", "NO."], oem_label=["O.E.M.", "NO."],
            desc_label=["MACHINE", "MODEL"])
    if "TRANSMISSON" in name or "TRANSMISSION" in name:
        return parse_format_b(pdf_path, pdf_path.name, cat,
            sku_label=["Phoenix", "NO."], oem_label=["OEM"],
            desc_label=["Application"])

    return []


def merge_by_sku(products):
    merged = OrderedDict()
    for p in products:
        sku = p["sku"]
        if sku not in merged:
            merged[sku] = p
            continue
        m = merged[sku]
        m["sourceFiles"] = sorted(set(m["sourceFiles"] + p["sourceFiles"]))
        existing_refs = {(r["partNumber"], r["manufacturer"]) for r in m["crossReferences"]}
        for r in p["crossReferences"]:
            if (r["partNumber"], r["manufacturer"]) not in existing_refs:
                m["crossReferences"].append(r)
                existing_refs.add((r["partNumber"], r["manufacturer"]))
        for k in ("material", "application", "remark", "vehicleBrand", "oem"):
            if not m.get(k) and p.get(k):
                m[k] = p[k]
        for k, v in (p.get("dimensions") or {}).items():
            m.setdefault("dimensions", {}).setdefault(k, v)
    return list(merged.values())


def main():
    pdf_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_PDF_DIR
    if not pdf_dir.is_dir():
        sys.exit(f"PDF directory not found: {pdf_dir}")
    if not shutil.which("pdftotext"):
        sys.exit("pdftotext not found on PATH. Install poppler: `brew install poppler`")

    SEEDS_DIR.mkdir(parents=True, exist_ok=True)

    all_products = []
    summary = []
    for pdf in sorted(pdf_dir.glob("*.pdf")):
        try:
            products = parse_pdf(pdf)
        except subprocess.CalledProcessError as e:
            print(f"  ! pdftotext failed on {pdf.name}: {e.stderr}", file=sys.stderr)
            products = []
        except Exception as e:
            print(f"  ! ERROR parsing {pdf.name}: {e}", file=sys.stderr)
            products = []
        for p in products:
            if not p.get("dimensions"):
                p.pop("dimensions", None)
        summary.append((pdf.name, len(products)))
        all_products.extend(products)

    merged = merge_by_sku(all_products)
    OUT_PATH.write_text(json.dumps(merged, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"\nParsed {len(all_products)} rows → merged into {len(merged)} unique SKUs")
    print(f"Output: {OUT_PATH}\n")
    print("Per-file row counts:")
    for fname, count in summary:
        marker = "✓" if count > 0 else "·"
        print(f"  {marker} {count:5d}  {fname}")


if __name__ == "__main__":
    main()
