"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  PenTool,
  Wrench,
  Settings,
  Hammer,
  Package,
  TrendingUp,
  FileText,
  Headphones,
  ClipboardList,
  PhoneCall,
  CheckCircle2,
  Clock,
  Award,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/shared/types";
import { CatalogSidebar } from "@/widgets/catalog/CatalogSidebar";
import { decorImg } from "@/shared/lib/decor";
import { t } from "@/shared/lib/utils";
import { useGetHomeContentQuery } from "@/store/api/homeContentApi";
import { Editable, useEditorDict } from "@/features/inline-editor";
import { MarketingPagesBlockEditor } from "@/features/inline-editor/blocks/MarketingPagesBlockEditor";
import { PageHeroImage } from "@/widgets/page-hero/PageHeroImage";

const BLUE = "#1d4ed8";
type LS = Record<Locale, string>;
const tr = (s: LS, l: Locale) => s[l] ?? s.en;
const ls = (uz: string, ru: string, en: string, kz: string): LS => ({ uz, ru, en, kz });

const T = {
  breadHome: ls("Bosh", "Главная", "Home", "Басты"),
  title: ls("Servis va xizmat ko'rsatish", "Сервис и обслуживание", "Service & maintenance", "Сервис және қызмет"),
  subtitle: ls(
    "Uskunangizning to'liq hayot tsiklini qo'llab-quvvatlaymiz — tanlash va montajdan tortib muntazam xizmat va modernizatsiyagacha.",
    "Мы обеспечиваем полный жизненный цикл поддержки вашего оборудования — от подбора и монтажа до регулярного обслуживания и модернизации.",
    "We support the full lifecycle of your equipment — from selection and installation to regular maintenance and modernization.",
    "Жабдықтың толық өмірлік циклін қолдаймыз.",
  ),
  servicesTitle: ls("BIZNING XIZMATLARIMIZ", "НАШИ СЕРВИСЫ", "OUR SERVICES", "ҚЫЗМЕТТЕРІМІЗ"),
  advantagesTitle: ls("BIZ BILAN ISHLASH AFZALLIKLARI", "ПРЕИМУЩЕСТВА РАБОТЫ С НАМИ", "ADVANTAGES OF WORKING WITH US", "БІЗБЕН ЖҰМЫС АРТЫҚШЫЛЫҒЫ"),
  howTitle: ls("QANDAY ISHLAYMIZ", "КАК МЫ РАБОТАЕМ", "HOW WE WORK", "ҚАЛАЙ ЖҰМЫС ІСТЕЙМІЗ"),
  supportTitle: ls("TEXNIK QO'LLAB-QUVVATLASH 24/7", "ТЕХНИЧЕСКАЯ ПОДДЕРЖКА 24/7", "TECHNICAL SUPPORT 24/7", "ТЕХНИКАЛЫҚ ҚОЛДАУ 24/7"),
  supportBody: ls(
    "Har qanday savollarni hal qilishda yordam berishga doim tayyormiz.",
    "Мы всегда на связи и готовы помочь в решении любых вопросов.",
    "We are always available and ready to help with any issues.",
    "Кез келген сұрақта көмектесуге дайынбыз.",
  ),
  contractTitle: ls("SHARTNOMA ASOSIDA XIZMAT", "ДОГОВОРНОЕ ОБСЛУЖИВАНИЕ", "CONTRACT SERVICE", "ШАРТТЫҚ ҚЫЗМЕТ"),
  contractItems: [
    ls("Rejali texnik xizmat", "Плановое техническое обслуживание", "Scheduled maintenance", "Жоспарлы қызмет"),
    ls("Zayavkalarga ustuvor javob", "Приоритетное реагирование на заявки", "Priority response", "Басым әрекет ету"),
    ls("Zaxira qismlarga chegirma", "Скидки на запчасти", "Spare parts discounts", "Қосалқы бөлшектерге жеңілдік"),
    ls("Uskuna holati bo'yicha hisobotlar", "Отчеты о состоянии оборудования", "Equipment status reports", "Жабдық туралы есептер"),
  ],
  ctaText: ls("Servis yoki konsultatsiya kerakmi?", "Нужен сервис или консультация?", "Need service or a consultation?", "Сервис керек пе?"),
  consult: ls("Konsultatsiya olish", "Получить консультацию", "Get a consultation", "Кеңес алу"),
  callUs: ls("Qo'ng'iroq qilish", "Позвонить нам", "Call us", "Қоңырау шалу"),
};

