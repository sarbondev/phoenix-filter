"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FolderTree } from "lucide-react";
import type { Locale } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";
import { t, getImageUrl } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui";

interface Props {
  locale: Locale;
  dict: Dictionary;
}

const sectionTitle: Record<string, string> = {
  en: "Product categories",
  ru: "Категории товаров",
  uz: "Mahsulot toifalari",
  kz: "Өнім санаттары",
};

export function CategoriesSection({ locale, dict }: Props) {
  const { data: categories, isLoading } = useGetCategoriesQuery();

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-8 lg:mb-10"
        >
          <h2 className="section-title text-xl sm:text-2xl lg:text-[26px] text-slate-900">
            {sectionTitle[locale] ?? sectionTitle.ru}
          </h2>
          <Link
            href={`/${locale}/categories`}
            className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-hover)]"
          >
            {dict.categories.viewAll}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {isLoading
            ? Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-2xl" />
              ))
            : categories?.slice(0, 7).map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={`/${locale}/categories/${cat.slug}`}
                    className="group relative flex flex-col items-center justify-between p-3 rounded-2xl bg-white border border-[var(--color-border)] hover:border-[var(--color-brand)]/40 hover:shadow-md transition-all h-full min-h-[150px]"
                  >
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[var(--color-surface)]">
                      {cat.image ? (
                        <Image
                          src={getImageUrl(cat.image)}
                          alt={t(cat.name, locale)}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 14vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <FolderTree className="h-8 w-8 text-slate-300" />
                        </div>
                      )}
                    </div>

                    <h3 className="mt-2.5 text-center text-[12px] font-semibold text-slate-700 leading-tight line-clamp-2 group-hover:text-[var(--color-brand)] transition-colors">
                      {t(cat.name, locale)}
                    </h3>
                  </Link>
                </motion.div>
              ))}
        </div>

        <Link
          href={`/${locale}/categories`}
          className="mt-6 sm:hidden flex items-center justify-center gap-1.5 text-sm font-semibold text-[var(--color-brand)]"
        >
          {dict.categories.viewAll}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
