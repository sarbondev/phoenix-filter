"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Building2,
  Users,
  Award,
  Globe,
  Target,
  Eye,
  HeartHandshake,
  CheckCircle2,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/shared/types";
import { decorImg } from "@/shared/lib/decor";
import { t, getImageUrl } from "@/shared/lib/utils";
import { useGetHomeContentQuery } from "@/store/api/homeContentApi";
import { Editable, useEditorDict } from "@/features/inline-editor";
import { MarketingPagesBlockEditor } from "@/features/inline-editor/blocks/MarketingPagesBlockEditor";

const BLUE = "#1d4ed8";
type LS = Record<Locale, string>;
const tr = (s: LS, l: Locale) => s[l] ?? s.en;
const ls = (uz: string, ru: string, en: string, kz: string): LS => ({ uz, ru, en, kz });

const T = {
  breadHome: ls("Bosh", "Главная", "Home", "Басты"),
  title: ls("Kompaniya haqida", "О компании", "About the company", "Компания туралы"),
  subtitle: ls(
    "PHOENIX PRIME ENGINEERING — sanoat filtratsiyasi va gaz tozalash tizimlarini loyihalash, ishlab chiqarish va ta'minlash bo'yicha injiniring kompaniyasi.",
    "PHOENIX PRIME ENGINEERING — инжиниринговая компания по проектированию, производству и поставке систем промышленной фильтрации и газоочистки.",
    "PHOENIX PRIME ENGINEERING is an engineering company designing, manufacturing and supplying industrial filtration and gas-cleaning systems.",
    "PHOENIX PRIME ENGINEERING — өнеркәсіптік сүзу жүйелерін жобалайтын инжиниринг компаниясы.",
  ),
  intro: ls(
    "Biz 10 yildan ortiq vaqt davomida turli sanoat tarmoqlari korxonalariga toza havo va ekologik me'yorlarga muvofiqlikni ta'minlaymiz. O'z muhandislik bo'limimiz har bir loyihaga individual yondashadi.",
    "Уже более 10 лет мы обеспечиваем предприятиям различных отраслей чистый воздух и соответствие экологическим нормам. Собственный инженерный отдел подходит индивидуально к каждому проекту.",
    "For over 10 years we have provided enterprises with clean air and environmental compliance. Our in-house engineering team approaches each project individually.",
    "10 жылдан астам уақыт бойы кәсіпорындарға таза ауа қамтамасыз етеміз.",
  ),
  statsTitle: ls("RAQAMLARDA", "В ЦИФРАХ", "BY THE NUMBERS", "САНДАРМЕН"),
  valuesTitle: ls("MISSIYA VA QADRIYATLAR", "МИССИЯ И ЦЕННОСТИ", "MISSION & VALUES", "МИССИЯ ЖӘНЕ ҚҰНДЫЛЫҚТАР"),
  whyTitle: ls("NEGA BIZNI TANLASHADI", "ПОЧЕМУ ВЫБИРАЮТ НАС", "WHY THEY CHOOSE US", "НЕГЕ БІЗДІ ТАҢДАЙДЫ"),
  ctaText: ls("Loyihangizni muhokama qilamizmi?", "Обсудим ваш проект?", "Shall we discuss your project?", "Жобаңызды талқылайық па?"),
  consult: ls("Bog'lanish", "Связаться", "Contact us", "Байланысу"),
};

const STATS: { icon: LucideIcon; value: string; label: LS }[] = [
  { icon: Building2, value: "250+", label: ls("Loyiha", "Проектов", "Projects", "Жоба") },
  { icon: Users, value: "100+", label: ls("Mijoz", "Клиентов", "Clients", "Клиент") },
  { icon: Award, value: "10+", label: ls("Yil tajriba", "Лет опыта", "Years", "Жыл") },
  { icon: Globe, value: "6", label: ls("Davlat", "Стран", "Countries", "Ел") },
];

const VALUES: { icon: LucideIcon; title: LS; body: LS }[] = [
  {
    icon: Target,
    title: ls("Missiya", "Миссия", "Mission", "Миссия"),
    body: ls("Sanoatga toza havo va barqaror ishlab chiqarishni ta'minlash.", "Обеспечивать промышленность чистым воздухом и устойчивым производством.", "Provide industry with clean air and sustainable production.", "Өнеркәсіпке таза ауа қамтамасыз ету."),
  },
  {
    icon: Eye,
    title: ls("Vizyon", "Видение", "Vision", "Көзқарас"),
    body: ls("Mintaqada filtratsiya yechimlari bo'yicha yetakchi bo'lish.", "Быть лидером в решениях фильтрации в регионе.", "To be the regional leader in filtration solutions.", "Аймақтағы көшбасшы болу."),
  },
  {
    icon: HeartHandshake,
    title: ls("Qadriyatlar", "Ценности", "Values", "Құндылықтар"),
    body: ls("Sifat, ishonchlilik va mijozga individual yondashuv.", "Качество, надежность и индивидуальный подход к клиенту.", "Quality, reliability and an individual client approach.", "Сапа, сенімділік және жеке тәсіл."),
  },
];

