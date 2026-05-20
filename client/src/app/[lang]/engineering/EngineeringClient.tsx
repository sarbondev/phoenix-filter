"use client";

import Link from "next/link";
import {
  ChevronRight,
  CheckCircle2,
  Search,
  PenTool,
  Calculator,
  Truck,
  Wrench,
  PlayCircle,
  Database,
  Lightbulb,
  FileCheck,
  Rocket,
  Headphones,
  ClipboardCheck,
  Cpu,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/shared/types";
import { CatalogSidebar } from "@/widgets/catalog/CatalogSidebar";

const BLUE = "#1d4ed8";
type LS = Record<Locale, string>;
const tr = (s: LS, l: Locale) => s[l] ?? s.en;
const ls = (uz: string, ru: string, en: string, kz: string): LS => ({ uz, ru, en, kz });

const T = {
  breadHome: ls("Bosh", "Главная", "Home", "Басты"),
  title: ls("Injiniring yechimlari", "Инжиниринговые решения", "Engineering solutions", "Инжинирингтік шешімдер"),
  subtitle: ls(
    "Vazifa tahlilidan tortib uskuna yetkazib berish, montaj va ishga tushirishgacha — to'liq injiniring xizmatlari majmuasi.",
    "Полный комплекс инжиниринговых услуг — от анализа задачи и проектирования до поставки оборудования, монтажа и ввода в эксплуатацию систем газоочистки, аспирации и вентиляции.",
    "A full range of engineering services — from analysis and design to equipment supply, installation and commissioning.",
    "Толық инжиниринг қызметтері — талдаудан жабдықты жеткізу мен іске қосуға дейін.",
  ),
  servicesTitle: ls("BIZNING INJINIRING XIZMATLARIMIZ", "НАШИ ИНЖИНИРИНГОВЫЕ УСЛУГИ", "OUR ENGINEERING SERVICES", "ИНЖИНИРИНГ ҚЫЗМЕТТЕРІ"),
  approachTitle: ls("LOYIHALASHGA YONDASHUVIMIZ", "НАШ ПОДХОД К ПРОЕКТИРОВАНИЮ", "OUR DESIGN APPROACH", "ЖОБАЛАУ ТӘСІЛІМІЗ"),
  softwareTitle: ls("ISHLATILADIGAN DASTURLAR", "ИСПОЛЬЗУЕМЫЕ ПРОГРАММЫ", "SOFTWARE WE USE", "ҚОЛДАНЫЛАТЫН БАҒДАРЛАМАЛАР"),
  trustTitle: ls("NEGA BIZGA ISHONISHADI", "ПОЧЕМУ НАМ ДОВЕРЯЮТ", "WHY THEY TRUST US", "НЕГЕ БІЗГЕ СЕНЕДІ"),
  ctaText: ls(
    "Injiniring hisobi yoki loyiha kerakmi?",
    "Нужен инженерный расчет или проект?",
    "Need an engineering calculation or project?",
    "Инженерлік есеп немесе жоба керек пе?",
  ),
  consult: ls("Konsultatsiya olish", "Получить консультацию", "Get a consultation", "Кеңес алу"),
  pills: [
    ls("Kompleks yondashuv", "Комплексный подход", "Turnkey approach", "Кешенді тәсіл"),
    ls("Tajribali muhandislar", "Опытные инженеры", "Experienced engineers", "Тәжірибелі инженерлер"),
    ls("Zamonaviy texnologiyalar", "Современные технологии", "Modern technology", "Заманауи технологиялар"),
    ls("Aniq hisob va modellashtirish", "Точность расчетов и моделирования", "Accurate calculations", "Дәл есептеу"),
    ls("Standartlarga muvofiqlik", "Соответствие нормам и стандартам", "Standards compliance", "Стандарттарға сәйкестік"),
    ls("Iqtisodiy samaradorlik", "Экономическая эффективность", "Cost efficiency", "Экономикалық тиімділік"),
  ],
};

const SERVICES: { icon: LucideIcon; title: LS; items: LS[] }[] = [
  {
    icon: Search,
    title: ls("Tahlil va konsultatsiya", "Анализ и консультации", "Analysis & consulting", "Талдау және кеңес"),
    items: [
      ls("Obyektni audit va tekshirish", "Аудит и обследование объекта", "Site audit and survey", "Нысанды тексеру"),
      ls("Ifloslanish parametrlarini tahlil", "Анализ загрязнений и параметров", "Pollution analysis", "Ластануды талдау"),
      ls("Texnik-iqtisodiy asoslash", "Технико-экономическое обоснование", "Feasibility study", "Техникалық-экономикалық негіздеме"),
    ],
  },
  {
    icon: PenTool,
    title: ls("Loyihalash", "Проектирование", "Design", "Жобалау"),
    items: [
      ls("Loyiha hujjatlari (PD, RD)", "Проектная документация (ПД, РД)", "Project documentation", "Жобалық құжаттама"),
      ls("3D-modellashtirish (BIM)", "3D-моделирование (BIM)", "3D modeling (BIM)", "3D модельдеу"),
      ls("Samaradorlik hisoblari", "Расчеты производительности", "Performance calculations", "Өнімділік есептері"),
    ],
  },
  {
    icon: Calculator,
    title: ls("Injiniring hisoblari", "Инженерные расчеты и моделирование", "Engineering calculations", "Инженерлік есептеулер"),
    items: [
      ls("Aerodinamik hisoblar (CFD)", "Аэродинамические расчеты (CFD)", "Aerodynamic (CFD)", "Аэродинамикалық есеп (CFD)"),
      ls("Shovqin va issiqlik hisoblari", "Шумовые и тепловые расчеты", "Noise & thermal", "Шу және жылу есептері"),
    ],
  },
  {
    icon: Truck,
    title: ls("Uskuna yetkazib berish", "Поставка оборудования", "Equipment supply", "Жабдық жеткізу"),
    items: [
      ls("Tekshirilgan ishlab chiqaruvchilar", "Подбор оборудования от проверенных производителей", "Verified manufacturers", "Тексерілген өндірушілер"),
      ls("Sifat nazorati", "Контроль качества", "Quality control", "Сапа бақылауы"),
      ls("Yetkazib berish muddatlariga rioya", "Соблюдение сроков поставки", "On-time supply", "Мерзімде жеткізу"),
    ],
  },
  {
    icon: Wrench,
    title: ls("Montaj va shef-montaj", "Монтаж и шеф-монтаж", "Installation & supervision", "Монтаж және шеф-монтаж"),
    items: [
      ls("Professional montaj", "Профессиональный монтаж", "Professional install", "Кәсіби монтаж"),
      ls("Barcha bosqichlarda nazorat", "Контроль на всех этапах", "Stage control", "Барлық кезеңде бақылау"),
      ls("Ish sifatini nazorat", "Контроль качества работ", "Work quality control", "Жұмыс сапасын бақылау"),
    ],
  },
  {
    icon: PlayCircle,
    title: ls("Ishga tushirish", "Пусконаладка и ввод в эксплуатацию", "Commissioning", "Іске қосу"),
    items: [
      ls("Pusko-sozlash ishlari", "Пусконаладочные работы", "Commissioning works", "Іске қосу жұмыстары"),
      ls("O'lchov va test", "Измерения и тестирование", "Measurement & testing", "Өлшеу және тестілеу"),
      ls("Xodimlarni o'qitish", "Обучение персонала", "Staff training", "Қызметкерлерді оқыту"),
    ],
  },
];

const STEPS: { icon: LucideIcon; label: LS }[] = [
  { icon: Database, label: ls("Ma'lumot yig'ish", "Сбор данных", "Data collection", "Деректер жинау") },
  { icon: Lightbulb, label: ls("Tahlil va konsepsiya", "Анализ и концепция", "Analysis & concept", "Талдау және тұжырымдама") },
  { icon: PenTool, label: ls("Loyihalash", "Проектирование", "Design", "Жобалау") },
  { icon: FileCheck, label: ls("Kelishuv", "Согласование", "Approval", "Келісу") },
  { icon: Rocket, label: ls("Amalga oshirish", "Реализация", "Implementation", "Іске асыру") },
  { icon: Headphones, label: ls("Qo'llab-quvvatlash", "Поддержка", "Support", "Қолдау") },
];

const SOFTWARE = ["Autodesk Revit", "Autodesk Inventor", "SolidWorks", "Ansys Fluent", "COMSOL", "AutoCAD"];

const TRUST: LS[] = [
  ls("Injiniringda 10 yildan ortiq tajriba", "Более 10 лет опыта в инжиниринге", "10+ years in engineering", "Инжинирингте 10 жылдан астам тәжірибе"),
  ls("Yuzlab amalga oshirilgan loyiha", "Сотни реализованных проектов", "Hundreds of projects", "Жүздеген жоба"),
  ls("Har bir mijozga individual yondashuv", "Индивидуальный подход к каждому клиенту", "Individual approach", "Жеке тәсіл"),
  ls("Zamonaviy texnologiyalar va aniq hisoblar", "Современные технологии и точные расчеты", "Modern tech & accuracy", "Заманауи технологиялар"),
  ls("Muddat va byudjetga rioya", "Соблюдение сроков и бюджета", "On time and on budget", "Мерзім мен бюджетті сақтау"),
];

export function EngineeringClient({ locale }: { locale: Locale }) {
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
            {/* Hero */}
            <section className="rounded-xl bg-white border border-[var(--color-border)] p-6 lg:p-8">
              <h1 className="text-2xl lg:text-[34px] font-extrabold tracking-tight text-[var(--color-brand-strong)] uppercase">
                {tr(T.title, locale)}
              </h1>
              <p className="mt-3 text-[14px] text-slate-600 leading-relaxed max-w-3xl">
                {tr(T.subtitle, locale)}
              </p>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 border-t border-[var(--color-border)] pt-5">
                {T.pills.map((pill, i) => (
                  <div key={i} className="flex flex-col items-start gap-2">
                    <ClipboardCheck className="h-5 w-5 text-[var(--color-brand)]" />
                    <span className="text-[11px] text-slate-600 leading-tight">{tr(pill, locale)}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Services */}
            <section className="rounded-xl bg-white border border-[var(--color-border)] p-5 lg:p-6">
              <SectionTitle>{tr(T.servicesTitle, locale)}</SectionTitle>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SERVICES.map((svc, i) => (
                  <div key={i} className="rounded-lg border border-[var(--color-border)] p-5 hover:border-[var(--color-brand)]/40 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
                        <svc.icon className="h-5 w-5" />
                      </span>
                      <span className="text-[12px] font-bold text-[var(--color-brand)]">{i + 1}</span>
                    </div>
                    <h3 className="text-[14px] font-bold text-slate-900">{tr(svc.title, locale)}</h3>
                    <ul className="mt-3 space-y-1.5">
                      {svc.items.map((it, j) => (
                        <li key={j} className="flex items-start gap-2 text-[12px] text-slate-600">
                          <span className="mt-1 h-1 w-1 rounded-full bg-[var(--color-brand)] flex-shrink-0" />
                          {tr(it, locale)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Approach steps */}
            <section className="rounded-xl bg-white border border-[var(--color-border)] p-5 lg:p-6">
              <SectionTitle>{tr(T.approachTitle, locale)}</SectionTitle>
              <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {STEPS.map((step, i) => (
                  <div key={i} className="relative rounded-lg bg-[var(--color-surface)] p-4 text-center">
                    <span className="absolute top-2 right-2.5 text-[18px] font-extrabold text-slate-200">{i + 1}</span>
                    <step.icon className="h-7 w-7 mx-auto text-[var(--color-brand)]" />
                    <p className="mt-2.5 text-[12px] font-semibold text-slate-700 leading-tight">{tr(step.label, locale)}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Software + Trust */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <section className="rounded-xl bg-white border border-[var(--color-border)] p-5 lg:p-6">
                <SectionTitle>{tr(T.softwareTitle, locale)}</SectionTitle>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {SOFTWARE.map((sw) => (
                    <div key={sw} className="flex items-center gap-2.5 rounded-lg border border-[var(--color-border)] px-3 py-3">
                      <Cpu className="h-5 w-5 text-[var(--color-brand)] flex-shrink-0" />
                      <span className="text-[12.5px] font-semibold text-slate-700">{sw}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-xl bg-white border border-[var(--color-border)] p-5 lg:p-6">
                <SectionTitle>{tr(T.trustTitle, locale)}</SectionTitle>
                <ul className="mt-4 space-y-2.5">
                  {TRUST.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13.5px] text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-[var(--color-brand)] flex-shrink-0 mt-0.5" />
                      {tr(item, locale)}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* CTA */}
            <div className="rounded-xl bg-[var(--color-brand-soft)] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-[var(--color-brand)]" />
                <p className="text-[14px] font-semibold text-[var(--color-brand-strong)]">{tr(T.ctaText, locale)}</p>
              </div>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("phoenix:open-tz"))}
                className="rounded-lg px-5 py-3 text-[13.5px] font-semibold text-white whitespace-nowrap"
                style={{ backgroundColor: BLUE }}
              >
                {tr(T.consult, locale)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[13px] font-bold tracking-[0.06em] text-[var(--color-brand-strong)]">
      {children}
    </h2>
  );
}
