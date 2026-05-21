"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  Flame,
  FlaskConical,
  Building2,
  Mountain,
  Recycle,
  Zap,
  Plane,
  UtensilsCrossed,
  Hammer,
  Trees,
  Wheat,
  Pill,
  Lightbulb,
  Settings,
  ShieldCheck,
  Headphones,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/shared/types";
import { decorImg } from "@/shared/lib/decor";
import { t } from "@/shared/lib/utils";
import { useGetHomeContentQuery } from "@/store/api/homeContentApi";
import { Editable, useEditorDict } from "@/features/inline-editor";
import { MarketingPagesBlockEditor } from "@/features/inline-editor/blocks/MarketingPagesBlockEditor";
import { PageHeroImage } from "@/widgets/page-hero/PageHeroImage";
import { useQueryParams } from "@/shared/hooks/useQueryParams";

const BLUE = "#1d4ed8";
type LS = Record<Locale, string>;
const tr = (s: LS, l: Locale) => s[l] ?? s.en;
const ls = (uz: string, ru: string, en: string, kz: string): LS => ({ uz, ru, en, kz });

const T = {
  breadHome: ls("Bosh", "Главная", "Home", "Басты"),
  title: ls("Tarmoq yechimlari", "Отраслевые решения", "Industry solutions", "Салалық шешімдер"),
  subtitle: ls(
    "Turli sanoat tarmoqlari uchun havoni filtrlash va tozalash bo'yicha professional yechimlar. Vazifangizga optimal uskunani tanlang.",
    "Профессиональные решения по фильтрации и очистке воздуха для различных отраслей промышленности. Подберите оптимальное оборудование под ваши задачи.",
    "Professional air filtration and cleaning solutions for various industries.",
    "Әртүрлі салаларға арналған кәсіби шешімдер.",
  ),
  pollutionsTitle: ls("ASOSIY IFLOSLANISHLAR", "ОСНОВНЫЕ ЗАГРЯЗНЕНИЯ", "MAIN POLLUTANTS", "НЕГІЗГІ ЛАСТАНУ"),
  equipTitle: ls("TAVSIYA ETILGAN USKUNA", "РЕКОМЕНДУЕМОЕ ОБОРУДОВАНИЕ", "RECOMMENDED EQUIPMENT", "ҰСЫНЫЛАТЫН ЖАБДЫҚ"),
  ctaText: ls("Sohangiz uchun yechim kerakmi?", "Нужно решение для вашей отрасли?", "Need a solution for your industry?", "Сала үшін шешім керек пе?"),
  consult: ls("Konsultatsiya olish", "Получить консультацию", "Get a consultation", "Кеңес алу"),
  advantages: [
    { icon: Lightbulb, label: ls("Individual yondashuv", "Индивидуальный подход", "Individual approach", "Жеке тәсіл") },
    { icon: Settings, label: ls("Injiniring ekspertizasi", "Инженерная экспертиза", "Engineering expertise", "Инженерлік сараптама") },
    { icon: ShieldCheck, label: ls("Ishonchlilik va sifat", "Надежность и качество", "Reliability & quality", "Сенімділік пен сапа") },
  ],
};

interface Industry {
  icon: LucideIcon;
  name: LS;
  pollutants: LS[];
  equipment: LS[];
}