const WHY: LS[] = [
  ls("O'z muhandislik bo'limi va ishlab chiqarish", "Собственный инженерный отдел и производство", "In-house engineering and production", "Жеке инженерлік бөлім"),
  ls("Tekshirilgan ishlab chiqaruvchilar bilan ishlash", "Работа с проверенными производителями", "Verified manufacturers", "Тексерілген өндірушілер"),
  ls("To'liq tsikl: loyiha → yetkazib berish → servis", "Полный цикл: проект → поставка → сервис", "Full cycle: design → supply → service", "Толық цикл"),
  ls("Ekologik me'yorlar va standartlarga muvofiqlik", "Соответствие экологическим нормам и стандартам", "Compliance with standards", "Стандарттарға сәйкестік"),
];

export function AboutClient({ locale }: { locale: Locale }) {
  const { data: home } = useGetHomeContentQuery();
  const ed = useEditorDict();
  const p = home?.pages?.about;

  const title = t(p?.title, locale) || tr(T.title, locale);
  const subtitle = t(p?.subtitle, locale) || tr(T.subtitle, locale);
  const intro = t(p?.intro, locale) || tr(T.intro, locale);
  const image = p?.image || decorImg(101, 1920, 700);
  const stats =
    p?.stats && p.stats.length
      ? p.stats.map((s, i) => ({
          value: s.value,
          label: t(s.label, locale),
          icon: STATS[i]?.icon ?? Building2,
        }))
      : STATS.map((s) => ({
          value: s.value,
          label: tr(s.label, locale),
          icon: s.icon,
        }));

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

      {/* Hero */}
      <Editable
        id="page-about"
        label={ed.editPageLabel}
        block={() => ({
          title: ed.marketingTitle,
          description: ed.marketingDesc,
          wide: true,
          render: (close) => (
            <MarketingPagesBlockEditor close={close} initialTab="about" />
          ),
        })}
      >
        <section className="relative overflow-hidden bg-[var(--color-ink)] text-white">
          <Image
            src={getImageUrl(image)}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-diagonal-blue-ink opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
          <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
            <h1 className="text-3xl lg:text-[44px] font-extrabold tracking-tight uppercase">{title}</h1>
            <p className="mt-4 max-w-3xl text-[15px] text-white/80 leading-relaxed">{subtitle}</p>
          </div>
        </section>
      </Editable>

      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 py-10 lg:py-12 space-y-6">
        {/* Intro + stats */}
        <section className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
          <div className="rounded-xl bg-white border border-[var(--color-border)] p-6 lg:p-8">
            <p className="text-[15px] text-slate-600 leading-relaxed">{intro}</p>
            <div className="relative mt-6 aspect-[16/7] overflow-hidden rounded-lg bg-[var(--color-surface)]">
              <Image
                src={decorImg(102, 1200, 525)}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="rounded-xl bg-white border border-[var(--color-border)] p-6">
            <h2 className="text-[13px] font-bold tracking-[0.06em] text-[var(--color-brand-strong)]">{tr(T.statsTitle, locale)}</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {stats.map((s, i) => (
                <div key={i} className="rounded-lg bg-[var(--color-surface)] p-4 text-center">
                  <s.icon className="h-6 w-6 mx-auto text-[var(--color-brand)]" />
                  <p className="mt-2 text-xl font-extrabold text-[var(--color-brand-strong)] leading-none">{s.value}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="rounded-xl bg-white border border-[var(--color-border)] p-6 lg:p-8">
          <h2 className="text-[13px] font-bold tracking-[0.06em] text-[var(--color-brand-strong)]">{tr(T.valuesTitle, locale)}</h2>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            {VALUES.map((v, i) => (
              <div key={i} className="rounded-lg border border-[var(--color-border)] p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand)] mb-3">
                  <v.icon className="h-5 w-5" />
                </span>
                <h3 className="text-[15px] font-bold text-slate-900">{tr(v.title, locale)}</h3>
                <p className="mt-1.5 text-[13px] text-slate-600 leading-relaxed">{tr(v.body, locale)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why us */}
        <section className="rounded-xl bg-white border border-[var(--color-border)] p-6 lg:p-8">
          <h2 className="text-[13px] font-bold tracking-[0.06em] text-[var(--color-brand-strong)]">{tr(T.whyTitle, locale)}</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {WHY.map((w, i) => (
              <div key={i} className="flex items-start gap-2.5 text-[14px] text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-[var(--color-brand)] flex-shrink-0 mt-0.5" />
                {tr(w, locale)}
              </div>
            ))}
          </div>
        </section>

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
    </main>
  );
}
