"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/shared/types";
import {
  useGetHomeContentQuery,
  type CTABanner,
} from "@/store/api/homeContentApi";
import { t } from "@/shared/lib/utils";
import { Editable, useEditorDict } from "@/features/inline-editor";
import { HomeContentBlockEditor } from "@/features/inline-editor/blocks/HomeContentBlockEditor";

export function CTASection({ locale }: { locale: Locale }) {
  const { data: home } = useGetHomeContentQuery();
  const ed = useEditorDict();
  const ctaBanners = home?.ctaBanners;
  const left = ctaBanners?.left;
  const right = ctaBanners?.right;

  return (
    <Editable
      id="cta-banners"
      label={ed.homeCtaLabel}
      block={{
        title: ed.ctaTitle,
        wide: true,
        render: (close) => (
          <HomeContentBlockEditor close={close} initialTab="cta" />
        ),
      }}
    >
      <section className="py-12 lg:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
            {left && (
              <BannerCard banner={left} locale={locale} delay={0} idx="left" />
            )}
            {right && (
              <BannerCard
                banner={right}
                locale={locale}
                delay={0.05}
                idx="right"
              />
            )}
          </div>
        </div>
      </section>
    </Editable>
  );
}

function BannerCard({
  banner,
  locale,
  delay,
  idx,
}: {
  banner: CTABanner;
  locale: Locale;
  delay: number;
  idx: "left" | "right";
}) {
  const isBlueInk = banner.variant === "blue-ink";
  const title = t(banner.title, locale);
  const subtitle = t(banner.subtitle, locale);
  const ctaLabel = t(banner.ctaLabel, locale);
  const points = (banner.points ?? [])
    .map((p) => t(p, locale))
    .filter(Boolean);
  const href = `/${locale}${banner.ctaHref || "/products"}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={`relative overflow-hidden rounded-2xl min-h-[260px] p-6 lg:p-8 text-white ${
        isBlueInk ? "bg-diagonal-blue-ink" : "bg-[var(--color-ink)]"
      }`}
    >
      <div className="relative z-10 max-w-[60%]">
        <h3 className="text-lg lg:text-xl font-extrabold leading-tight">
          {title}
          {subtitle && (
            <>
              <br />
              <span className="font-semibold text-white/90">{subtitle}</span>
            </>
          )}
        </h3>
        {points.length > 0 && (
          <ul className="mt-4 space-y-1.5">
            {points.map((p, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-[12.5px] text-white/85"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full mt-2 flex-shrink-0 ${
                    isBlueInk
                      ? "bg-[var(--color-highlight)]"
                      : "bg-[var(--color-brand)]"
                  }`}
                />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        )}
        <Link
          href={href}
          className={`mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-colors ${
            isBlueInk
              ? "bg-[var(--color-highlight)] hover:bg-[var(--color-highlight-hover)] text-[var(--color-ink)]"
              : "bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white"
          }`}
        >
          {ctaLabel || "Catalog"}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="absolute right-2 bottom-0 top-0 w-[40%] flex items-end justify-center pb-4 pointer-events-none">
        {idx === "left" ? <BagFilters /> : <PanelFilters />}
      </div>
    </motion.div>
  );
}

function BagFilters() {
  return (
    <svg
      viewBox="0 0 200 220"
      className="w-full h-auto max-h-[230px]"
      fill="none"
    >
      <defs>
        <linearGradient id="bag1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect
            x={20 + i * 55}
            y={30 + i * 8}
            width="40"
            height={170 - i * 12}
            rx="3"
            fill="url(#bag1)"
          />
          <ellipse
            cx={40 + i * 55}
            cy={30 + i * 8}
            rx="20"
            ry="4"
            fill="#e2e8f0"
          />
          <ellipse
            cx={40 + i * 55}
            cy={200 - i * 4}
            rx="20"
            ry="4"
            fill="#94a3b8"
          />
        </g>
      ))}
    </svg>
  );
}

function PanelFilters() {
  return (
    <svg
      viewBox="0 0 220 200"
      className="w-full h-auto max-h-[200px]"
      fill="none"
    >
      <rect x="20" y="40" width="180" height="120" rx="6" fill="#f8fafc" />
      {Array.from({ length: 18 }).map((_, i) => (
        <rect
          key={i}
          x={22 + i * 10}
          y="44"
          width="3"
          height="112"
          fill="#94a3b8"
          opacity="0.5"
        />
      ))}
      <rect
        x="20"
        y="40"
        width="180"
        height="120"
        rx="6"
        stroke="#475569"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}
