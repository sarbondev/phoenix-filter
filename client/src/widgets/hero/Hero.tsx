"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Compass } from "lucide-react";
import type { Locale, Direction } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";
import { t, getImageUrl } from "@/shared/lib/utils";
import { useGetDirectionsQuery } from "@/store/api/directionApi";
import { Skeleton } from "@/shared/ui";

interface HeroProps {
  locale: Locale;
  dict: Dictionary;
}

const AUTOPLAY_MS = 5000;

export function Hero({ locale, dict }: HeroProps) {
  const { data: directions, isLoading } = useGetDirectionsQuery();

  const slides = useMemo(
    () =>
      (directions ?? [])
        .filter((d) => d.isActive)
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [directions],
  );

  if (isLoading) {
    return (
      <section className="bg-white pt-6 pb-10 lg:pb-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="rounded-2xl h-[420px] lg:h-[560px] w-full" />
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return <EmptyHero locale={locale} dict={dict} />;
  }

  return (
    <section className="bg-white pt-6 pb-10 lg:pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HeroCarousel slides={slides} locale={locale} dict={dict} />
      </div>
    </section>
  );
}

function HeroCarousel({
  slides,
  locale,
  dict,
}: {
  slides: Direction[];
  locale: Locale;
  dict: Dictionary;
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (next: number) => {
      const safe = ((next % slides.length) + slides.length) % slides.length;
      setDirection(next > index ? 1 : -1);
      setIndex(safe);
    },
    [index, slides.length],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Auto-rotate
  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = setTimeout(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [index, paused, slides.length]);

  // Keyboard arrows when focused
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const current = slides[index];

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={dict.directions.title}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative overflow-hidden rounded-2xl bg-[var(--color-ink)] min-h-[420px] lg:min-h-[560px] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:ring-offset-2"
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current.id}
          custom={direction}
          initial={{ opacity: 0, x: direction === 1 ? 60 : -60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction === 1 ? -60 : 60 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Slide slide={current} locale={locale} dict={dict} />
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 && (
        <>
          {/* Arrows */}
          <button
            type="button"
            onClick={prev}
            aria-label={dict.common.previous}
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur text-white hover:bg-white/25 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label={dict.common.next}
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur text-white hover:bg-white/25 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`${dict.directions.title} ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all ${
                  i === index
                    ? "w-7 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Slide({
  slide,
  locale,
  dict,
}: {
  slide: Direction;
  locale: Locale;
  dict: Dictionary;
}) {
  const name = t(slide.name, locale);
  const description = t(slide.description, locale);

  return (
    <div className="relative w-full h-full min-h-[420px] lg:min-h-[560px] overflow-hidden">
      {/* Background image */}
      {slide.image ? (
        <Image
          src={getImageUrl(slide.image)}
          alt={name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-diagonal-blue-ink" />
      )}

      {/* Gradient overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/25" />

      {/* Content */}
      <div className="relative z-10 h-full min-h-[420px] lg:min-h-[560px] flex items-center">
        <div className="w-full px-7 lg:px-12 py-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/90 mb-4">
              <Compass className="h-3.5 w-3.5" />
              {dict.directions.title}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold leading-[1.1] tracking-tight text-white">
              {name}
            </h1>
            {description && (
              <p className="mt-4 text-[15px] sm:text-[16px] text-white/85 leading-relaxed max-w-xl">
                {description}
              </p>
            )}
            <Link
              href={`/${locale}/directions/${slide.slug}`}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[var(--color-highlight)] hover:bg-[var(--color-highlight-hover)] px-5 py-3 text-[14px] font-semibold text-[var(--color-ink)] transition-colors"
            >
              {dict.common.viewDetails}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function EmptyHero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="bg-white pt-6 pb-10 lg:pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-diagonal-blue-ink min-h-[420px] lg:min-h-[560px] p-7 lg:p-12 text-white flex items-center">
          <div className="max-w-xl">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold leading-[1.1] tracking-tight">
              {dict.hero.title}
            </h1>
            <p className="mt-4 text-[15px] text-white/85 leading-relaxed">
              {dict.directions.subtitle}
            </p>
            <Link
              href={`/${locale}/products`}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[var(--color-highlight)] hover:bg-[var(--color-highlight-hover)] px-5 py-3 text-[14px] font-semibold text-[var(--color-ink)] transition-colors"
            >
              {dict.hero.viewCatalog}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