const SERVICES: { icon: LucideIcon; title: LS; items: LS[] }[] = [
  {
    icon: PenTool,
    title: ls("Loyihalash va konsultatsiya", "Проектирование и консультации", "Design & consulting", "Жобалау және кеңес"),
    items: [
      ls("Texnik hisoblar", "Технические расчеты", "Technical calculations", "Техникалық есептер"),
      ls("3D-modellashtirish", "3D-моделирование", "3D modeling", "3D модельдеу"),
      ls("Yechimlarni optimallashtirish", "Оптимизация решений", "Solution optimization", "Шешімдерді оңтайландыру"),
    ],
  },
  {
    icon: Wrench,
    title: ls("Montaj va ishga tushirish", "Монтаж и пусконаладка", "Installation & commissioning", "Монтаж және іске қосу"),
    items: [
      ls("Montaj ishlari", "Монтажные работы", "Installation works", "Монтаж жұмыстары"),
      ls("Pusko-sozlash ishlari", "Пусконаладочные работы", "Commissioning", "Іске қосу жұмыстары"),
      ls("Xodimlarni o'qitish", "Обучение персонала", "Staff training", "Қызметкерлерді оқыту"),
    ],
  },
  {
    icon: Settings,
    title: ls("Texnik xizmat ko'rsatish", "Техническое обслуживание", "Maintenance", "Техникалық қызмет"),
    items: [
      ls("Rejali TX", "Плановое ТО", "Scheduled service", "Жоспарлы қызмет"),
      ls("Filtrlarni tozalash va almashtirish", "Чистка и замена фильтров", "Filter cleaning & replacement", "Сүзгілерді тазалау"),
      ls("Tugun va birikmalarni tekshirish", "Проверка узлов и соединений", "Component inspection", "Тораптарды тексеру"),
    ],
  },
  {
    icon: Hammer,
    title: ls("Ta'mirlash va tiklash", "Ремонт и восстановление", "Repair & restoration", "Жөндеу және қалпына келтіру"),
    items: [
      ls("Nosozliklarni bartaraf etish", "Устранение неисправностей", "Fault elimination", "Ақауларды жою"),
      ls("Tugun va modullarni ta'mirlash", "Ремонт узлов и модулей", "Module repair", "Модульдерді жөндеу"),
      ls("Eskirgandan keyin tiklash", "Восстановление после износа", "Wear restoration", "Тозудан кейін қалпына келтіру"),
    ],
  },
  {
    icon: Package,
    title: ls("Zaxira qismlar va materiallar", "Запчасти и расходные материалы", "Spare parts & consumables", "Қосалқы бөлшектер"),
    items: [
      ls("Original zaxira qismlar", "Оригинальные запчасти", "Original spare parts", "Түпнұсқа бөлшектер"),
      ls("Filtrlovchi elementlar", "Фильтрующие элементы", "Filter elements", "Сүзгі элементтері"),
      ls("Mexanik tugunlar", "Механические узлы", "Mechanical units", "Механикалық тораптар"),
    ],
  },
  {
    icon: TrendingUp,
    title: ls("Modernizatsiya va optimallashtirish", "Модернизация и оптимизация", "Modernization & optimization", "Жаңарту және оңтайландыру"),
    items: [
      ls("Samaradorlikni oshirish", "Повышение эффективности", "Efficiency improvement", "Тиімділікті арттыру"),
      ls("Avtomatlashtirish", "Автоматизация", "Automation", "Автоматтандыру"),
      ls("Energiya tejamkor yechimlar", "Энергоэффективные решения", "Energy-efficient solutions", "Энергия үнемдеу"),
    ],
  },
];

const ADVANTAGES: { icon: LucideIcon; label: LS }[] = [
  { icon: Award, label: ls("10 yildan ortiq tajriba", "Опыт и экспертиза более 10 лет", "10+ years expertise", "10 жылдан астам тәжірибе") },
  { icon: Clock, label: ls("Obyektga operativ chiqish", "Оперативный выезд на объект", "Fast site visits", "Жедел шығу") },
  { icon: FileText, label: ls("Muddat va kafolatga rioya", "Соблюдение сроков и гарантий", "On-time & guaranteed", "Мерзім мен кепілдік") },
  { icon: ShieldCheck, label: ls("Shaffof narx va shartnoma", "Прозрачные цены и договоры", "Transparent pricing", "Айқын баға") },
  { icon: Headphones, label: ls("Barcha bosqichlarda qo'llab-quvvatlash", "Поддержка на всех этапах", "Support at every stage", "Барлық кезеңде қолдау") },
];

const STEPS: { icon: LucideIcon; label: LS; sub: LS }[] = [
  { icon: ClipboardList, label: ls("Zayavka", "Заявка", "Request", "Өтінім"), sub: ls("Saytda yoki telefon orqali", "На сайте или по телефону", "Online or by phone", "Сайтта немесе телефонмен") },
  { icon: PhoneCall, label: ls("Konsultatsiya", "Консультация", "Consultation", "Кеңес"), sub: ls("Vazifa va shartlarni aniqlash", "Уточнение задачи и условий", "Clarify task and terms", "Тапсырманы нақтылау") },
  { icon: FileText, label: ls("Taklif", "Предложение", "Proposal", "Ұсыныс"), sub: ls("Tijoriy taklif tayyorlash", "Подготовка коммерческого предложения", "Commercial proposal", "Коммерциялық ұсыныс") },
  { icon: Settings, label: ls("Amalga oshirish", "Реализация", "Execution", "Іске асыру"), sub: ls("Ish va yetkazib berishni bajarish", "Выполнение работ и поставка", "Works and supply", "Жұмыс пен жеткізу") },
  { icon: Headphones, label: ls("Qo'llab-quvvatlash", "Поддержка", "Support", "Қолдау"), sub: ls("Servis va kuzatib borish", "Сервис и сопровождение", "Service and follow-up", "Сервис және сүйемелдеу") },
];

