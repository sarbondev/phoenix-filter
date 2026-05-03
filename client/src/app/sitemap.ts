import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const LOCALES = ["uz", "ru", "en", "kz"] as const;

interface ApiList<T> {
  data?: T[];
  meta?: { total?: number; totalPages?: number };
}

interface ApiSingle<T> {
  data?: T;
}

interface ProductSitemapEntry {
  slug: string;
  updatedAt?: string;
}

interface CategorySitemapEntry {
  slug: string;
  updatedAt?: string;
}

async function fetchAllProducts(): Promise<ProductSitemapEntry[]> {
  const all: ProductSitemapEntry[] = [];
  let page = 1;
  const limit = 200;
  while (true) {
    try {
      const res = await fetch(
        `${API_URL}/products?page=${page}&limit=${limit}&fullTranslation=true`,
        { next: { revalidate: 3600 } },
      );
      if (!res.ok) break;
      const json = (await res.json()) as ApiList<ProductSitemapEntry>;
      const items = json.data ?? [];
      all.push(...items);
      const totalPages = json.meta?.totalPages ?? 1;
      if (page >= totalPages || items.length === 0) break;
      page += 1;
      // Safety guard against runaway pagination
      if (page > 100) break;
    } catch {
      break;
    }
  }
  return all;
}

async function fetchAllCategories(): Promise<CategorySitemapEntry[]> {
  try {
    const res = await fetch(`${API_URL}/categories?active=true`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as ApiList<CategorySitemapEntry>;
    return json.data ?? [];
  } catch {
    return [];
  }
}

function alternates(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of LOCALES) out[l] = `${SITE_URL}/${l}${path}`;
  return out;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    fetchAllProducts(),
    fetchAllCategories(),
  ]);

  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Static pages — one entry per locale (default Russian as canonical)
  const staticPaths: { path: string; priority: number; changeFreq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1.0, changeFreq: "daily" },
    { path: "/categories", priority: 0.9, changeFreq: "weekly" },
    { path: "/products", priority: 0.9, changeFreq: "daily" },
    { path: "/blog", priority: 0.5, changeFreq: "weekly" },
    { path: "/contact", priority: 0.5, changeFreq: "monthly" },
  ];

  for (const { path, priority, changeFreq } of staticPaths) {
    entries.push({
      url: `${SITE_URL}/ru${path}`,
      lastModified: now,
      changeFrequency: changeFreq,
      priority,
      alternates: { languages: alternates(path) },
    });
  }

  for (const cat of categories) {
    const path = `/categories/${cat.slug}`;
    entries.push({
      url: `${SITE_URL}/ru${path}`,
      lastModified: cat.updatedAt ? new Date(cat.updatedAt) : now,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: { languages: alternates(path) },
    });
  }

  for (const p of products) {
    const path = `/products/${p.slug}`;
    entries.push({
      url: `${SITE_URL}/ru${path}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: "weekly",
      priority: 0.6,
      alternates: { languages: alternates(path) },
    });
  }

  return entries;
}