const INDUSTRIES: Industry[] = [
  {
    icon: Flame,
    name: ls("Neft-gaz tarmog'i", "Нефтегазовая отрасль", "Oil & gas", "Мұнай-газ саласы"),
    pollutants: [ls("Moyli tuman", "Масляный туман", "Oil mist", "Май тұманы"), ls("Uglevodorod bug'lari", "Углеводородные пары", "Hydrocarbon vapors", "Көмірсутек булары"), ls("Tutun va kuya", "Дымы и сажа", "Smoke and soot", "Түтін мен күйе"), ls("Vodorod sulfidi (H₂S)", "Сероводород (H₂S)", "Hydrogen sulfide", "Күкіртсутек")],
    equipment: [ls("Skrubberlar", "Скрубберы", "Scrubbers", "Скрубберлер"), ls("Kartrij filtrlar", "Картриджные фильтры", "Cartridge filters", "Картридж сүзгілер"), ls("Elektrostatik filtrlar", "Электростатические фильтры", "Electrostatic filters", "Электростатикалық сүзгілер"), ls("Moy ajratgichlar", "Маслоуловители", "Oil separators", "Май ұстағыштар")],
  },
  {
    icon: FlaskConical,
    name: ls("Kimyo sanoati", "Химическая промышленность", "Chemical industry", "Химия өнеркәсібі"),
    pollutants: [ls("Kislotali gazlar", "Кислотные газы", "Acid gases", "Қышқыл газдар"), ls("Ishqorli bug'lar", "Щелочные пары", "Alkaline vapors", "Сілтілі булар")],
    equipment: [ls("Skrubberlar", "Скрубберы", "Scrubbers", "Скрубберлер"), ls("Yengli filtrlar", "Рукавные фильтры", "Bag filters", "Жеңді сүзгілер")],
  },
  {
    icon: Building2,
    name: ls("Sement sanoati", "Цементная промышленность", "Cement industry", "Цемент өнеркәсібі"),
    pollutants: [ls("Sement changi", "Цементная пыль", "Cement dust", "Цемент шаңы")],
    equipment: [ls("Yengli filtrlar", "Рукавные фильтры", "Bag filters", "Жеңді сүзгілер"), ls("Siklonlar", "Циклоны", "Cyclones", "Циклондар")],
  },
  {
    icon: Mountain,
    name: ls("Tog'-kon sanoati", "Горнодобывающая промышленность", "Mining", "Тау-кен өнеркәсібі"),
    pollutants: [ls("Mineral chang", "Минеральная пыль", "Mineral dust", "Минералды шаң")],
    equipment: [ls("Yengli filtrlar", "Рукавные фильтры", "Bag filters", "Жеңді сүзгілер"), ls("Siklonlar", "Циклоны", "Cyclones", "Циклондар")],
  },
  {
    icon: Recycle,
    name: ls("Chiqindilarni utilizatsiya", "Утилизация отходов и заводы", "Waste recycling", "Қалдықтарды кәдеге жарату"),
    pollutants: [ls("Yonish gazlari", "Дымовые газы", "Flue gases", "Түтін газдары")],
    equipment: [ls("Skrubberlar", "Скрубберы", "Scrubbers", "Скрубберлер"), ls("Elektrostatik filtrlar", "Электростатические фильтры", "ESP", "Электростатикалық сүзгілер")],
  },
  {
    icon: Zap,
    name: ls("Energetika va IES", "Энергетика и ТЭЦ", "Power & CHP", "Энергетика және ЖЭО"),
    pollutants: [ls("Kul va chang", "Зола и пыль", "Ash and dust", "Күл мен шаң")],
    equipment: [ls("Elektrostatik filtrlar", "Электростатические фильтры", "ESP", "Электростатикалық сүзгілер"), ls("Yengli filtrlar", "Рукавные фильтры", "Bag filters", "Жеңді сүзгілер")],
  },
  {
    icon: Plane,
    name: ls("Tijorat binolari va vokzallar", "Коммерческие здания и вокзалы", "Commercial buildings", "Коммерциялық ғимараттар"),
    pollutants: [ls("Maydadispers chang", "Мелкодисперсная пыль", "Fine dust", "Ұсақ шаң")],
    equipment: [ls("Ventilyatsiya filtrlari", "Вентиляционные фильтры", "Ventilation filters", "Желдету сүзгілері")],
  },
  {
    icon: UtensilsCrossed,
    name: ls("Oshxona va restoran biznesi", "Кухни и ресторанный бизнес", "Kitchens & restaurants", "Асханалар"),
    pollutants: [ls("Yog'li tuman", "Жировой туман", "Grease mist", "Май тұманы")],
    equipment: [ls("Elektrostatik filtrlar", "Электростатические фильтры", "ESP", "Электростатикалық сүзгілер")],
  },
  {
    icon: Hammer,
    name: ls("Metallni qayta ishlash va payvand", "Металлообработка и сварка", "Metalworking & welding", "Металл өңдеу"),
    pollutants: [ls("Payvand tutuni", "Сварочный дым", "Welding fume", "Дәнекерлеу түтіні")],
    equipment: [ls("Kartrij filtrlar", "Картриджные фильтры", "Cartridge filters", "Картридж сүзгілер")],
  },
  {
    icon: Trees,
    name: ls("Yog'ochni qayta ishlash", "Деревообработка", "Woodworking", "Ағаш өңдеу"),
    pollutants: [ls("Yog'och changi", "Древесная пыль", "Wood dust", "Ағаш шаңы")],
    equipment: [ls("Yengli filtrlar", "Рукавные фильтры", "Bag filters", "Жеңді сүзгілер"), ls("Siklonlar", "Циклоны", "Cyclones", "Циклондар")],
  },
  {
    icon: Wheat,
    name: ls("Oziq-ovqat sanoati", "Пищевая промышленность", "Food industry", "Тамақ өнеркәсібі"),
    pollutants: [ls("Organik chang", "Органическая пыль", "Organic dust", "Органикалық шаң")],
    equipment: [ls("Yengli filtrlar", "Рукавные фильтры", "Bag filters", "Жеңді сүзгілер")],
  },
  {
    icon: Pill,
    name: ls("Farmatsevtika va biotexnologiya", "Фармацевтика и биотехнологии", "Pharma & biotech", "Фармацевтика"),
    pollutants: [ls("Maydadispers zarralar", "Мелкодисперсные частицы", "Fine particles", "Ұсақ бөлшектер")],
    equipment: [ls("HEPA filtrlar", "HEPA фильтры", "HEPA filters", "HEPA сүзгілер")],
  },
];