export function ServicesClient({ locale }: { locale: Locale }) {
  const { data: home } = useGetHomeContentQuery();
  const ed = useEditorDict();
  const p = home?.pages?.services;
  const title = t(p?.title, locale) || tr(T.title, locale);
  const subtitle = t(p?.subtitle, locale) || tr(T.subtitle, locale);
  const image = p?.image || decorImg(410, 1600, 500);

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
            <Editable
              id="page-services"
              label={ed.editPageLabel}
              block={() => ({
                title: ed.marketingTitle,
                description: ed.marketingDesc,
                wide: true,
                render: (close) => (
                  <MarketingPagesBlockEditor close={close} initialTab="services" />
                ),
              })}
            >
              <section className="rounded-xl bg-white border border-[var(--color-border)] p-6 lg:p-8">
                <PageHeroImage image={image} />
                <h1 className="text-2xl lg:text-[34px] font-extrabold tracking-tight text-[var(--color-brand-strong)] uppercase">
                  {title}
                </h1>
                <p className="mt-3 text-[14px] text-slate-600 leading-relaxed max-w-3xl">{subtitle}</p>
              </section>
            </Editable>

            {/* Services */}
            <section className="rounded-xl bg-white border border-[var(--color-border)] p-5 lg:p-6">
              <SectionTitle>{tr(T.servicesTitle, locale)}</SectionTitle>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SERVICES.map((svc, i) => (
                  <div key={i} className="rounded-lg border border-[var(--color-border)] overflow-hidden hover:border-[var(--color-brand)]/40 hover:shadow-sm transition-all">
                    <div className="relative h-28 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
                      <Image
                        src={decorImg(140 + i, 800, 320)}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-white/85 backdrop-blur-sm shadow-sm">
                        <svc.icon className="h-6 w-6 text-[var(--color-brand)]" />
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[12px] font-bold text-[var(--color-brand)]">{i + 1}.</span>
                        <h3 className="text-[13.5px] font-bold text-slate-900">{tr(svc.title, locale)}</h3>
                      </div>
                      <ul className="space-y-1.5">
                        {svc.items.map((it, j) => (
                          <li key={j} className="flex items-start gap-2 text-[12px] text-slate-600">
                            <span className="mt-1 h-1 w-1 rounded-full bg-[var(--color-brand)] flex-shrink-0" />
                            {tr(it, locale)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Advantages */}
            <section className="rounded-xl bg-white border border-[var(--color-border)] p-5 lg:p-6">
              <SectionTitle>{tr(T.advantagesTitle, locale)}</SectionTitle>
              <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {ADVANTAGES.map((a, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-2">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
                      <a.icon className="h-5 w-5" />
                    </span>
                    <span className="text-[12px] text-slate-600 leading-tight">{tr(a.label, locale)}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* How we work */}
            <section className="rounded-xl bg-white border border-[var(--color-border)] p-5 lg:p-6">
              <SectionTitle>{tr(T.howTitle, locale)}</SectionTitle>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-5 gap-3">
                {STEPS.map((step, i) => (
                  <div key={i} className="rounded-lg bg-[var(--color-surface)] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[var(--color-brand)]">
                        <step.icon className="h-4 w-4" />
                      </span>
                      <span className="text-[16px] font-extrabold text-slate-200">{i + 1}</span>
                    </div>
                    <p className="text-[12.5px] font-bold text-slate-800">{tr(step.label, locale)}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 leading-snug">{tr(step.sub, locale)}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Support + Contract */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <section className="rounded-xl bg-[var(--color-ink)] text-white p-6 flex flex-col justify-between">
                <div>
                  <SectionTitleLight>{tr(T.supportTitle, locale)}</SectionTitleLight>
                  <p className="mt-3 text-[13.5px] text-white/75 leading-relaxed">{tr(T.supportBody, locale)}</p>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <Headphones className="h-9 w-9 text-[var(--color-highlight)]" />
                  <span className="text-3xl font-extrabold">24/7</span>
                </div>
              </section>

              <section className="rounded-xl bg-white border border-[var(--color-border)] p-6">
                <SectionTitle>{tr(T.contractTitle, locale)}</SectionTitle>
                <ul className="mt-4 space-y-2.5">
                  {T.contractItems.map((item, i) => (
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
                <Headphones className="h-6 w-6 text-[var(--color-brand)]" />
                <p className="text-[14px] font-semibold text-[var(--color-brand-strong)]">{tr(T.ctaText, locale)}</p>
              </div>
              <div className="flex gap-3">
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
      </div>
    </main>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[13px] font-bold tracking-[0.06em] text-[var(--color-brand-strong)]">{children}</h2>;
}
function SectionTitleLight({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[13px] font-bold tracking-[0.06em] text-white">{children}</h2>;
}
