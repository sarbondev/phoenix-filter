"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { PackageSearch, CheckCircle2, Headphones, Truck } from "lucide-react";
import type { Locale } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";
import { ProductRequestForm } from "@/features/product-request/ProductRequestForm";

interface Props {
  locale: Locale;
  dict: Dictionary;
}

const localized: Record<
  Locale,
  {
    eyebrow: string;
    headline: string;
    sub: string;
    perks: { icon: typeof CheckCircle2; title: string; desc: string }[];
  }
> = {
  ru: {
    eyebrow: "Не нашли нужный товар?",
    headline: "Запросите товар — мы найдём",
    sub: "Расскажите, что вы ищете, и наш специалист свяжется с вами с подходящим решением. Подбираем фильтры под индустрию, бюджет и сроки.",
    perks: [
      {
        icon: Headphones,
        title: "Ответ за 1 час",
        desc: "В рабочие часы. По остальным заявкам — на следующий день.",
      },
      {
        icon: CheckCircle2,
        title: "Подбор по ТЗ",
        desc: "Если стандарта нет — изготовим по чертежам.",
      },
      {
        icon: Truck,
        title: "Доставка по СНГ",
        desc: "Москва, Ташкент и регионы. Удобные условия.",
      },
    ],
  },
  en: {
    eyebrow: "Didn't find the product?",
    headline: "Request a product — we'll find it",
    sub: "Tell us what you're looking for and our specialist will get back with a fitting solution. We source filters for any industry, budget and timeline.",
    perks: [
      {
        icon: Headphones,
        title: "Reply within 1 hour",
        desc: "During business hours. Other requests — next business day.",
      },
      {
        icon: CheckCircle2,
        title: "Custom-spec sourcing",
        desc: "No standard? We'll manufacture from drawings.",
      },
      {
        icon: Truck,
        title: "Delivery across CIS",
        desc: "Moscow, Tashkent and regions. Flexible terms.",
      },
    ],
  },
  uz: {
    eyebrow: "Kerakli mahsulotni topa olmadingizmi?",
    headline: "Mahsulotga so'rov qoldiring — biz topamiz",
    sub: "Nimani izlayotganingizni yozing — mutaxassisimiz mos yechim bilan bog'lanadi. Soha, byudjet va muddatga moslab tanlaymiz.",
    perks: [
      {
        icon: Headphones,
        title: "1 soat ichida javob",
        desc: "Ish vaqtida. Boshqa so'rovlar — keyingi kun.",
      },
      {
        icon: CheckCircle2,
        title: "TT bo'yicha tanlash",
        desc: "Standart bo'lmasa — chizmalar bo'yicha tayyorlaymiz.",
      },
      {
        icon: Truck,
        title: "MDH bo'ylab yetkazib berish",
        desc: "Moskva, Toshkent va viloyatlar. Qulay shartlar.",
      },
    ],
  },
  kz: {
    eyebrow: "Қажет өнімді таппадыңыз ба?",
    headline: "Өнімге сұраныс қалдырыңыз — табамыз",
    sub: "Не іздеп жүргеніңізді жазыңыз — маманымыз қолайлы шешіммен хабарласады.",
    perks: [
      {
        icon: Headphones,
        title: "1 сағат ішінде жауап",
        desc: "Жұмыс уақытында. Басқа сұраныстар — келесі күн.",
      },
      {
        icon: CheckCircle2,
        title: "ТТ бойынша таңдау",
        desc: "Стандарт болмаса — сызбалар бойынша жасаймыз.",
      },
      {
        icon: Truck,
        title: "ТМД бойынша жеткізу",
        desc: "Мәскеу, Ташкент және өңірлер.",
      },
    ],
  },
};

export function ProductRequestSection(props: Props) {
  return (
    <Suspense fallback={null}>
      <ProductRequestSectionInner {...props} />
    </Suspense>
  );
}

function ProductRequestSectionInner({ locale, dict }: Props) {
  const c = localized[locale] ?? localized.ru;
  const searchParams = useSearchParams();
  const requestQuery = searchParams.get("request") ?? "";

  return (
    <section
      id="product-request"
      className="py-12 lg:py-16 bg-[var(--color-surface)]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">
          {/* Left — copy + perks */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 flex flex-col"
          >
            <span className="inline-flex items-center gap-2 self-start rounded-full bg-[var(--color-brand-soft)] text-[var(--color-brand)] px-3 py-1.5 text-[12px] font-semibold mb-4">
              <PackageSearch className="h-3.5 w-3.5" />
              {c.eyebrow}
            </span>

            <h2 className="section-title text-2xl sm:text-3xl lg:text-[32px] text-slate-900 leading-tight">
              {c.headline}
            </h2>

            <p className="mt-4 text-[14px] sm:text-[15px] text-slate-600 leading-relaxed max-w-xl">
              {c.sub}
            </p>

            <ul className="mt-6 space-y-3">
              {c.perks.map((p, i) => {
                const Icon = p.icon;
                return (
                  <motion.li
                    key={p.title}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 * i }}
                    className="flex items-start gap-3"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-[var(--color-border)] text-[var(--color-brand)] flex-shrink-0">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[14px] font-bold text-slate-900">
                        {p.title}
                      </p>
                      <p className="text-[12.5px] text-slate-500 leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>

          {/* Right — form card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-7"
          >
            <div className="relative rounded-2xl overflow-hidden bg-white border border-[var(--color-border)] shadow-sm">
              {/* Decorative top strip */}
              <div className="h-1.5 bg-gradient-to-r from-[var(--color-brand)] via-[var(--color-brand)] to-[var(--color-accent)]" />

              <div className="p-5 sm:p-7">
                <ProductRequestForm
                  locale={locale}
                  dict={dict}
                  variant="inline"
                  searchQuery={requestQuery}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
