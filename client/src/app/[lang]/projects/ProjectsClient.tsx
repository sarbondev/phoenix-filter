"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Briefcase,
  Factory,
  Globe,
  ShieldCheck,
  Gauge,
  Boxes,
  MapPin,
  Calendar,
} from "lucide-react";
import type { Locale } from "@/shared/types";
import { decorImg } from "@/shared/lib/decor";
import { t } from "@/shared/lib/utils";
import { useGetHomeContentQuery } from "@/store/api/homeContentApi";
import { Editable, useEditorDict } from "@/features/inline-editor";
import { MarketingPagesBlockEditor } from "@/features/inline-editor/blocks/MarketingPagesBlockEditor";
import { useQueryParams } from "@/shared/hooks/useQueryParams";
import { PageHeroImage } from "@/widgets/page-hero/PageHeroImage";

const BLUE = "#1d4ed8";
type LS = Record<Locale, string>;
const tr = (s: LS, l: Locale) => s[l] ?? s.en;
const ls = (uz: string, ru: string, en: string, kz: string): LS => ({ uz, ru, en, kz });

const T = {
  breadHome: ls("Bosh", "Главная", "Home", "Басты"),
  title: ls("Bizning loyihalar", "Наши проекты", "Our projects", "Біздің жобалар"),
  subtitle: ls(
    "Individual aspiratsiya tizimlaridan tortib yirik sanoat majmualarigacha — har qanday murakkablikdagi loyihalarni amalga oshiramiz.",
    "Мы реализуем проекты любой сложности — от индивидуальных систем аспирации до крупных промышленных комплексов под ключ.",
    "We deliver projects of any complexity — from custom aspiration systems to large turnkey industrial complexes.",
    "Кез келген күрделіктегі жобаларды іске асырамыз.",
  ),
  all: ls("Barchasi", "Все проекты", "All projects", "Барлығы"),
  ctaTitle: ls("Loyihani amalga oshirmoqchimisiz?", "Хотите реализовать проект?", "Want to deliver a project?", "Жобаны іске асырғыңыз келе ме?"),
  ctaText: ls(
    "Loyihangiz haqida gapirib bering — muhandislarimiz optimal yechim tayyorlaydi.",
    "Расскажите о вашем проекте, и наши инженеры подготовят оптимальное решение.",
    "Tell us about your project and our engineers will prepare a solution.",
    "Жобаңыз туралы айтыңыз.",
  ),
  send: ls("Zayavka yuborish", "Отправить запрос", "Send request", "Сұрау жіберу"),
  equip: ls("Uskuna", "Оборудование", "Equipment", "Жабдық"),
  capacity: ls("Quvvati", "Производительность", "Capacity", "Өнімділік"),
};

const STATS: { icon: typeof Briefcase; value: string; label: LS }[] = [
  { icon: Briefcase, value: "250+", label: ls("Amalga oshirilgan loyiha", "Реализованных проектов", "Completed projects", "Жобалар") },
  { icon: Factory, value: "15+", label: ls("Sanoat tarmog'i", "Отраслей промышленности", "Industries", "Салалар") },
  { icon: Globe, value: "6", label: ls("Mavjud davlatlar", "Стран присутствия", "Countries", "Елдер") },
  { icon: ShieldCheck, value: "100%", label: ls("Ekologik me'yorlarga muvofiqlik", "Соответствие экологическим нормам", "Eco compliance", "Экологиялық сәйкестік") },
];

interface Project {
  industry: LS;
  title: LS;
  capacity: string;
  equipment: LS;
  country: LS;
  year: string;
}

