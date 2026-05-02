"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Locale } from "@/shared/types";
import { useGetPartnersQuery } from "@/store/api/partnerApi";
import { getImageUrl } from "@/shared/lib/utils";

const titles: Record<string, string> = {
  en: "Trusted by",
  ru: "Нам доверяют",
  uz: "Bizga ishonadilar",
  kz: "Бізге сенеді",
};

const noData: Record<string, string> = {
  en: "No partners available yet",
  ru: "Партнёры пока не добавлены",
  uz: "Hamkorlar hali qo'shilmagan",
  kz: "Серіктестер әзірше қосылмаған",
};

export function BrandsSection({ locale }: { locale: Locale }) {
  const { data: partners } = useGetPartnersQuery();
  const active = partners?.filter((p) => p.isActive) ?? [];

  return (
    <section className="py-10 lg:py-12 bg-white border-y border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-[15px] font-bold text-slate-900 mb-8"
        >
          {titles[locale] ?? titles.en}
        </motion.h3>

        {active.length === 0 ? (
          <p className="text-center text-slate-300 py-6">
            {noData[locale] ?? noData.en}
          </p>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 sm:gap-x-16">
            {active.map((partner, i) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="relative h-10 w-28 sm:h-12 sm:w-36 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                <Image
                  src={getImageUrl(partner.image)}
                  alt="Partner"
                  fill
                  className="object-contain"
                  sizes="144px"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
