"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Wind,
  Shield,
} from "lucide-react";
import type { Locale } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";
import { useGetBannersQuery } from "@/store/api/bannerApi";
import { getImageUrl } from "@/shared/lib/utils";
import { Button } from "@/shared/ui";

/* ─── Static fallback images ──────────────────────────────────────── */
const STATIC_SLIDES = [
  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1600&q=80",
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1600&q=80",
  "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1600&q=80",
];

interface HeroProps {
  locale: Locale;
  dict: Dictionary;
}

const AUTOPLAY_MS = 6000;

export function Hero({ locale, dict }: HeroProps) {
  const { data: banners, isLoading } = useGetBannersQuery();
  const activeBanners = banners?.filter((b) => b.isActive) ?? [];
  const hasBanners = activeBanners.length > 0;

  if (isLoading) return <HeroSkeleton />;

  // Build image list: from banners or fallback statics
  const images = hasBanners
    ? activeBanners.map((b) => getImageUrl(b.image))
    : STATIC_SLIDES;

  return <HeroCarousel images={images} locale={locale} dict={dict} />;
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Unified Hero Carousel                                             */
/* ═══════════════════════════════════════════════════════════════════ */

function HeroCarousel({
  images,
  locale,
  dict,
}: {
  images: string[];
  locale: Locale;
  dict: Dictionary;
}) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = images.length;
  const progress = useMotionValue(0);
  const progressWidth = useTransform(progress, [0, 1], ["0%", "100%"]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (idx: number) => {
      progress.set(0);
      setCurrent(idx);
    },
    [progress],
  );

  const next = useCallback(
    () => go((current + 1) % count),
    [go, current, count],
  );
  const prev = useCallback(
    () => go((current - 1 + count) % count),
    [go, current, count],
  );

  useEffect(() => {
    if (count <= 1 || paused) return;
    const start = Date.now();
    frameRef.current = setInterval(() => {
      progress.set(Math.min((Date.now() - start) / AUTOPLAY_MS, 1));
    }, 30);
    timerRef.current = setTimeout(() => {
      if (frameRef.current) clearInterval(frameRef.current);
      next();
    }, AUTOPLAY_MS);
    return () => {
      if (frameRef.current) clearInterval(frameRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, paused, count, next, progress]);

  return (
    <section
      className="relative w-full h-screen overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Background images ── */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={images[current]}
            alt="FilterSystem"
            fill
            priority={current === 0}
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

      {/* ── Content ── */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Left — text */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-1.5 mb-6"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-semibold text-white/90 tracking-wide uppercase">
                  FilterSystem Factory
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-white leading-[1.1] tracking-tight drop-shadow-lg"
              >
                {dict.hero.title}
                <span className="block mt-1 drop-shadow-none">
                  {dict.hero.subtitle}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.22 }}
                className="mt-5 text-[15px] sm:text-base text-white/70 max-w-md leading-relaxed"
              >
                {dict.hero.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.32 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Link href={`/${locale}/products`}>
                  <Button size="lg" icon={<ArrowRight className="h-4 w-4" />}>
                    {dict.hero.shopNow}
                  </Button>
                </Link>
                <Link href={`/${locale}/categories`}>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-white border border-white/25 hover:bg-white/15 hover:text-white backdrop-blur-sm"
                  >
                    {dict.hero.viewCatalog}
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom navigation ── */}
      {count > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="h-[3px] bg-white/10">
            <motion.div
              className="h-full bg-white/70"
              style={{ width: progressWidth }}
            />
          </div>

          <div className="bg-black/30 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-12">
                <div className="flex items-center gap-2.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => go(i)}
                      aria-label={`Slide ${i + 1}`}
                      className="relative h-2 rounded-full transition-all duration-500 overflow-hidden"
                      style={{ width: i === current ? 28 : 8 }}
                    >
                      <span className="absolute inset-0 rounded-full bg-white/30" />
                      {i === current && (
                        <motion.span
                          layoutId="active-dot"
                          className="absolute inset-0 rounded-full bg-white"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={prev}
                    aria-label="Previous"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:text-white hover:bg-white/15"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:text-white hover:bg-white/15"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Skeleton                                                          */
/* ═══════════════════════════════════════════════════════════════════ */

function HeroSkeleton() {
  return (
    <section className="relative w-full h-screen bg-slate-100 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-200/60 via-transparent to-transparent" />
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <div className="h-5 w-40 rounded-full bg-slate-200" />
            <div className="h-11 w-[440px] max-w-full rounded-lg bg-slate-200" />
            <div className="h-11 w-[340px] max-w-full rounded-lg bg-slate-200/70" />
            <div className="h-5 w-[380px] max-w-full rounded-lg bg-slate-200/50 mt-2" />
            <div className="flex gap-3 mt-4">
              <div className="h-11 w-36 rounded-lg bg-slate-200/60" />
              <div className="h-11 w-36 rounded-lg bg-slate-200/40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
