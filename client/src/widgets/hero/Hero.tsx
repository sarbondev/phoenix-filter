"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { Locale } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";
import { t, getImageUrl } from "@/shared/lib/utils";
import {
  useGetHeroContentQuery,
  type HeroContent,
  type HeroSmallCard,
} from "@/store/api/heroContentApi";
import { Editable, useEditorDict } from "@/features/inline-editor";
import { HeroBlockEditor } from "@/features/inline-editor/blocks/HeroBlockEditor";

interface HeroProps {
  locale: Locale;
  dict: Dictionary;
}

const FALLBACK: HeroContent = {
  mainCard: {
    title: {
      uz: "Avtomobil filtrlari uchun",
      ru: "Фильтры для автомобилей",
      en: "Filters for any vehicle",
      kz: "Көлік сүзгілері үшін",
    },
    subtitle: {
      uz: "yagona manzil",
      ru: "в одном месте",
      en: "all in one place",
      kz: "бір жерде",
    },
    features: [
      {
        uz: "3000+ filter — yengil avtomobil va og'ir texnika uchun",
        ru: "3000+ фильтров — для легковых и грузовых авто",
        en: "3000+ filters for cars, trucks and machinery",
        kz: "3000+ сүзгі — жеңіл және ауыр техника үшін",
      },
      {
        uz: "MANN, FRAM, WIX, MAHLE va boshqa brendlar bo'yicha kross-katalog",
        ru: "Кросс-каталог по MANN, FRAM, WIX, MAHLE и другим брендам",
        en: "Cross-reference catalog with MANN, FRAM, WIX, MAHLE & more",
        kz: "MANN, FRAM, WIX, MAHLE және басқа брендтер бойынша кросс-каталог",
      },
      {
        uz: "OEM raqami orqali bir zumda topish",
        ru: "Поиск по OEM-номеру за секунды",
        en: "Find by OEM number in seconds",
        kz: "OEM нөмірі бойынша секундта табу",
      },
      {
        uz: "Toshkent bo'ylab tezkor yetkazib berish",
        ru: "Быстрая доставка по Ташкенту",
        en: "Fast delivery across Tashkent",
        kz: "Ташкент бойынша жедел жеткізу",
      },
    ],
    ctaLabel: {
      uz: "Katalogni ko'rish",
      ru: "Открыть каталог",
      en: "Browse catalog",
      kz: "Каталогты ашу",
    },
    ctaHref: "/yonalish",
    image: "",
  },
  smallCard1: {
    title: {
      uz: "Avto filterlar",
      ru: "Авто фильтры",
      en: "Auto filters",
      kz: "Авто сүзгілер",
    },
    subtitle: {
      uz: "Avtomobil va og'ir texnika",
      ru: "Авто и спецтехника",
      en: "Vehicles & heavy equipment",
      kz: "Көлік пен ауыр техника",
    },
    description: {
      uz: "3000+ filter — yengil avtomobil, yuk va qishloq xo‘jalik texnikasi uchun",
      ru: "3000+ фильтров — для легковых, грузовых и сельхозмашин",
      en: "3000+ filters for cars, trucks and agricultural machinery",
      kz: "3000+ сүзгі — жеңіл, жүк және ауыл шаруашылық техникасы үшін",
    },
    ctaLabel: {
      uz: "Ko'rish",
      ru: "Смотреть",
      en: "Browse",
      kz: "Қарау",
    },
    ctaHref: "/products?categorySlug=avto",
    image: "",
    variant: "blue",
  },
  smallCard2: {
    title: {
      uz: "Maishiy filterlar",
      ru: "Бытовые фильтры",
      en: "Household filters",
      kz: "Тұрмыстық сүзгілер",
    },
    subtitle: {
      uz: "Uy va maishiy ehtiyojlar",
      ru: "Для дома и быта",
      en: "Home & household",
      kz: "Үй және тұрмыс",
    },
    description: {
      uz: "Tez kunda — uy uchun suv va havo filtrlari",
      ru: "Скоро — фильтры воды и воздуха для дома",
      en: "Coming soon — home water and air filters",
      kz: "Жақында — үйге арналған су және ауа сүзгілері",
    },
    ctaLabel: {
      uz: "Tez kunda",
      ru: "Скоро",
      en: "Coming soon",
      kz: "Жақында",
    },
    ctaHref: "/products?categorySlug=maishiy",
    image: "",
    variant: "ink",
  },
};

