"use client";

import { motion } from "framer-motion";
import type { Locale } from "@/shared/types";
import { useGetHomeContentQuery } from "@/store/api/homeContentApi";
import { t } from "@/shared/lib/utils";
import { Editable, useEditorDict } from "@/features/inline-editor";
import { HomeContentBlockEditor } from "@/features/inline-editor/blocks/HomeContentBlockEditor";
import { resolveIcon } from "@/features/inline-editor/iconResolver";

export function ProcessSection({ locale }: { locale: Locale }) {
  const { data: home } = useGetHomeContentQuery();
  const ed = useEditorDict();
  const process = home?.process;
  const title = t(process?.title, locale);
  const steps = process?.steps ?? [];

  if (steps.length === 0) {
    return (
      <Editable
        id="process"
        label={ed.homeProcessLabel}
        block={{
          title: ed.processTitle,
          wide: true,
          render: (close) => (
            <HomeContentBlockEditor close={close} initialTab="process" />
          ),
        }}
      >
        <section className="py-12 lg:py-16 bg-white" />
      </Editable>
    );
  }

  return (
    <Editable
      id="process"
      label={ed.homeProcessLabel}
      block={{
        title: ed.processTitle,
        wide: true,
        render: (close) => (
          <HomeContentBlockEditor close={close} initialTab="process" />
        ),
      }}
    >
      <section className="py-12 lg:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-[var(--color-brand)] p-6 sm:p-10 lg:p-14"
          >
            <div
              className="absolute -top-24 -left-16 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none"
              aria-hidden
            />
            <div
              className="absolute -bottom-16 -right-10 w-72 h-72 rounded-full bg-[var(--color-ink)]/30 blur-3xl pointer-events-none"
              aria-hidden
            />

            {title && (
              <h2 className="relative text-center text-xl sm:text-2xl lg:text-[28px] font-extrabold text-white max-w-2xl mx-auto leading-tight">
                {title}
              </h2>
            )}

            <div className="relative mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
              {steps.map((s, i) => {
                const Icon = resolveIcon(s.icon);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="text-white"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[var(--color-brand)]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-2xl font-extrabold text-white/85">
                        {s.number}
                      </span>
                    </div>
                    <h3 className="text-[14px] font-bold uppercase tracking-wide leading-snug">
                      {t(s.title, locale)}
                    </h3>
                    <p className="mt-2 text-[12.5px] text-white/80 leading-relaxed">
                      {t(s.desc, locale)}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </Editable>
  );
}
