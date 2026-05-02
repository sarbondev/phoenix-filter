"use client";

import { motion } from "framer-motion";
import type { Locale } from "@/shared/types";
import { useGetHomeContentQuery } from "@/store/api/homeContentApi";
import { t } from "@/shared/lib/utils";
import { Editable, useEditorDict } from "@/features/inline-editor";
import { HomeContentBlockEditor } from "@/features/inline-editor/blocks/HomeContentBlockEditor";

export function IntegrationSection({ locale }: { locale: Locale }) {
  const { data: home } = useGetHomeContentQuery();
  const ed = useEditorDict();
  const integration = home?.integration;
  const title = t(integration?.title, locale);
  const body = t(integration?.body, locale);
  const tiles = (integration?.tiles ?? [])
    .map((tile) => t(tile, locale))
    .filter(Boolean);

  return (
    <Editable
      id="integration"
      label={ed.homeIntegrationLabel}
      block={{
        title: ed.integrationTitle,
        wide: true,
        render: (close) => (
          <HomeContentBlockEditor close={close} initialTab="integration" />
        ),
      }}
    >
      <section className="py-12 lg:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-[var(--color-brand)] p-6 sm:p-10 lg:p-12"
          >
            <div className="text-center mb-8 lg:mb-10">
              {title && (
                <h2 className="text-xl sm:text-2xl lg:text-[28px] font-extrabold text-white max-w-3xl mx-auto leading-tight">
                  {title}
                </h2>
              )}
              {body && (
                <p className="mt-4 max-w-3xl mx-auto text-[13px] sm:text-sm text-white/85 leading-relaxed">
                  {body}
                </p>
              )}
            </div>

            {tiles.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                {tiles.map((tile, i) => {
                  const isFeatured = i === 0 || i === 4;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      className={`rounded-xl bg-[var(--color-ink)] p-4 text-white/85 text-[11.5px] leading-relaxed ${
                        isFeatured ? "lg:col-span-2" : ""
                      }`}
                    >
                      {tile}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </Editable>
  );
}