const PROJECTS: Project[] = [
  {
    industry: ls("Metallni qayta ishlash", "Металлообработка", "Metalworking", "Металл өңдеу"),
    title: ls("Drobjet kamerasi uchun aspiratsiya tizimi", "Система аспирации для дробеструйной камеры", "Aspiration for shot-blast chamber", "Аспирация жүйесі"),
    capacity: "30 000 m³/h",
    equipment: ls("Yengli filtr, siklon, ventilyator", "Рукавный фильтр, циклон, вентилятор", "Bag filter, cyclone, fan", "Жеңді сүзгі, циклон"),
    country: ls("O'zbekiston", "Узбекистан", "Uzbekistan", "Өзбекстан"),
    year: "2024",
  },
  {
    industry: ls("Oziq-ovqat sanoati", "Пищевая промышленность", "Food industry", "Тамақ өнеркәсібі"),
    title: ls("Un ishlab chiqarish uchun havo tozalash majmuasi", "Комплекс очистки воздуха для производства муки", "Air cleaning for flour production", "Ауа тазалау кешені"),
    capacity: "12 000 m³/h",
    equipment: ls("Yengli filtr, siklon", "Рукавный фильтр, циклон", "Bag filter, cyclone", "Жеңді сүзгі, циклон"),
    country: ls("Qozog'iston", "Казахстан", "Kazakhstan", "Қазақстан"),
    year: "2024",
  },
  {
    industry: ls("Metallni qayta ishlash", "Металлообработка", "Metalworking", "Металл өңдеу"),
    title: ls("Payvandlash tutunini filtrlash tizimi", "Система фильтрации сварочного дыма", "Welding fume filtration", "Дәнекерлеу түтінін сүзу"),
    capacity: "15 000 m³/h",
    equipment: ls("Kartrij filtr, ventilyator", "Картриджный фильтр, вентилятор", "Cartridge filter, fan", "Картридж сүзгі"),
    country: ls("O'zbekiston", "Узбекистан", "Uzbekistan", "Өзбекстан"),
    year: "2024",
  },
  {
    industry: ls("Yog'ochni qayta ishlash", "Деревообработка", "Woodworking", "Ағаш өңдеу"),
    title: ls("Yog'ochni qayta ishlash sexi uchun aspiratsiya", "Аспирационная система для деревообрабатывающего цеха", "Aspiration for woodworking shop", "Ағаш цехына аспирация"),
    capacity: "18 000 m³/h",
    equipment: ls("Yengli filtr, ventilyator", "Рукавный фильтр, вентилятор", "Bag filter, fan", "Жеңді сүзгі"),
    country: ls("O'zbekiston", "Узбекистан", "Uzbekistan", "Өзбекстан"),
    year: "2023",
  },
  {
    industry: ls("Energetika", "Энергетика", "Power", "Энергетика"),
    title: ls("Qozonxona uchun gaz tozalash tizimi", "Система газоочистки котельной", "Boiler gas cleaning system", "Қазандық газ тазалау"),
    capacity: "30 000 m³/h",
    equipment: ls("Elektrostatik filtr, dymosos", "Электростатический фильтр, дымосос", "ESP, induced draft fan", "Электростатикалық сүзгі"),
    country: ls("Tojikiston", "Таджикистан", "Tajikistan", "Тәжікстан"),
    year: "2023",
  },
  {
    industry: ls("Kimyo sanoati", "Химическая промышленность", "Chemical industry", "Химия өнеркәсібі"),
    title: ls("Gazlarni tozalash uchun nam skrubber", "Мокрый скруббер для очистки газов", "Wet scrubber for gas cleaning", "Газ тазалауға арналған скруббер"),
    capacity: "20 000 m³/h",
    equipment: ls("Skrubber Venturi, kaplyeulovitel", "Скруббер Вентури, каплеуловитель", "Venturi scrubber, demister", "Вентури скруббер"),
    country: ls("Qozog'iston", "Казахстан", "Kazakhstan", "Қазақстан"),
    year: "2023",
  },
];

