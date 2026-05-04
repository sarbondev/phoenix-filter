"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/shared/types";
import { useGetIndustriesQuery } from "@/store/api/industryApi";
import { getImageUrl, t } from "@/shared/lib/utils";
import { Editable } from "@/features/inline-editor";
import { IndustriesBlockEditor } from "@/features/inline-editor/blocks/IndustriesBlockEditor";
import { useEditorDict } from "@/features/inline-editor/useEditorDict";

const titles: Record<string, string> = {
  en: "Industries we serve",
  ru: "Отрасли, которые мы обслуживаем",
  uz: "Biz xizmat ko'rsatadigan sohalar",
  kz: "Біз қызмет көрсететін салалар",
};

const viewAll: Record<string, string> = {
  en: "View all",
  ru: "Все отрасли",
  uz: "Barcha sohalar",
  kz: "Барлық салалар",
};

const noData: Record<string, string> = {
  en: "No industries available yet",
  ru: "Отрасли пока не добавлены",
  uz: "Sohalar hali qo'shilmagan",
  kz: "Салалар әзірше қосылмаған",
};

export function IndustriesSection({ locale }: { locale: Locale }) {
  const { data: industries } = useGetIndustriesQuery();
  const active = industries?.filter((i) => i.isActive) ?? [];
  const ed = useEditorDict();

  return (
    <Editable
      id="industries"
      label={ed.industriesLabel}
      block={() => ({
        title: ed.industriesTitle,
        description: ed.industriesDesc,
        render: (close) => <IndustriesBlockEditor close={close} />,
      })}
    >
    <section className="py-12 lg:py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 lg:mb-10 flex items-end justify-between gap-4"
        >
          <h2 className="section-title text-xl sm:text-2xl lg:text-[26px] text-slate-900">
            {titles[locale] ?? titles.en}
          </h2>
          {active.length > 4 && (
            <Link
              href={`/${locale}/industries`}
              className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-hover)]"
            >
              {viewAll[locale] ?? viewAll.en}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </motion.div>

        {active.length === 0 ? (
          <p className="text-center text-slate-400 py-10">
            {noData[locale] ?? noData.en}
          </p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {active.slice(0, 8).map((industry, i) => (
              <motion.div
                key={industry.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-2xl h-48 sm:h-56 lg:h-60 cursor-pointer"
              >
                <Image
                  src={getImageUrl(industry.image)}
                  alt={t(industry.name, locale)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/85 via-[var(--color-ink)]/30 to-transparent transition-opacity group-hover:from-[var(--color-brand)]/95 group-hover:via-[var(--color-brand)]/40" />
                <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4 rounded-xl bg-[var(--color-brand)] px-3 sm:px-4 py-2.5 sm:py-3 transform transition-transform group-hover:translate-y-[-4px]">
                  <h3 className="text-[12px] sm:text-[13px] font-bold text-white uppercase tracking-wide leading-tight">
                    {t(industry.name, locale)}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
    </Editable>
  );
}
