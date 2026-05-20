"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  Search,
  Shield,
  Zap,
  Award,
  Wallet,
  CheckCircle2,
  Truck,
  Download,
  PhoneCall,
  MessageCircle,
} from "lucide-react";
import type { Locale } from "@/shared/types";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";
import { useGetDirectionsQuery } from "@/store/api/directionApi";
import { useGetEquipmentTypesQuery } from "@/store/api/equipmentTypeApi";
import { t, getImageUrl } from "@/shared/lib/utils";
import { SX, tr } from "./strings";

const ADVANTAGE_ICONS = [Shield, Zap, Award, Wallet, CheckCircle2, Truck];

export function SpetstexnikaClient({ locale }: { locale: Locale }) {
  return (
    <main className="bg-white">
      <Hero locale={locale} />
      <EquipmentGrid locale={locale} />
      <CategoriesGrid locale={locale} />
      <KillerFlow locale={locale} />
      <ApplicationsBlock locale={locale} />
      <BrandsBlock locale={locale} />
      <HeavyDuty locale={locale} />
      <FooterCta locale={locale} />
    </main>
  );
}

/* ─── Hero ──────────────────────────────────────────────────────────────── */

function Hero({ locale }: { locale: Locale }) {
  return (
    <section className="relative overflow-hidden bg-[var(--color-ink)] text-white">
      <div className="absolute inset-0 bg-diagonal-blue-ink opacity-80" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider">
          {tr(SX.hero.badge, locale)}
        </span>
        <h1 className="mt-4 max-w-3xl text-3xl sm:text-4xl lg:text-[48px] font-extrabold leading-[1.05] tracking-tight">
          {tr(SX.hero.title, locale)}
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] sm:text-base text-white/85 leading-relaxed">
          {tr(SX.hero.subtitle, locale)}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/${locale}/filter-search`}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-highlight)] hover:bg-[var(--color-highlight-hover)] px-6 py-3.5 text-[15px] font-semibold text-[var(--color-ink)] transition-colors"
          >
            <Search className="h-4 w-4" />
            {tr(SX.hero.ctaPick, locale)}
          </Link>
          <a
            href="/uploads/catalog.pdf"
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 hover:bg-white/10 px-6 py-3.5 text-[15px] font-semibold transition-colors"
          >
            <Download className="h-4 w-4" />
            {tr(SX.hero.ctaCatalog, locale)}
          </a>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("phoenix:open-tz"))}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-3.5 text-[15px] font-semibold text-white/85 hover:text-white transition-colors"
          >
            <PhoneCall className="h-4 w-4" />
            {tr(SX.hero.ctaConsult, locale)}
          </button>
        </div>

        {/* advantages strip */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {SX.advantages.map((a, i) => {
            const Icon = ADVANTAGE_ICONS[i] ?? Shield;
            return (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2.5 text-[13px]"
              >
                <Icon className="h-4 w-4 flex-shrink-0 text-[var(--color-highlight)]" />
                <span>{tr(a, locale)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Equipment-types grid (12 cards) ───────────────────────────────────── */

function EquipmentGrid({ locale }: { locale: Locale }) {
  const { data: equipment, isLoading } = useGetEquipmentTypesQuery();

  return (
    <section className="py-14 lg:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="section-title text-2xl lg:text-[28px] text-slate-900">
          {tr(SX.equipment.title, locale)}
        </h2>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] rounded-xl bg-slate-100 animate-pulse"
                />
              ))
            : equipment?.map((et) => (
                <Link
                  key={et.id}
                  href={`/${locale}/spetstexnika/equipment/${et.slug}`}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200 transition-all hover:ring-[var(--color-brand)] hover:shadow-md"
                >
                  {et.image ? (
                    <Image
                      src={getImageUrl(et.image)}
                      alt={t(et.name, locale)}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300" />
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-white text-sm font-semibold">
                      {t(et.name, locale)}
                    </p>
                  </div>
                  <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/0 group-hover:bg-white flex items-center justify-center transition-all">
                    <ArrowRight className="h-4 w-4 text-[var(--color-brand)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Categories grid (9) ───────────────────────────────────────────────── */

function CategoriesGrid({ locale }: { locale: Locale }) {
  const { data: directions } = useGetDirectionsQuery();
  const spetstexnika = directions?.find((d) => d.slug === "spetstexnika");

  const { data: categories, isLoading } = useGetCategoriesQuery(
    spetstexnika?.id ? { direction: spetstexnika.id } : undefined,
    { skip: !spetstexnika?.id },
  );

  return (
    <section className="py-14 lg:py-20 bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="section-title text-2xl lg:text-[28px] text-slate-900">
          {tr(SX.categories.title, locale)}
        </h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-32 rounded-xl bg-slate-200 animate-pulse"
                />
              ))
            : categories
                ?.filter((c) => c.isActive)
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/${locale}/spetstexnika/categories/${cat.slug}`}
                    className="group relative rounded-xl bg-white p-6 ring-1 ring-slate-200 hover:ring-[var(--color-brand)] hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-[var(--color-brand-soft)] flex items-center justify-center flex-shrink-0">
                        <Search className="h-6 w-6 text-[var(--color-brand)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-[var(--color-brand)] transition-colors">
                          {t(cat.name, locale)}
                        </h3>
                        {cat.description && (
                          <p className="mt-1 text-[13px] text-slate-500 line-clamp-2">
                            {t(cat.description, locale)}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[var(--color-brand)] group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Killer flow — single-input shortcut to /filter-search ─────────────── */

function KillerFlow({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      router.push(`/${locale}/filter-search`);
      return;
    }
    router.push(`/${locale}/filter-search?q=${encodeURIComponent(q)}`);
  };

  return (
    <section className="py-14 lg:py-20 bg-[var(--color-brand-strong)] text-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <h2 className="text-2xl lg:text-[32px] font-extrabold tracking-tight">
          {tr(SX.killer.title, locale)}
        </h2>
        <p className="mt-3 text-white/80 text-[15px]">
          {tr(SX.killer.subtitle, locale)}
        </p>
        <form
          onSubmit={submit}
          className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-0 max-w-2xl mx-auto"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tr(SX.killer.placeholder, locale)}
              className="w-full h-14 sm:rounded-l-lg sm:rounded-r-none rounded-lg pl-12 pr-4 text-[15px] bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-highlight)]"
            />
          </div>
          <button
            type="submit"
            className="h-14 px-6 sm:rounded-r-lg sm:rounded-l-none rounded-lg bg-[var(--color-highlight)] hover:bg-[var(--color-highlight-hover)] text-[var(--color-ink)] font-bold text-[15px] inline-flex items-center justify-center gap-2 transition-colors"
          >
            {tr(SX.killer.cta, locale)}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  );
}

/* ─── Applications block (4 cards) ──────────────────────────────────────── */

function ApplicationsBlock({ locale }: { locale: Locale }) {
  return (
    <section className="py-14 lg:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="section-title text-2xl lg:text-[28px] text-slate-900">
          {tr(SX.application.title, locale)}
        </h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SX.application.cards.map((card, i) => (
            <div
              key={i}
              className="rounded-xl p-6 bg-[var(--color-surface)] ring-1 ring-slate-200"
            >
              <div className="h-10 w-10 rounded-lg bg-[var(--color-brand-soft)] flex items-center justify-center mb-4">
                <Shield className="h-5 w-5 text-[var(--color-brand)]" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {tr(card.title, locale)}
              </h3>
              <ul className="mt-3 space-y-1.5 text-[13px] text-slate-600">
                {card.items.map((it) => (
                  <li key={it} className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-[var(--color-brand)]" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Brands grid (10 logos as text-pills until images uploaded) ─────────── */

function BrandsBlock({ locale }: { locale: Locale }) {
  return (
    <section className="py-14 lg:py-20 bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="section-title text-2xl lg:text-[28px] text-slate-900">
          {tr(SX.brands.title, locale)}
        </h2>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {SX.brands.list.map((brand) => (
            <div
              key={brand}
              className="h-20 rounded-lg bg-white ring-1 ring-slate-200 flex items-center justify-center text-[15px] font-bold text-slate-700 tracking-tight hover:ring-[var(--color-brand)] transition-colors cursor-default"
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Heavy-duty conditions ─────────────────────────────────────────────── */

function HeavyDuty({ locale }: { locale: Locale }) {
  const problems = SX.heavyDuty.problems[locale] ?? SX.heavyDuty.problems.en;
  const solutions = SX.heavyDuty.solutions[locale] ?? SX.heavyDuty.solutions.en;

  return (
    <section className="py-14 lg:py-20 bg-[var(--color-ink)] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl lg:text-[28px] font-extrabold tracking-tight">
          {tr(SX.heavyDuty.title, locale)}
        </h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-wider text-white/60 mb-4">
              {tr(SX.heavyDuty.problemsLabel, locale)}
            </p>
            <ul className="space-y-2">
              {problems.map((p) => (
                <li
                  key={p}
                  className="flex items-center gap-3 text-[15px] text-white/85"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-wider text-white/60 mb-4">
              {tr(SX.heavyDuty.solutionsLabel, locale)}
            </p>
            <ul className="space-y-2">
              {solutions.map((s) => (
                <li
                  key={s}
                  className="flex items-center gap-3 text-[15px] text-white/85"
                >
                  <CheckCircle2 className="h-4 w-4 text-[var(--color-highlight)] flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10">
          <Link
            href={`/${locale}/filter-search`}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-highlight)] hover:bg-[var(--color-highlight-hover)] px-6 py-3.5 text-[15px] font-semibold text-[var(--color-ink)] transition-colors"
          >
            {tr(SX.heavyDuty.cta, locale)}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer CTA ────────────────────────────────────────────────────────── */

function FooterCta({ locale }: { locale: Locale }) {
  return (
    <section className="py-12 lg:py-14 bg-[var(--color-brand)] text-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <h3 className="text-xl lg:text-2xl font-bold">
          {tr(SX.footerCta.title, locale)}
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/${locale}/filter-search`}
            className="inline-flex items-center gap-2 rounded-lg bg-white text-[var(--color-brand)] px-5 py-3 text-[14px] font-semibold hover:bg-white/90 transition-colors"
          >
            {tr(SX.footerCta.sendOem, locale)}
          </Link>
          <a
            href="https://wa.me/998901234567"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] hover:bg-[#22c35e] px-5 py-3 text-[14px] font-semibold transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            {tr(SX.footerCta.whatsapp, locale)}
          </a>
        </div>
      </div>
    </section>
  );
}
