/**
 * Server-side fetch helpers for `generateMetadata` and other RSC contexts.
 * Browser requests go through RTK Query (`baseApi`); SSR can't use that, so
 * this module mirrors the same base URL using `fetch`.
 */
import type { Locale, Product, Category, ApiResponse } from "@/shared/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function safeJson<T>(url: string, locale: Locale): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${url}`, {
      headers: { "Accept-Language": locale },
      // Cache aggressively for metadata — products/categories don't change minute-to-minute.
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ApiResponse<T>;
    return json.data ?? null;
  } catch {
    return null;
  }
}

export const fetchProductBySlug = (slug: string, locale: Locale) =>
  safeJson<Product>(`/products/slug/${encodeURIComponent(slug)}?lang=${locale}`, locale);

export const fetchCategoryBySlug = (slug: string, locale: Locale) =>
  safeJson<Category>(`/categories/slug/${encodeURIComponent(slug)}?lang=${locale}`, locale);
