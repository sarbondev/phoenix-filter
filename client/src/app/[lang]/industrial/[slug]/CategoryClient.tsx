"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronRight,
  CheckCircle2,
  Settings,
  Factory,
  Headphones,
  Gauge,
  ShieldCheck,
  Zap,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/shared/types";
import { useGetCategoryBySlugQuery } from "@/store/api/categoryApi";
import { useGetProductsQuery } from "@/store/api/productApi";
import { t } from "@/shared/lib/utils";
import { CatalogSidebar } from "@/widgets/catalog/CatalogSidebar";
import { ProductGrid } from "../../spetstexnika/_components/ProductGrid";
import {
  getCategoryContent,
  TAB_LABELS,
  SECTION_LABELS,
  type LS,
} from "../content";

const BLUE = "#1d4ed8";

const PILL_ICONS: LucideIcon[] = [Gauge, Settings, ShieldCheck, Zap, Sparkles];

type TabKey = "overview" | "principle" | "types" | "materials" | "options" | "specs" | "docs";
const TABS: TabKey[] = ["overview", "principle", "types", "materials", "options", "specs", "docs"];

const tr = (s: LS, l: Locale) => s[l] ?? s.en;

export function CategoryClient({ locale, slug }: { locale: Locale; slug: string }) {
  const { data: category, isLoading } = useGetCategoryBySlugQuery(slug);
  const { data: productData, isLoading: productsLoading } = useGetProductsQuery(
    category?.id ? { category: category.id, limit: 24, page: 1 } : (undefined as unknown as void),
    { skip: !category?.id },
  );
  const products = productData?.data ?? [];
  const content = getCategoryContent(slug);
  const [tab, setTab] = useState<TabKey>("overview");

  const title = category ? t(category.name, locale) : slug;
  const description = category ? t(category.description, locale) : "";

  return (
    <main className="bg-[var(--color-surface)] min-h-screen">
      {/* breadcrumbs */}
      <div className="bg-white border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-1.5 text-[12px] text-slate-500">
            <Link href={`/${locale}`} className="hover:text-slate-800">
              {tr(SECTION_LABELS.catalogHome, locale)}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={`/${locale}/products`} className="hover:text-slate-800">
              {tr(SECTION_LABELS.catalogProducts, locale)}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-slate-900 font-semibold">{isLoading ? "…" : title}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 py-7 lg:py-9">
        <div className="flex flex-col lg:flex-row gap-7">
          <CatalogSidebar locale={locale} activeSlug={slug} />

          <div className="flex-1 min-w-0 space-y-6">
            {/* Hero */}
            <section className="rounded-xl bg-white border border-[var(--color-border)] p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-[34px] font-extrabold tracking-tight text-[var(--color-brand-strong)] uppercase">
                    {title}
                  </h1>
                  <p className="mt-3 text-[14px] text-slate-600 leading-relaxed max-w-2xl">
                    {description}
                  </p>
                </div>
                <div className="hidden lg:block w-72 h-40 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex-shrink-0" />
              </div>

              {/* feature pills */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 border-t border-[var(--color-border)] pt-5">
                {content.pills.map((pill, i) => {
                  const Icon = PILL_ICONS[i] ?? Gauge;
                  return (
                    <div key={i} className="flex flex-col items-start gap-2">
                      <Icon className="h-6 w-6 text-[var(--color-brand)]" />
                      <span className="text-[11.5px] text-slate-600 leading-tight">
                        {tr(pill, locale)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Tab strip */}
            <div className="flex flex-wrap gap-2">
              {TABS.map((key) => {
                const active = tab === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTab(key)}
                    className={`rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-colors ${
                      active
                        ? "text-white"
                        : "bg-white text-slate-600 border border-[var(--color-border)] hover:border-[var(--color-brand)]/40"
                    }`}
                    style={active ? { backgroundColor: BLUE } : undefined}
                  >
                    {tr(TAB_LABELS[key], locale)}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            {tab === "overview" && (
              <OverviewTab locale={locale} content={content} />
            )}
            {tab === "principle" && (
              <Panel>
                <SectionTitle>{tr(SECTION_LABELS.principle, locale)}</SectionTitle>
                <p className="mt-3 text-[14px] text-slate-600 leading-relaxed">
                  {tr(content.principle, locale)}
                </p>
              </Panel>
            )}
            {tab === "types" && <TypesTab locale={locale} content={content} />}
            {tab === "materials" && (
              <Panel>
                <SectionTitle>{tr(SECTION_LABELS.materials, locale)}</SectionTitle>
                <ul className="mt-4 space-y-2.5">
                  {content.materials.map((m, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-[14px] text-slate-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]" />
                      {tr(m, locale)}
                    </li>
                  ))}
                </ul>
              </Panel>
            )}
            {(tab === "options" || tab === "specs" || tab === "docs") && (
              <Panel>
                <p className="text-[14px] text-slate-500 py-8 text-center">
                  {tr(TAB_LABELS[tab], locale)} — {tr(SECTION_LABELS.sectionInProgress, locale)}
                </p>
              </Panel>
            )}

            {/* Models / products in this category */}
            <Panel>
              <SectionTitle>{tr(SECTION_LABELS.products, locale)}</SectionTitle>
              <div className="mt-4">
                <ProductGrid
                  products={products}
                  locale={locale}
                  isLoading={productsLoading || isLoading}
                  emptyText={tr(SECTION_LABELS.productsEmpty, locale)}
                />
              </div>
            </Panel>

            {/* bottom CTA bar */}
            <div className="rounded-xl bg-[var(--color-brand-soft)] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Headphones className="h-6 w-6 text-[var(--color-brand)]" />
                <p className="text-[14px] font-semibold text-[var(--color-brand-strong)]">
                  {tr(SECTION_LABELS.ctaNotSure, locale)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("phoenix:open-tz"))}
                className="rounded-lg px-5 py-3 text-[13.5px] font-semibold text-white whitespace-nowrap"
                style={{ backgroundColor: BLUE }}
              >
                {tr(SECTION_LABELS.consult, locale)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function OverviewTab({ locale, content }: { locale: Locale; content: ReturnType<typeof getCategoryContent> }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Panel>
          <SectionTitle>{tr(SECTION_LABELS.principle, locale)}</SectionTitle>
          <p className="mt-3 text-[13.5px] text-slate-600 leading-relaxed">
            {tr(content.principle, locale)}
          </p>
        </Panel>
        <Panel>
          <SectionTitle>{tr(SECTION_LABELS.advantages, locale)}</SectionTitle>
          <ul className="mt-3 space-y-2.5">
            {content.advantages.map((a, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[13px] text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-[var(--color-brand)] flex-shrink-0 mt-0.5" />
                {tr(a, locale)}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <SectionTitle>{tr(SECTION_LABELS.applications, locale)}</SectionTitle>
          <ul className="mt-3 space-y-2.5">
            {content.applications.map((a, i) => (
              <li key={i} className="flex items-center gap-2.5 text-[13px] text-slate-700">
                <Factory className="h-4 w-4 text-[var(--color-brand)] flex-shrink-0" />
                {tr(a, locale)}
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {content.types.length > 0 && <TypesTab locale={locale} content={content} />}
    </div>
  );
}

function TypesTab({ locale, content }: { locale: Locale; content: ReturnType<typeof getCategoryContent> }) {
  if (content.types.length === 0) {
    return (
      <Panel>
        <p className="text-[14px] text-slate-500 py-6 text-center">—</p>
      </Panel>
    );
  }
  return (
    <Panel>
      <SectionTitle>{tr(SECTION_LABELS.types, locale)}</SectionTitle>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {content.types.map((type, i) => (
          <div
            key={i}
            className="rounded-lg border border-[var(--color-border)] p-4 hover:border-[var(--color-brand)]/40 transition-colors"
          >
            <div className="h-10 w-10 rounded-lg bg-[var(--color-brand-soft)] flex items-center justify-center mb-3">
              <span className="text-[13px] font-bold text-[var(--color-brand)]">{i + 1}</span>
            </div>
            <h3 className="text-[14px] font-bold text-slate-900">{tr(type.title, locale)}</h3>
            <p className="mt-1.5 text-[12.5px] text-slate-500 leading-relaxed">
              {tr(type.desc, locale)}
            </p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-xl bg-white border border-[var(--color-border)] p-5 lg:p-6">
      {children}
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[13px] font-bold tracking-[0.06em] text-[var(--color-brand-strong)]">
      {children}
    </h2>
  );
}