export function IndustriesClient({ locale }: { locale: Locale }) {
  const { data: home } = useGetHomeContentQuery();
  const ed = useEditorDict();
  const cms = home?.pages?.industries;
  const title = t(cms?.title, locale) || tr(T.title, locale);
  const subtitle = t(cms?.subtitle, locale) || tr(T.subtitle, locale);
  const image = cms?.image || decorImg(413, 1600, 500);

  const { params, setParams } = useQueryParams();
  const foundIdx = INDUSTRIES.findIndex((ind) => ind.name.en === params.industry);
  const active = foundIdx === -1 ? 0 : foundIdx;
  const sel = INDUSTRIES[active];

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
        <Editable
          id="page-industries"
          label={ed.editPageLabel}
          block={() => ({
            title: ed.marketingTitle,
            description: ed.marketingDesc,
            wide: true,
            render: (close) => (
              <MarketingPagesBlockEditor close={close} initialTab="industries" />
            ),
          })}
        >
        <section className="rounded-xl bg-white border border-[var(--color-border)] p-6 lg:p-8">
          <PageHeroImage image={image} />
          <div className="flex flex-col lg:flex-row gap-6 justify-between lg:items-end">
            <div className="max-w-2xl">
              <h1 className="text-2xl lg:text-[34px] font-extrabold tracking-tight text-[var(--color-brand-strong)] uppercase">
                {title}
              </h1>
              <p className="mt-3 text-[14px] text-slate-600 leading-relaxed">{subtitle}</p>
            </div>
            <div className="flex gap-5">
              {T.advantages.map((a, i) => (
                <div key={i} className="flex items-start gap-2 max-w-[150px]">
                  <a.icon className="h-5 w-5 text-[var(--color-brand)] flex-shrink-0" />
                  <span className="text-[11.5px] text-slate-600 leading-tight">{tr(a.label, locale)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        </Editable>

        {/* 12 industry cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {INDUSTRIES.map((ind, i) => {
            const isActive = i === active;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setParams({ industry: ind.name.en })}
                className={`relative rounded-xl border p-4 text-left transition-all ${
                  isActive
                    ? "border-[var(--color-brand)] bg-white shadow-md"
                    : "border-[var(--color-border)] bg-white hover:border-[var(--color-brand)]/40 hover:shadow-sm"
                }`}
              >
                <span className="absolute top-2.5 right-3 text-[15px] font-extrabold text-slate-200">{i + 1}</span>
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-lg mb-3"
                  style={isActive ? { backgroundColor: BLUE, color: "#fff" } : { backgroundColor: "var(--color-brand-soft)", color: "var(--color-brand)" }}
                >
                  <ind.icon className="h-5 w-5" />
                </span>
                <p className="text-[12px] font-semibold text-slate-800 leading-tight">{tr(ind.name, locale)}</p>
              </button>
            );
          })}
        </div>

        {/* Selected industry detail */}
        <section className="overflow-hidden rounded-xl bg-white border border-[var(--color-border)]">
          <div className="relative h-44 lg:h-52 overflow-hidden bg-[var(--color-ink)]">
            <Image
              src={decorImg(200 + active, 1600, 520)}
              alt={tr(sel.name, locale)}
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            <div className="absolute bottom-0 left-0 flex items-center gap-3 p-6 lg:p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-md" style={{ backgroundColor: BLUE }}>
                <sel.icon className="h-6 w-6" />
              </span>
              <h2 className="text-xl lg:text-2xl font-extrabold text-white">{tr(sel.name, locale)}</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 lg:p-8">
            <div className="rounded-lg bg-[var(--color-surface)] p-5">
              <h3 className="text-[12px] font-bold tracking-[0.06em] text-[var(--color-brand-strong)]">{tr(T.pollutionsTitle, locale)}</h3>
              <ul className="mt-3 space-y-2">
                {sel.pollutants.map((p, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-[13.5px] text-slate-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                    {tr(p, locale)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-[var(--color-surface)] p-5">
              <h3 className="text-[12px] font-bold tracking-[0.06em] text-[var(--color-brand-strong)]">{tr(T.equipTitle, locale)}</h3>
              <ul className="mt-3 space-y-2">
                {sel.equipment.map((e, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-[13.5px] text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-[var(--color-brand)] flex-shrink-0" />
                    {tr(e, locale)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-xl bg-[var(--color-brand-soft)] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Headphones className="h-6 w-6 text-[var(--color-brand)]" />
            <p className="text-[14px] font-semibold text-[var(--color-brand-strong)]">{tr(T.ctaText, locale)}</p>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("phoenix:open-tz"))}
            className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-[13.5px] font-semibold text-white whitespace-nowrap"
            style={{ backgroundColor: BLUE }}
          >
            {tr(T.consult, locale)}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
