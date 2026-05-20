"use client";

import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";
import type { Locale, Product } from "@/shared/types";
import { t, formatPrice, getImageUrl } from "@/shared/lib/utils";
import { SX_T, sx } from "./sx-i18n";

interface Props {
  products: Product[];
  locale: Locale;
  isLoading?: boolean;
  emptyText?: string;
}

/**
 * Lightweight product grid used inside spetstexnika sub-pages. Avoids the
 * full ProductCard (which depends on the global Dictionary type) so this
 * section can ship independently of the larger i18n surface.
 */
export function ProductGrid({ products, locale, isLoading, emptyText }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-72 rounded-xl bg-slate-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl bg-white ring-1 ring-slate-200 p-12 text-center">
        <Package className="h-10 w-10 mx-auto text-slate-300 mb-3" />
        <p className="text-[14px] text-slate-500">
          {emptyText ?? "No products yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((p) => (
        <Link
          key={p.id}
          href={`/${locale}/products/${p.slug}`}
          className="group flex flex-col rounded-xl bg-white ring-1 ring-slate-200 hover:ring-[var(--color-brand)] hover:shadow-md transition-all overflow-hidden"
        >
          <div className="relative aspect-square bg-slate-50">
            {p.images?.[0] ? (
              <Image
                src={getImageUrl(p.images[0])}
                alt={t(p.name, locale)}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-contain p-4 transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                <Package className="h-8 w-8" />
              </div>
            )}
            {p.stockStatus === "under_order" && (
              <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-[var(--color-warning-soft)] text-[var(--color-warning)] px-2 py-0.5 text-[10px] font-bold">
                {sx(SX_T.underOrder, locale)}
              </span>
            )}
          </div>

          <div className="p-4 flex flex-col flex-1">
            {p.vehicleBrand && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand)]">
                {p.vehicleBrand}
              </span>
            )}
            <h3 className="mt-1 text-[14px] font-bold text-slate-900 line-clamp-2 group-hover:text-[var(--color-brand)]">
              {t(p.name, locale)}
            </h3>
            <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-slate-500 font-mono">
              {p.sku && <span>{p.sku}</span>}
              {p.oem && <span>OEM: {p.oem}</span>}
            </div>
            {p.application && (
              <p className="mt-1.5 text-[11px] text-slate-400 line-clamp-1">
                {p.application}
              </p>
            )}
            <div className="mt-auto pt-3">
              {p.priceOnRequest ? (
                <span className="inline-flex rounded-full bg-[var(--color-brand-soft)] text-[var(--color-brand)] px-3 py-1 text-[11px] font-semibold">
                  {sx(SX_T.priceOnRequest, locale)}
                </span>
              ) : (
                <span className="text-[15px] font-extrabold text-slate-900">
                  {formatPrice(p.price)}
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
