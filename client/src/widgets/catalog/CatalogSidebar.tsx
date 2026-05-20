"use client";

import Link from "next/link";
import {
  ChevronRight,
  Filter as FilterIcon,
  Layers,
  FlaskConical,
  Zap,
  Tornado,
  Fan,
  Wrench,
  Headphones,
  Download,
  Lightbulb,
  ShieldCheck,
  BadgeCheck,
  type LucideIcon,
} from "lucide-react";
import type { Locale, Category } from "@/shared/types";
import { useGetDirectionsQuery } from "@/store/api/directionApi";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";
import { t } from "@/shared/lib/utils";

const BLUE = "#1d4ed8";

const CAT_ICON: Record<string, LucideIcon> = {
  "bag-filters": FilterIcon,
  "cartridge-filters": Layers,
  scrubbers: FlaskConical,
  "electrostatic-filters": Zap,
  cyclones: Tornado,
  "aspiration-systems": Fan,
  "process-filters": Wrench,
};

type LS = Record<Locale, string>;

const LABELS: Record<string, LS> = {
  directions: { uz: "YO'NALISHLAR", ru: "НАПРАВЛЕНИЯ", en: "DIRECTIONS", kz: "БАҒЫТТАР" },
  service: { uz: "Servis va xizmat", ru: "Сервис и обслуживание", en: "Service & maintenance", kz: "Сервис және қызмет" },
  helpTitle: { uz: "Tanlovda yordam kerakmi?", ru: "Нужна помощь в подборе?", en: "Need help choosing?", kz: "Таңдауда көмек керек пе?" },
  helpSub: {
    uz: "Muhandislarimiz vazifa va parametrlaringizga mos optimal yechimni tanlaydi.",
    ru: "Наши инженеры подберут оптимальное решение под ваши задачи и параметры.",
    en: "Our engineers will select the optimal solution for your needs.",
    kz: "Инженерлеріміз тапсырмаңызға оңтайлы шешім таңдайды.",
  },
  consult: { uz: "Konsultatsiya olish", ru: "Получить консультацию", en: "Get a consultation", kz: "Кеңес алу" },
  download: { uz: "Katalogni yuklab olish", ru: "Скачать каталог", en: "Download catalog", kz: "Каталогты жүктеу" },
  projects: { uz: "Amalga oshirilgan loyihalar", ru: "Реализованные проекты", en: "Completed projects", kz: "Жобалар" },
  viewProjects: { uz: "Loyihalarni ko'rish", ru: "Смотреть проекты", en: "View projects", kz: "Жобаларды көру" },
};

const HELP_FEATURES: { icon: LucideIcon; label: LS }[] = [
  { icon: Lightbulb, label: { uz: "Individual yechimlar", ru: "Индивидуальные решения", en: "Custom solutions", kz: "Жеке шешімдер" } },
  { icon: ShieldCheck, label: { uz: "Ishonchli uskuna", ru: "Надежное оборудование", en: "Reliable equipment", kz: "Сенімді жабдық" } },
  { icon: BadgeCheck, label: { uz: "Sifat kafolati", ru: "Гарантия качества", en: "Quality guarantee", kz: "Сапа кепілдігі" } },
  { icon: Headphones, label: { uz: "Texnik qo'llab-quvvatlash 24/7", ru: "Техническая поддержка 24/7", en: "Technical support 24/7", kz: "Техникалық қолдау 24/7" } },
];

interface Props {
  locale: Locale;
  activeSlug?: string;
}

export function CatalogSidebar({ locale, activeSlug }: Props) {
  const { data: directions } = useGetDirectionsQuery();
  const industrial = directions?.find((d) => d.slug === "industrial");
  const { data: categories } = useGetCategoriesQuery(
    industrial?.id ? { direction: industrial.id } : undefined,
    { skip: !industrial?.id },
  );

  const cats = (categories ?? [])
    .filter((c) => c.isActive)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <aside className="w-full lg:w-[280px] flex-shrink-0 space-y-5">
      {/* Directions nav */}
      <nav className="overflow-hidden rounded-xl bg-[var(--color-ink)] text-white">
        <div className="px-5 py-3.5 text-[12px] font-bold tracking-[0.14em] text-white/55 border-b border-white/8">
          {LABELS.directions[locale]}
        </div>
        <div className="py-1.5">
          {cats.map((cat: Category) => {
            const Icon = CAT_ICON[cat.slug] ?? FilterIcon;
            const active = cat.slug === activeSlug;
            return (
              <Link
                key={cat.id}
                href={`/${locale}/industrial/${cat.slug}`}
                className="flex items-center gap-3 px-4 py-3 text-[13.5px] transition-colors"
                style={
                  active
                    ? { backgroundColor: BLUE, color: "#fff" }
                    : undefined
                }
              >
                <span className={active ? "text-white" : "text-white/45"}>
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span
                  className={`flex-1 ${active ? "font-semibold" : "text-white/80"}`}
                >
                  {t(cat.name, locale)}
                </span>
                <ChevronRight
                  className={`h-4 w-4 ${active ? "text-white/80" : "text-white/30"}`}
                />
              </Link>
            );
          })}
          {/* Service link (not a product category) */}
          <Link
            href={`/${locale}/services`}
            className="flex items-center gap-3 px-4 py-3 text-[13.5px] text-white/80 hover:bg-white/5 transition-colors"
          >
            <span className="text-white/45">
              <Headphones className="h-[18px] w-[18px]" />
            </span>
            <span className="flex-1">{LABELS.service[locale]}</span>
            <ChevronRight className="h-4 w-4 text-white/30" />
          </Link>
        </div>
      </nav>

      {/* Help widget */}
      <div className="rounded-xl border border-[var(--color-border)] bg-white p-5">
        <p className="text-[14px] font-bold text-slate-900">
          {LABELS.helpTitle[locale]}
        </p>
        <p className="mt-1.5 text-[12px] text-slate-500 leading-relaxed">
          {LABELS.helpSub[locale]}
        </p>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("phoenix:open-tz"))}
          className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-[13px] font-semibold text-white transition-colors"
          style={{ backgroundColor: BLUE }}
        >
          <Headphones className="h-4 w-4" />
          {LABELS.consult[locale]}
        </button>
        <ul className="mt-4 space-y-2.5">
          {HELP_FEATURES.map((f, i) => (
            <li key={i} className="flex items-center gap-2.5 text-[12.5px] text-slate-600">
              <f.icon className="h-4 w-4 text-[var(--color-brand)] flex-shrink-0" />
              {f.label[locale]}
            </li>
          ))}
        </ul>
      </div>

      {/* Download catalog */}
      <a
        href="/uploads/catalog.pdf"
        className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-white px-4 py-3.5 hover:border-[var(--color-brand)]/40 transition-colors"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
          <Download className="h-4 w-4" />
        </span>
        <span className="text-[12.5px] font-semibold text-slate-800 leading-tight">
          {LABELS.download[locale]}
        </span>
      </a>

      {/* Projects card */}
      <Link
        href={`/${locale}/projects`}
        className="group relative block overflow-hidden rounded-xl bg-[var(--color-ink)] min-h-[150px] p-5 flex flex-col justify-end"
      >
        <div className="absolute inset-0 bg-diagonal-blue-ink opacity-60" />
        <div className="relative">
          <p className="text-[13px] font-bold text-white">{LABELS.projects[locale]}</p>
          <span className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/80 group-hover:text-white transition-colors">
            {LABELS.viewProjects[locale]}
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </aside>
  );
}