export function Hero({ locale, dict }: HeroProps) {
  const { data } = useGetHeroContentQuery();
  const ed = useEditorDict();
  const hero = data ?? FALLBACK;

  return (
    <Editable
      id="hero"
      label={ed.heroEditLabel}
      block={{
        title: ed.heroTitle,
        description: ed.heroDesc,
        wide: false,
        render: (close) => <HeroBlockEditor close={close} />,
      }}
    >
      <HeroContent locale={locale} dict={dict} hero={hero} />
    </Editable>
  );
}

function HeroContent({
  locale,
  dict,
  hero,
}: {
  locale: Locale;
  dict: Dictionary;
  hero: HeroContent;
}) {
  // i18n fallbacks: prefer DB, fall back to dictionary
  const mainTitle =
    t(hero.mainCard.title, locale) || dict.hero.title;
  const mainSubtitle =
    t(hero.mainCard.subtitle, locale) || dict.hero.subtitle;
  const mainCtaLabel =
    t(hero.mainCard.ctaLabel, locale) || dict.hero.viewCatalog;
  const mainHref = `/${locale}${hero.mainCard.ctaHref || "/products"}`;
  const features = hero.mainCard.features
    .map((f) => t(f, locale))
    .filter(Boolean);

  return (
    <section className="bg-white pt-6 pb-10 lg:pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
          {/* Big card — left */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative lg:col-span-2 overflow-hidden rounded-2xl bg-diagonal-blue-ink min-h-[340px] lg:min-h-[400px] p-7 lg:p-10 text-white"
          >
            <div className="relative z-10 ml-auto max-w-full sm:max-w-[55%] sm:text-right">
              <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold leading-[1.1] tracking-tight">
                {mainTitle}
                <span className="block mt-1 text-white/95">{mainSubtitle}</span>
              </h1>

              {features.length > 0 && (
                <ul className="mt-6 space-y-2.5">
                  {features.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[13.5px] text-white/90 sm:flex-row-reverse sm:text-right"
                    >
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-[var(--color-highlight)] flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}

              <Link
                href={mainHref}
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[var(--color-highlight)] hover:bg-[var(--color-highlight-hover)] px-5 py-3 text-[14px] font-semibold text-[var(--color-ink)] transition-colors"
              >
                {mainCtaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Optional uploaded image, otherwise SVG collage — now on the LEFT */}
            {hero.mainCard.image ? (
              <div className="hidden sm:block absolute left-0 bottom-0 top-0 w-[55%] pointer-events-none">
                <Image
                  src={getImageUrl(hero.mainCard.image)}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 50vw, 700px"
                  className="object-contain object-left p-4"
                />
              </div>
            ) : (
              <div className="hidden sm:block absolute left-[-2%] bottom-0 top-0 w-[55%] pointer-events-none">
                <div className="absolute inset-0 flex items-end justify-center pb-6">
                  <FilterCollage />
                </div>
              </div>
            )}
          </motion.div>

          {/* Right column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-5">
            <SmallBanner
              card={hero.smallCard1}
              locale={locale}
              dict={dict}
              fallbackTitle="Avto filterlar"
              fallbackSubtitle="Avtomobil va texnika"
              fallbackDescription="Yengil va og'ir transport uchun"
            />
            <SmallBanner
              card={hero.smallCard2}
              locale={locale}
              dict={dict}
              fallbackTitle="Maishiy filterlar"
              fallbackSubtitle="Uy uchun"
              fallbackDescription="Tez kunda"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SmallBanner({
  card,
  locale,
  dict,
  fallbackTitle,
  fallbackSubtitle,
  fallbackDescription,
}: {
  card: HeroSmallCard;
  locale: Locale;
  dict: Dictionary;
  fallbackTitle: string;
  fallbackSubtitle: string;
  fallbackDescription: string;
}) {
  const title = t(card.title, locale) || fallbackTitle;
  const subtitle = t(card.subtitle, locale) || fallbackSubtitle;
  const description = t(card.description, locale) || fallbackDescription;
  const ctaLabel = t(card.ctaLabel, locale) || dict.hero.viewCatalog;
  const href = `/${locale}${card.ctaHref || "/products"}`;
  const isBlue = card.variant === "blue";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className={`relative overflow-hidden rounded-2xl p-5 min-h-[180px] lg:min-h-[190px] flex flex-col justify-between ${
        isBlue
          ? "bg-[var(--color-brand)] text-white"
          : "bg-[var(--color-ink)] text-white"
      }`}
    >
      <div className="relative z-10 ml-auto max-w-[60%] text-right">
        <h3 className="text-[15px] font-bold leading-tight">{title}</h3>
        <p className="text-[18px] font-extrabold mt-0.5">{subtitle}</p>
        <p className="mt-2 text-[12px] text-white/80 leading-snug">
          {description}
        </p>
      </div>

      <Link
        href={href}
        className={`relative z-10 inline-flex items-center justify-center w-fit ml-auto rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors ${
          isBlue
            ? "bg-white text-[var(--color-brand)] hover:bg-white/90"
            : "bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)]"
        }`}
      >
        {ctaLabel}
      </Link>

      {card.image ? (
        <div className="absolute left-0 top-0 bottom-0 w-[45%] pointer-events-none">
          <Image
            src={getImageUrl(card.image)}
            alt=""
            fill
            sizes="200px"
            className="object-contain object-left p-2"
          />
        </div>
      ) : (
        <div className="absolute left-0 top-0 bottom-0 w-[45%] pointer-events-none opacity-90">
          <div className="absolute inset-0 flex items-center justify-center">
            <SmallFilterShape />
          </div>
        </div>
      )}
    </motion.div>
  );
}

function FilterCollage() {
  return (
    <svg
      viewBox="0 0 280 220"
      className="w-full h-auto max-h-[300px]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cyl1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>
      <g>
        <rect x="40" y="60" width="60" height="140" rx="6" fill="url(#cyl1)" />
        {Array.from({ length: 12 }).map((_, i) => (
          <rect
            key={`l-${i}`}
            x={42 + i * 5}
            y="62"
            width="2"
            height="136"
            fill="#94a3b8"
            opacity="0.4"
          />
        ))}
        <ellipse cx="70" cy="60" rx="30" ry="6" fill="#e2e8f0" />
        <ellipse cx="70" cy="200" rx="30" ry="6" fill="#94a3b8" />
      </g>
      <g>
        <rect x="115" y="40" width="55" height="160" rx="6" fill="url(#cyl1)" />
        {Array.from({ length: 11 }).map((_, i) => (
          <rect
            key={`m-${i}`}
            x={117 + i * 5}
            y="42"
            width="2"
            height="156"
            fill="#94a3b8"
            opacity="0.4"
          />
        ))}
        <ellipse cx="142.5" cy="40" rx="27.5" ry="6" fill="#e2e8f0" />
        <ellipse cx="142.5" cy="200" rx="27.5" ry="6" fill="#94a3b8" />
      </g>
      <g>
        <rect x="185" y="80" width="50" height="120" rx="5" fill="url(#cyl1)" />
        {Array.from({ length: 10 }).map((_, i) => (
          <rect
            key={`s-${i}`}
            x={187 + i * 5}
            y="82"
            width="2"
            height="116"
            fill="#94a3b8"
            opacity="0.4"
          />
        ))}
        <ellipse cx="210" cy="80" rx="25" ry="5" fill="#e2e8f0" />
        <ellipse cx="210" cy="200" rx="25" ry="5" fill="#94a3b8" />
      </g>
    </svg>
  );
}

function SmallFilterShape() {
  return (
    <svg
      viewBox="0 0 120 140"
      className="w-full h-auto max-h-[150px]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="20" y="20" width="80" height="100" rx="6" fill="#f1f5f9" />
      {Array.from({ length: 14 }).map((_, i) => (
        <rect
          key={i}
          x={22 + i * 5.5}
          y="22"
          width="2"
          height="96"
          fill="#94a3b8"
          opacity="0.5"
        />
      ))}
      <ellipse cx="60" cy="20" rx="40" ry="6" fill="#e2e8f0" />
      <ellipse cx="60" cy="120" rx="40" ry="6" fill="#94a3b8" />
    </svg>
  );
}
