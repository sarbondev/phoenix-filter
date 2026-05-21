"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ChevronRight } from "lucide-react";
import type { Locale } from "@/shared/types";
import { useGetEquipmentTypeBySlugQuery } from "@/store/api/equipmentTypeApi";
import { useGetProductsQuery } from "@/store/api/productApi";
import { useQueryParams } from "@/shared/hooks/useQueryParams";
import { t } from "@/shared/lib/utils";
import { ProductGrid } from "../../_components/ProductGrid";
import { SX_T, sx } from "../../_components/sx-i18n";

export function EquipmentClient({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const { data: equipment, isLoading: etLoading } =
    useGetEquipmentTypeBySlugQuery(slug);

  const brands = useMemo(() => equipment?.machineBrands ?? [], [equipment]);
  const { params, setParams } = useQueryParams();
  const activeBrand = params.brand ?? null;

  // When no specific brand picked, query the first brand so the page always
  // shows products. The brand pills below toggle which one is loaded.
  const queryBrand = activeBrand ?? brands[0] ?? "";

  const { data, isLoading: productsLoading } = useGetProductsQuery(
    queryBrand
      ? { machineBrand: queryBrand, limit: 24, page: 1 }
      : (undefined as unknown as void),
    { skip: !queryBrand },
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
              {etLoading ? "…" : equipment ? t(equipment.name, locale) : slug}
            </span>
          </nav>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <h1 className="text-2xl lg:text-[34px] font-extrabold tracking-tight text-slate-900">
            {etLoading ? "…" : equipment ? t(equipment.name, locale) : slug}
          </h1>
          <p className="mt-3 max-w-3xl text-[14px] lg:text-[15px] text-slate-600 leading-relaxed">
            {sx(SX_T.equipmentSubtitle, locale)}
          </p>

          {brands.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {brands.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setParams({ brand: b })}
                  className={`inline-flex items-center rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${
                    (activeBrand ?? brands[0]) === b
                      ? "bg-[var(--color-brand)] text-white border-[var(--color-brand)]"
                      : "bg-white text-slate-700 border-slate-300 hover:border-[var(--color-brand)]"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProductGrid
            products={products}
            locale={locale}
            isLoading={productsLoading || etLoading}
            emptyText={sx(SX_T.equipmentEmpty, locale)}
          />
        </div>
      </section>
    </main>
  );
}
