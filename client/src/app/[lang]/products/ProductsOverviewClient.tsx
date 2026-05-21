"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  ArrowRight,
  Filter as FilterIcon,
  Layers,
  FlaskConical,
  Zap,
  Tornado,
  Fan,
  Wrench,
  Wind,
  Droplet,
  Fuel,
  Gauge,
  Armchair,
  type LucideIcon,
} from "lucide-react";
import type { Locale, Category, Direction } from "@/shared/types";
import { useGetDirectionsQuery } from "@/store/api/directionApi";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";
import { CatalogSidebar } from "@/widgets/catalog/CatalogSidebar";
import { t, getImageUrl } from "@/shared/lib/utils";
import { decorImg } from "@/shared/lib/decor";

type LS = Record<Locale, string>;
const tr = (s: LS, l: Locale) => s[l] ?? s.en;

const CAT_ICON: Record<string, LucideIcon> = {
  "air-filters": Wind,
  "oil-filters": Droplet,
  "fuel-filters": Fuel,
  "hydraulic-filters": Gauge,
  "cabin-filters": Armchair,
  "adblue-filters": FlaskConical,
  "coolant-filters": Droplet,
  "ventilation-filters": Fan,
  "filter-kits": Layers,
  "bag-filters": FilterIcon,
  "cartridge-filters": Layers,
  scrubbers: FlaskConical,
  "electrostatic-filters": Zap,
  cyclones: Tornado,
  "aspiration-systems": Fan,
  "process-filters": Wrench,
};

const T = {
  breadHome: { uz: "Bosh", ru: "Главная", en: "Home", kz: "Басты" },
  title: { uz: "Mahsulotlar", ru: "Продукция", en: "Products", kz: "Өнім" },
  subtitle: {
    uz: "Sanoat va spetstexnika uchun filtratsiya va gaz tozalash uskunalarining to'liq katalogi.",
    ru: "Полный каталог оборудования для фильтрации и газоочистки — для промышленности и спецтехники.",
    en: "Full catalog of filtration and gas-cleaning equipment for industry and special equipment.",
    kz: "Өнеркәсіп пен арнайы техникаға арналған сүзу жабдықтарының толық каталогы.",
  },
  viewAll: { uz: "Bo'limga o'tish", ru: "Перейти в раздел", en: "Go to section", kz: "Бөлімге өту" },
  categories: { uz: "Toifalar", ru: "Категории", en: "Categories", kz: "Санаттар" },
} as const;

const categoryHref = (locale: Locale, directionSlug: string, catSlug: string) =>
  directionSlug === "industrial"
    ? `/${locale}/industrial/${catSlug}`
    : `/${locale}/spetstexnika/categories/${catSlug}`;

const directionHref = (locale: Locale, slug: string) =>
  slug === "spetstexnika" ? `/${locale}/spetstexnika` : `/${locale}/products`;

export function ProductsOverviewClient({ locale }: { locale: Locale }) {
  const { data: directions } = useGetDirectionsQuery();
  const { data: categories } = useGetCategoriesQuery();

  const ordered = (directions ?? [])
    .filter((d) => d.isActive)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <main className="bg-[var(--color-surface)] min-h-screen">
      <div className="bg-white border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-1.5 text-[12px] text-slate-500">
            <Link href={`/${locale}`} className="hover:text-slate-800">{tr(T.breadHome, locale)}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-slate-900 font-semibold">{tr(T.title, locale)}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 py-7 lg:py-9">
        <div className="flex flex-col lg:flex-row gap-7">
          <CatalogSidebar locale={locale} />

          <div className="flex-1 min-w-0 space-y-6">
            <section className="rounded-xl bg-white border border-[var(--color-border)] p-6 lg:p-8">
              <h1 className="text-2xl lg:text-[34px] font-extrabold tracking-tight text-[var(--color-brand-strong)] uppercase">
                {tr(T.title, locale)}
              </h1>
              <p className="mt-3 text-[14px] text-slate-600 leading-relaxed max-w-3xl">{tr(T.subtitle, locale)}</p>
            </section>

            {ordered.map((dir) => (
              <DirectionBlock
                key={dir.id}
                locale={locale}
                direction={dir}
                categories={(categories ?? []).filter((c) => c.direction === dir.id && c.isActive)}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function DirectionBlock({
  locale,
  direction,
  categories,
}: {
  locale: Locale;
  direction: Direction;
  categories: Category[];
}) {
  const cats = categories.slice().sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section className="rounded-xl bg-white border border-[var(--color-border)] p-5 lg:p-6">
      <div className="flex items-center justify-between gap-4 mb-5">
        <h2 className="text-[15px] lg:text-[17px] font-extrabold text-[var(--color-brand-strong)]">
          {t(direction.name, locale)}
        </h2>
        <Link
          href={directionHref(locale, direction.slug)}
          className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[var(--color-brand)] hover:gap-2.5 transition-all whitespace-nowrap"
        >
          {tr(T.viewAll, locale)}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cats.map((cat, idx) => {
          const Icon = CAT_ICON[cat.slug] ?? FilterIcon;
          return (
            <Link
              key={cat.id}
              href={categoryHref(locale, direction.slug, cat.slug)}
              className="group overflow-hidden rounded-lg border border-[var(--color-border)] hover:border-[var(--color-brand)] hover:shadow-sm transition-all"
            >
              <div className="relative h-28 bg-[var(--color-surface)] overflow-hidden">
                <Image
                  src={cat.image ? getImageUrl(cat.image) : decorImg(160 + idx, 800, 320)}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex items-start gap-3 p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)] flex-shrink-0">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-bold text-slate-900 group-hover:text-[var(--color-brand)] transition-colors">
                    {t(cat.name, locale)}
                  </h3>
                  {cat.description && (
                    <p className="mt-1 text-[12px] text-slate-500 leading-snug line-clamp-2">
                      {t(cat.description, locale)}
                    </p>
                  )}
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-[var(--color-brand)] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
