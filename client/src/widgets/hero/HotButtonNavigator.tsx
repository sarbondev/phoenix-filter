"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Layers,
  Phone,
  Sparkles,
  Package,
  FolderTree,
} from "lucide-react";
import type { Locale } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";
import { t, getImageUrl } from "@/shared/lib/utils";

interface HotButtonNavigatorProps {
  locale: Locale;
  dict: Dictionary;
}

const MAX_CATEGORIES = 4;

export function HotButtonNavigator({ locale, dict }: HotButtonNavigatorProps) {
  const { data: categories } = useGetCategoriesQuery();

  /* Roots (no parent) sorted by sortOrder, top N */
  const topCategories =
    categories
      ?.filter((c) => !c.parent && c.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .slice(0, MAX_CATEGORIES) ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.45 }}
      className="mt-9"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 mb-3">
        {dict.hero.quickNav}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 max-w-3xl">
        {/* Category buttons */}
        {topCategories.map((cat) => (
          <HotButton
            key={cat.id}
            href={`/${locale}/categories/${cat.slug}`}
            label={t(cat.name, locale)}
            image={cat.image}
            fallback={<FolderTree className="h-4 w-4" />}
          />
        ))}

        {/* All products */}
        <HotButton
          href={`/${locale}/products`}
          label={dict.products.all}
          fallback={<Package className="h-4 w-4" />}
          accent
        />

        {/* Categories index */}
        <HotButton
          href={`/${locale}/categories`}
          label={dict.nav.catalog}
          fallback={<Layers className="h-4 w-4" />}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px]">
        <Link
          href={`/${locale}/products?isFeatured=true`}
          className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          {dict.products.featured}
          <ArrowRight className="h-3 w-3 opacity-60" />
        </Link>
        <span className="hidden sm:block w-px h-3 bg-white/20" />
        <Link
          href={`/${locale}/industries`}
          className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
        >
          <Layers className="h-3.5 w-3.5 text-cyan-300" />
          {dict.hero.industries}
          <ArrowRight className="h-3 w-3 opacity-60" />
        </Link>
        <span className="hidden sm:block w-px h-3 bg-white/20" />
        <a
          href={`tel:${dict.footer.phone.replace(/\s/g, "")}`}
          className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
        >
          <Phone className="h-3.5 w-3.5 text-emerald-300" />
          {dict.footer.contactUs}
        </a>
      </div>
    </motion.div>
  );
}

function HotButton({
  href,
  label,
  image,
  fallback,
  accent = false,
}: {
  href: string;
  label: string;
  image?: string;
  fallback: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-200 ${
        accent
          ? "bg-white/95 border-white text-slate-900 hover:bg-white hover:shadow-lg hover:-translate-y-0.5"
          : "bg-white/8 border-white/15 text-white backdrop-blur-md hover:bg-white/15 hover:border-white/30 hover:-translate-y-0.5"
      }`}
    >
      <span
        className={`relative flex h-7 w-7 items-center justify-center rounded-lg flex-shrink-0 overflow-hidden ${
          accent
            ? "bg-indigo-100 text-indigo-600"
            : "bg-white/10 text-white/80"
        }`}
      >
        {image ? (
          <Image
            src={getImageUrl(image)}
            alt={label}
            fill
            className="object-cover"
            sizes="28px"
          />
        ) : (
          fallback
        )}
      </span>
      <span className="text-[12.5px] font-semibold truncate flex-1">
        {label}
      </span>
      <ArrowRight
        className={`h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 ${
          accent ? "text-indigo-500" : "text-white/50"
        }`}
      />
    </Link>
  );
}
