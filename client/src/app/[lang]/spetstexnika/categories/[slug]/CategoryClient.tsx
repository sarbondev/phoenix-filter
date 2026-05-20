"use client";

import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import type { Locale } from "@/shared/types";
import { useGetCategoryBySlugQuery } from "@/store/api/categoryApi";
import { useGetProductsQuery } from "@/store/api/productApi";
import { t } from "@/shared/lib/utils";
import { ProductGrid } from "../../_components/ProductGrid";
import { SX_T, sx } from "../../_components/sx-i18n";

export function CategoryClient({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const { data: category, isLoading: catLoading } =
    useGetCategoryBySlugQuery(slug);

  const { data, isLoading: productsLoading } = useGetProductsQuery(
    category?.id
      ? { category: category.id, limit: 24, page: 1 }
      : (undefined as unknown as void),
    { skip: !category?.id },
  );

  const products = data?.data ?? [];

  return (
    <main className="bg-[var(--color-surface)] min-h-screen">
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <nav className="text-[12px] text-slate-500 flex items-center gap-1.5">
            <Link href={`/${locale}`} className="hover:text-slate-800">
              {sx(SX_T.breadHome, locale)}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link
              href={`/${locale}/spetstexnika`}
              className="hover:text-slate-800"
            >
              {sx(SX_T.breadSpetstexnika, locale)}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-slate-900 font-semibold">
              {catLoading ? "…" : category ? t(category.name, locale) : slug}
            </span>
          </nav>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <h1 className="text-2xl lg:text-[34px] font-extrabold tracking-tight text-slate-900">
            {catLoading ? "…" : category ? t(category.name, locale) : slug}
          </h1>
          {category?.description && (
            <p className="mt-3 max-w-3xl text-[14px] lg:text-[15px] text-slate-600 leading-relaxed">
              {t(category.description, locale)}
            </p>
          )}
          <div className="mt-6">
            <Link
              href={`/${locale}/filter-search`}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white px-5 py-3 text-[14px] font-semibold transition-colors"
            >
              <Search className="h-4 w-4" />
              {sx(SX_T.pickFilterCta, locale)}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProductGrid
            products={products}
            locale={locale}
            isLoading={productsLoading || catLoading}
            emptyText={sx(SX_T.categoryEmpty, locale)}
          />
        </div>
      </section>
    </main>
  );
}
