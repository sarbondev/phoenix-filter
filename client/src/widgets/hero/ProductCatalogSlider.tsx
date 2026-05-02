"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Locale } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";
import { useGetProductsQuery } from "@/store/api/productApi";
import { ProductCard } from "@/entities/product/ProductCard";
import { Skeleton } from "@/shared/ui";

interface Props {
  locale: Locale;
  dict: Dictionary;
}

const sectionTitle: Record<string, string> = {
  en: "Product catalog",
  ru: "Каталог товаров",
  uz: "Mahsulotlar katalogi",
  kz: "Өнімдер каталогы",
};

export function ProductCatalogSlider({ locale, dict }: Props) {
  const { data: response, isLoading } = useGetProductsQuery({
    page: 1,
    limit: 8,
  });
  const products = response?.data ?? [];
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.clientWidth ?? 280;
    el.scrollBy({
      left: (cardWidth + 16) * (dir === "right" ? 2 : -2),
      behavior: "smooth",
    });
  };

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-8 lg:mb-10 gap-4"
        >
          <h2 className="section-title text-xl sm:text-2xl lg:text-[26px] text-slate-900">
            {sectionTitle[locale] ?? sectionTitle.ru}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              aria-label="Previous"
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-slate-600 hover:bg-[var(--color-brand)] hover:text-white hover:border-[var(--color-brand)] transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Next"
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-slate-600 hover:bg-[var(--color-brand)] hover:text-white hover:border-[var(--color-brand)] transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-hover)] ml-2"
            >
              {dict.products.all}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[360px] rounded-2xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-slate-400 py-10">
            {dict.products.noProducts}
          </p>
        ) : (
          <div
            ref={trackRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {products.map((product, i) => (
              <div
                key={product.id}
                className="snap-start flex-shrink-0 w-[260px] sm:w-[280px]"
              >
                <ProductCard
                  product={product}
                  locale={locale}
                  dict={dict}
                  index={i}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
