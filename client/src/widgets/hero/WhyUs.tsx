"use client";

import { motion } from "framer-motion";
import type { Locale } from "@/shared/types";
import { useGetHomeContentQuery } from "@/store/api/homeContentApi";
import { t } from "@/shared/lib/utils";
import { Editable, useEditorDict } from "@/features/inline-editor";
import { HomeContentBlockEditor } from "@/features/inline-editor/blocks/HomeContentBlockEditor";
import { resolveIcon } from "@/features/inline-editor/iconResolver";

export function WhyUs({ locale }: { locale: Locale }) {
  const { data: home } = useGetHomeContentQuery();
  const ed = useEditorDict();
  const whyUs = home?.whyUs;
  const title = t(whyUs?.title, locale);
  const features = whyUs?.features ?? [];

  return (
    <Editable
      id="why-us"
      label={ed.homeWhyUsLabel}
      block={{
        title: ed.whyUsTitle,
        description: ed.whyUsDesc,
        wide: true,
        render: (close) => (
          <HomeContentBlockEditor close={close} initialTab="whyUs" />
        ),
      }}
    >
      <section className="py-12 lg:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {title && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8 lg:mb-10"
            >
              <h2 className="section-title is-center text-center text-xl sm:text-2xl lg:text-[26px] text-slate-900">
                {title}
              </h2>
            </motion.div>
          )}

          {features.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="relative overflow-hidden rounded-3xl bg-[var(--color-ink)] p-6 sm:p-10 lg:p-12"
            >
              <div
                className="absolute -right-20 -top-20 w-[55%] h-[140%] bg-[var(--color-brand)] rounded-full opacity-20 blur-3xl pointer-events-none"
                aria-hidden
              />
              <div
                className="absolute right-0 top-0 bottom-0 w-[8%] bg-[var(--color-brand)] hidden lg:block"
                style={{
                  clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0% 100%)",
                }}
                aria-hidden
              />

              <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 lg:gap-y-10">
                {features.map((feature, i) => {
                  const Icon = resolveIcon(feature.icon);
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-4"
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-brand)] text-white flex-shrink-0">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-[15px] sm:text-base font-bold text-white uppercase tracking-wide">
                          {t(feature.title, locale)}
                        </h3>
                        <p className="mt-1.5 text-[13px] sm:text-sm text-white/70 leading-relaxed">
                          {t(feature.desc, locale)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </Editable>
  );
}
