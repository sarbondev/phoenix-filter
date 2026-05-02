"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Locale } from "@/shared/types";
import { useGetHomeContentQuery } from "@/store/api/homeContentApi";
import { t, getImageUrl } from "@/shared/lib/utils";
import { Editable, useEditorDict } from "@/features/inline-editor";
import { HomeContentBlockEditor } from "@/features/inline-editor/blocks/HomeContentBlockEditor";
import { resolveIcon } from "@/features/inline-editor/iconResolver";
import { useGetSiteSettingsQuery } from "@/store/api/siteSettingsApi";

export function AboutSection({ locale }: { locale: Locale }) {
  const { data: home } = useGetHomeContentQuery();
  const { data: settings } = useGetSiteSettingsQuery();
  const ed = useEditorDict();

  const about = home?.about;
  const body = t(about?.body, locale);
  const features = about?.features ?? [];
  const image = about?.image;
  const brandName = settings?.brandName || "PRESTIGE";
  const brandAccent = settings?.brandAccent || "FILTER";

  return (
    <Editable
      id="about"
      label={ed.homeAboutLabel}
      block={{
        title: ed.aboutTitle,
        description: ed.aboutDesc,
        wide: true,
        render: (close) => (
          <HomeContentBlockEditor close={close} initialTab="about" />
        ),
      }}
    >
      <section className="py-12 lg:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left — text + features */}
            <div className="lg:col-span-7">
              {body && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="text-[15px] lg:text-[17px] leading-relaxed text-slate-700 max-w-2xl"
                >
                  {body}
                </motion.p>
              )}

              {features.length > 0 && (
                <div className="mt-8 grid sm:grid-cols-1 gap-3 max-w-2xl">
                  {features.map((f, i) => {
                    const Icon = resolveIcon(f.icon);
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: i * 0.06 }}
                        className="flex items-start gap-4 rounded-xl border border-[var(--color-border)] bg-white p-4 hover:shadow-sm transition-shadow"
                      >
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand)] flex-shrink-0">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-[14px] font-bold text-slate-900">
                            {t(f.title, locale)}
                          </h3>
                          <p className="text-[13px] text-slate-500 mt-0.5 leading-relaxed">
                            {t(f.desc, locale)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right — image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-5"
            >
              <div className="relative aspect-[4/5] lg:aspect-[5/6] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                {image ? (
                  <Image
                    src={getImageUrl(image)}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 600px"
                    className="object-cover"
                  />
                ) : (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=900&q=80')",
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/40 via-transparent to-transparent" />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 rounded-lg bg-white/95 backdrop-blur-sm shadow-xl">
                  <div className="flex items-center gap-1">
                    <span className="text-xl lg:text-2xl font-extrabold tracking-tight text-[var(--color-brand-strong)]">
                      {brandName}
                    </span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-[3px] bg-[var(--color-accent)] text-white text-[12px] lg:text-[14px] font-extrabold tracking-wider">
                      {brandAccent}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Editable>
  );
}
