"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Wind,
  Droplet,
  Fuel,
  Gauge,
  Armchair,
  Filter as FilterIcon,
  FlaskConical,
  Tornado,
  Fan,
  Settings,
  Wrench,
  Layers,
  ClipboardCheck,
  ShieldCheck,
  MapPin,
  Headphones,
  Award,
  Building2,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Locale, Direction, Category } from "@/shared/types";
import { useGetDirectionsQuery } from "@/store/api/directionApi";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";
import { t, getImageUrl } from "@/shared/lib/utils";

const BLUE = "#1d4ed8";

/** Category-slug → icon, so each direction card can show its sub-categories. */
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
  "electrostatic-filters": Settings,
  cyclones: Tornado,
  "aspiration-systems": Fan,
  "process-filters": Wrench,
};

const directionRoute = (locale: Locale, slug: string) =>
  slug === "spetstexnika"
    ? `/${locale}/spetstexnika`
    : `/${locale}/products?direction=${slug}`;

interface Props {
  locale: Locale;
}

export function DirectionChooser({ locale }: Props) {
  const { data: directions, isLoading } = useGetDirectionsQuery();
  const { data: categories } = useGetCategoriesQuery();

  const ordered = (directions ?? [])
    .filter((d) => d.isActive)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <main className="bg-[var(--color-surface)]">
      {/* ── Direction chooser ─────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* subtle grid texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(15,23,41,0.06) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight text-[var(--color-brand-strong)]">
              {LABELS.title[locale]}
            </h1>
            <p className="mt-3 text-[15px] lg:text-[17px] text-slate-500 max-w-2xl mx-auto">
              {LABELS.subtitle[locale]}
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isLoading
              ? Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[360px] rounded-2xl bg-slate-200 animate-pulse"
                  />
                ))
              : ordered.map((dir, i) => (
                  <DirectionCard
                    key={dir.id}
                    direction={dir}
                    categories={(categories ?? []).filter(
                      (c) => c.direction === dir.id && c.isActive,
                    )}
                    locale={locale}
                    index={i}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* ── Advantages strip ─────────────────────────────────── */}
      <section className="border-y border-[var(--color-border)] bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-6">
            {ADVANTAGES.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
                  <a.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[13px] font-bold text-slate-900 leading-tight">
                    {a.title[locale]}
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-slate-500 leading-snug">
                    {a.sub[locale]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why us + stats ───────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-8 items-center">
          <div>
            <h2 className="text-2xl lg:text-[28px] font-extrabold tracking-tight text-[var(--color-brand-strong)]">
              {LABELS.whyUs[locale]}
            </h2>
            <ul className="mt-5 space-y-2.5">
              {WHY_US.map((w, i) => (
                <li key={i} className="flex items-center gap-2.5 text-[14px] text-slate-700">
                  <ShieldCheck className="h-4 w-4 text-[var(--color-brand)] flex-shrink-0" />
                  {w[locale]}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATS.map((s, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white ring-1 ring-[var(--color-border)] p-5 text-center"
              >
                <s.icon className="h-7 w-7 mx-auto text-[var(--color-brand)]" />
                <p className="mt-3 text-2xl lg:text-[30px] font-extrabold text-[var(--color-brand-strong)] leading-none">
                  {s.value}
                </p>
                <p className="mt-1.5 text-[12px] text-slate-500">{s.label[locale]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function DirectionCard({
  direction,
  categories,
  locale,
  index,
}: {
  direction: Direction;
  categories: Category[];
  locale: Locale;
  index: number;
}) {
  const cats = categories
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
    >
      <Link
        href={directionRoute(locale, direction.slug)}
        className="group block overflow-hidden rounded-2xl bg-[var(--color-ink)] ring-1 ring-black/5 transition-all hover:ring-[var(--color-brand)]/40 hover:shadow-xl"
      >
        {/* image + overlay + copy */}
        <div className="relative min-h-[260px] p-7 lg:p-8 flex flex-col justify-end">
          {direction.image ? (
            <Image
              src={getImageUrl(direction.image)}
              alt={t(direction.name, locale)}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-diagonal-blue-ink" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-[var(--color-ink)]/80 to-[var(--color-ink)]/30" />

          <div className="relative">
            <h2 className="text-xl lg:text-[26px] font-extrabold leading-tight text-white max-w-sm">
              {t(direction.name, locale)}
            </h2>
            <p className="mt-2.5 text-[13.5px] text-white/80 leading-relaxed max-w-md line-clamp-3">
              {t(direction.description, locale)}
            </p>
            <span
              className="mt-5 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-[13.5px] font-semibold text-white transition-colors"
              style={{ backgroundColor: BLUE }}
            >
              {LABELS.goToSection[locale]}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>

        {/* category icon row */}
        {cats.length > 0 && (
          <div className="grid grid-cols-5 bg-[var(--color-ink-2)] border-t border-white/5">
            {cats.map((cat) => {
              const Icon = CAT_ICON[cat.slug] ?? FilterIcon;
              return (
                <div
                  key={cat.id}
                  className="flex flex-col items-center gap-2 px-2 py-4 text-center"
                >
                  <Icon className="h-6 w-6 text-white/70" />
                  <span className="text-[10.5px] leading-tight text-white/55 line-clamp-2">
                    {t(cat.name, locale)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Link>
    </motion.div>
  );
}

/* ── i18n micro-dictionary ──────────────────────────────────── */

type LS = Record<Locale, string>;

const LABELS: Record<string, LS> = {
  title: {
    uz: "Yo'nalishni tanlang",
    ru: "Выберите направление",
    en: "Choose a direction",
    kz: "Бағытты таңдаңыз",
  },
  subtitle: {
    uz: "Toza ishlab chiqarish va ishonchli texnika uchun kompleks yechimlar",
    ru: "Комплексные решения для чистого производства и надежной техники",
    en: "Complete solutions for clean production and reliable equipment",
    kz: "Таза өндіріс пен сенімді техникаға арналған шешімдер",
  },
  goToSection: {
    uz: "Bo'limga o'tish",
    ru: "Перейти в раздел",
    en: "Go to section",
    kz: "Бөлімге өту",
  },
  whyUs: {
    uz: "Nega bizni tanlashadi",
    ru: "Почему выбирают нас",
    en: "Why they choose us",
    kz: "Неге бізді таңдайды",
  },
};

const ADVANTAGES: { icon: LucideIcon; title: LS; sub: LS }[] = [
  {
    icon: ClipboardCheck,
    title: { uz: "Muhandislik yondashuvi", ru: "Инженерный подход", en: "Engineering approach", kz: "Инженерлік тәсіл" },
    sub: { uz: "Vazifaga mos yechim va hisob-kitob", ru: "Подбор и расчет решений под задачи", en: "Solutions engineered to your task", kz: "Тапсырмаға сай шешім" },
  },
  {
    icon: Settings,
    title: { uz: "Kompleks yechimlar", ru: "Комплексные решения", en: "Turnkey solutions", kz: "Кешенді шешімдер" },
    sub: { uz: "Loyihalash, yetkazib berish, montaj", ru: "Проектирование, поставка, монтаж и сервис", en: "Design, supply, install and service", kz: "Жобалау, жеткізу, монтаж" },
  },
  {
    icon: Award,
    title: { uz: "Ishonchli uskuna", ru: "Надежное оборудование", en: "Reliable equipment", kz: "Сенімді жабдық" },
    sub: { uz: "Faqat tekshirilgan ishlab chiqaruvchilar", ru: "Работаем только с проверенными производителями", en: "Only verified manufacturers", kz: "Тексерілген өндірушілер" },
  },
  {
    icon: MapPin,
    title: { uz: "O'zbekiston va Qozog'iston", ru: "Узбекистан и Казахстан", en: "Uzbekistan & Kazakhstan", kz: "Өзбекстан және Қазақстан" },
    sub: { uz: "Operativ qo'llab-quvvatlash va yetkazib berish", ru: "Оперативная поддержка и поставки", en: "Fast local support and supply", kz: "Жедел қолдау және жеткізу" },
  },
  {
    icon: Headphones,
    title: { uz: "Texnik qo'llab-quvvatlash", ru: "Техническая поддержка", en: "Technical support", kz: "Техникалық қолдау" },
    sub: { uz: "Konsultatsiya va servis xizmati", ru: "Консультации и сервисное обслуживание", en: "Consulting and service", kz: "Кеңес және қызмет көрсету" },
  },
];

const WHY_US: LS[] = [
  { uz: "Loyihalash va yetkazib berishda 10 yildan ortiq tajriba", ru: "Более 10 лет опыта в проектировании и поставках", en: "10+ years in engineering and supply", kz: "Жобалау мен жеткізуде 10 жылдан астам тәжірибе" },
  { uz: "200 dan ortiq amalga oshirilgan loyiha", ru: "Более 200 реализованных проектов", en: "200+ completed projects", kz: "200-ден астам жоба" },
  { uz: "O'z muhandislik bo'limimiz", ru: "Собственный инженерный отдел", en: "In-house engineering team", kz: "Жеке инженерлік бөлім" },
  { uz: "Sifat kafolati va muddatlarga rioya", ru: "Гарантия качества и соблюдение сроков", en: "Quality guarantee and on-time delivery", kz: "Сапа кепілдігі және мерзімді сақтау" },
];

const STATS: { icon: LucideIcon; value: string; label: LS }[] = [
  { icon: Building2, value: "200+", label: { uz: "loyiha", ru: "проектов", en: "projects", kz: "жоба" } },
  { icon: Users, value: "100+", label: { uz: "mijoz", ru: "клиентов", en: "clients", kz: "клиент" } },
  { icon: Award, value: "10+", label: { uz: "yil tajriba", ru: "лет опыта", en: "years", kz: "жыл" } },
  { icon: Headphones, value: "24/7", label: { uz: "qo'llab-quvvatlash", ru: "поддержка", en: "support", kz: "қолдау" } },
];
