"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FileCheck2 } from "lucide-react";
import type { Locale } from "@/shared/types";
import { useGetCertificatesQuery } from "@/store/api/certificateApi";
import { t, getImageUrl } from "@/shared/lib/utils";
import { Editable, useEditorDict } from "@/features/inline-editor";
import { CertificatesBlockEditor } from "@/features/inline-editor/blocks/CertificatesBlockEditor";

const titles: Record<string, string> = {
  en: "Our certificates",
  ru: "Наши сертификаты",
  uz: "Bizning sertifikatlar",
  kz: "Біздің сертификаттар",
};

export function CertificatesSection({ locale }: { locale: Locale }) {
  const { data: certs, isLoading } = useGetCertificatesQuery();
  const ed = useEditorDict();

  return (
    <Editable
      id="certificates"
      label={ed.certificatesLabel}
      block={{
        title: ed.certificatesTitle,
        description: ed.certificatesDesc,
        render: (close) => <CertificatesBlockEditor close={close} />,
      }}
    >
      <section className="py-12 lg:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title is-center text-center text-xl sm:text-2xl lg:text-[26px] text-slate-900 mb-10"
          >
            {titles[locale] ?? titles.ru}
          </motion.h2>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-7 max-w-4xl mx-auto">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-xl bg-[var(--color-surface)] animate-pulse"
                />
              ))}
            </div>
          ) : (certs ?? []).length === 0 ? (
            <p className="text-center text-[13px] text-slate-400 italic py-6">
              {ed.noCertsYet}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-7 max-w-4xl mx-auto">
              {(certs ?? []).map((cert, i) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden transition-all duration-200 group-hover:shadow-lg group-hover:border-[var(--color-brand)]/40">
                    {cert.image ? (
                      <Image
                        src={getImageUrl(cert.image)}
                        alt={t(cert.caption, locale)}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileCheck2 className="h-10 w-10 text-slate-300" />
                      </div>
                    )}
                  </div>
                  {t(cert.caption, locale) && (
                    <p className="mt-3 text-center text-[13px] font-semibold text-slate-700">
                      {t(cert.caption, locale)}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Editable>
  );
}