export function ProjectsClient({ locale }: { locale: Locale }) {
  const { data: home } = useGetHomeContentQuery();
  const ed = useEditorDict();
  const { params, setParams } = useQueryParams();
  const cms = home?.pages?.projects;
  const title = t(cms?.title, locale) || tr(T.title, locale);
  const subtitle = t(cms?.subtitle, locale) || tr(T.subtitle, locale);
  const image = cms?.image || decorImg(412, 1600, 500);
  const stats =
    cms?.stats && cms.stats.length
      ? cms.stats.map((s, i) => ({
          value: s.value,
          label: t(s.label, locale),
          icon: STATS[i]?.icon ?? Briefcase,
        }))
      : STATS.map((s) => ({
          value: s.value,
          label: tr(s.label, locale),
          icon: s.icon,
        }));

  // Locale-independent industry keys (English) so the URL filter is stable
  // across languages; the tab label stays localized.
  const industries = Array.from(
    new Map(PROJECTS.map((p) => [p.industry.en, p.industry])).values(),
  );
  const filter = params.industry ?? null;

  const visible = filter
    ? PROJECTS.filter((p) => p.industry.en === filter)
    : PROJECTS;

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

      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 py-7 lg:py-9 space-y-6">
        {/* Hero + stats */}
        <Editable
          id="page-projects"
          label={ed.editPageLabel}
          block={() => ({
            title: ed.marketingTitle,
            description: ed.marketingDesc,
            wide: true,
            render: (close) => (
              <MarketingPagesBlockEditor close={close} initialTab="projects" />
            ),
          })}
        >
        <section className="rounded-xl bg-white border border-[var(--color-border)] p-6 lg:p-8">
          <PageHeroImage image={image} />
          <div className="flex flex-col lg:flex-row lg:items-end gap-6 justify-between">
            <div className="max-w-2xl">
              <h1 className="text-2xl lg:text-[34px] font-extrabold tracking-tight text-[var(--color-brand-strong)] uppercase">
                {title}
              </h1>
              <p className="mt-3 text-[14px] text-slate-600 leading-relaxed">{subtitle}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:w-[480px]">
              {stats.map((s, i) => (
                <div key={i} className="rounded-xl bg-[var(--color-surface)] p-4 text-center">
                  <s.icon className="h-6 w-6 mx-auto text-[var(--color-brand)]" />
                  <p className="mt-2 text-xl font-extrabold text-[var(--color-brand-strong)] leading-none">{s.value}</p>
                  <p className="mt-1 text-[10.5px] text-slate-500 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Industry filter tabs */}
          <div className="mt-6 flex flex-wrap gap-2 border-t border-[var(--color-border)] pt-5">
            <FilterTab
              active={filter === null}
              onClick={() => setParams({ industry: undefined })}
            >
              {tr(T.all, locale)}
            </FilterTab>
            {industries.map((ind) => (
              <FilterTab
                key={ind.en}
                active={filter === ind.en}
                onClick={() => setParams({ industry: ind.en })}
              >
                {tr(ind, locale)}
              </FilterTab>
            ))}
          </div>
        </section>
        </Editable>

        {/* Project cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {visible.map((p, i) => (
            <article key={i} className="rounded-xl bg-white border border-[var(--color-border)] overflow-hidden hover:shadow-md hover:border-[var(--color-brand)]/40 transition-all">
              <div className="relative h-40 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                <Image
                  src={decorImg(120 + PROJECTS.indexOf(p), 800, 480)}
                  alt={tr(p.title, locale)}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                <span className="absolute top-3 left-3 inline-flex items-center rounded-md bg-[var(--color-brand)] text-white px-2.5 py-1 text-[10.5px] font-semibold">
                  {tr(p.industry, locale)}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-[13.5px] font-bold text-slate-900 leading-snug line-clamp-2 min-h-[36px]">
                  {tr(p.title, locale)}
                </h3>
                <ul className="mt-3 space-y-1.5 text-[11.5px] text-slate-500">
                  <li className="flex items-center gap-2">
                    <Gauge className="h-3.5 w-3.5 text-[var(--color-brand)] flex-shrink-0" />
                    {tr(T.capacity, locale)}: {p.capacity}
                  </li>
                  <li className="flex items-start gap-2">
                    <Boxes className="h-3.5 w-3.5 text-[var(--color-brand)] flex-shrink-0 mt-0.5" />
                    {tr(T.equip, locale)}: {tr(p.equipment, locale)}
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-[var(--color-brand)] flex-shrink-0" />
                    {tr(p.country, locale)}
                  </li>
                  <li className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-[var(--color-brand)] flex-shrink-0" />
                    {p.year}
                  </li>
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <section className="rounded-xl bg-[var(--color-ink)] text-white p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h2 className="text-xl font-extrabold">{tr(T.ctaTitle, locale)}</h2>
            <p className="mt-1.5 text-[13.5px] text-white/75">{tr(T.ctaText, locale)}</p>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("phoenix:open-tz"))}
            className="rounded-lg px-6 py-3 text-[14px] font-semibold text-white whitespace-nowrap"
            style={{ backgroundColor: BLUE }}
          >
            {tr(T.send, locale)}
          </button>
        </section>
      </div>
    </main>
  );
}

function FilterTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-[12.5px] font-semibold transition-colors ${
        active ? "text-white" : "bg-[var(--color-surface)] text-slate-600 hover:bg-slate-200"
      }`}
      style={active ? { backgroundColor: BLUE } : undefined}
    >
      {children}
    </button>
  );
}
