"use client";

import { usePathname } from "next/navigation";
import type { Locale } from "@/shared/types";

const VALID_LOCALES: Locale[] = ["uz", "ru", "en", "kz"];

/**
 * Reads the locale from the current URL path (the [lang] segment of the
 * Next.js app router). Falls back to "ru" for SSR or unknown values.
 */
export function useLocaleParam(): Locale {
  const pathname = usePathname();
  const seg = pathname?.split("/")[1] ?? "";
  return (VALID_LOCALES as string[]).includes(seg) ? (seg as Locale) : "ru";
}
