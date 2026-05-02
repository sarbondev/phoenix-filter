"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, Clock, MapPin, Plus } from "lucide-react";
import type { Locale } from "@/shared/types";
import { useGetSiteSettingsQuery } from "@/store/api/siteSettingsApi";
import { useGetFaqsQuery } from "@/store/api/faqApi";
import { t } from "@/shared/lib/utils";
import { Editable, useEditorDict } from "@/features/inline-editor";
import { SiteSettingsBlockEditor } from "@/features/inline-editor/blocks/SiteSettingsBlockEditor";
import { FaqBlockEditor } from "@/features/inline-editor/blocks/FaqBlockEditor";

const localized = {
  en: {
    contactTitle: "Available contact channels:",
    formCopy:
      "You can use the contact form to send us your information and questions. Our specialist will get back to you.",
    fieldText: "Message",
    fieldName: "Your name",
    fieldPhone: "Contact phone",
    fieldEmail: "E-mail",
    submit: "Submit question",
    namePh: "Name",
    phonePh: "Phone",
    emailPh: "Email",
    faqTitle: "Frequently asked questions",
    addrLabel: "Address",
    hoursLabel: "Hours",
    phoneLabel: "Phone",
    emailLabel: "Email",
  },
  ru: {
    contactTitle: "Доступные средства связи:",
    formCopy:
      "Вы можете воспользоваться контактной формой для связи. Заполните форму, и наш специалист свяжется с вами.",
    fieldText: "Текст",
    fieldName: "Ваше имя",
    fieldPhone: "Контактный телефон",
    fieldEmail: "E-mail",
    submit: "Задать вопрос",
    namePh: "Имя",
    phonePh: "Телефон",
    emailPh: "Почта",
    faqTitle: "Часто задаваемые вопросы",
    addrLabel: "Адрес",
    hoursLabel: "Часы",
    phoneLabel: "Телефон",
    emailLabel: "Почта",
  },
  uz: {
    contactTitle: "Mavjud aloqa kanallari:",
    formCopy:
      "Aloqa formasidan foydalanib, ma'lumot va savollaringizni yuboring. Mutaxassisimiz tez orada bog'lanadi.",
    fieldText: "Matn",
    fieldName: "Ismingiz",
    fieldPhone: "Aloqa telefoni",
    fieldEmail: "E-mail",
    submit: "Savol berish",
    namePh: "Ism",
    phonePh: "Telefon",
    emailPh: "Pochta",
    faqTitle: "Tez-tez beriladigan savollar",
    addrLabel: "Manzil",
    hoursLabel: "Soatlar",
    phoneLabel: "Telefon",
    emailLabel: "Pochta",
  },
  kz: {
    contactTitle: "Қолжетімді байланыс арналары:",
    formCopy:
      "Байланыс формасын пайдалана аласыз. Маманымыз сұрақтарыңызға жауап береді.",
    fieldText: "Мәтін",
    fieldName: "Сіздің атыңыз",
    fieldPhone: "Байланыс телефоны",
    fieldEmail: "E-mail",
    submit: "Сұрақ қою",
    namePh: "Аты",
    phonePh: "Телефон",
    emailPh: "Пошта",
    faqTitle: "Жиі қойылатын сұрақтар",
    addrLabel: "Мекенжай",
    hoursLabel: "Сағаттар",
    phoneLabel: "Телефон",
    emailLabel: "Пошта",
  },
};

export function ContactFAQSection({ locale }: { locale: Locale }) {
  const c = localized[locale] ?? localized.ru;
  const ed = useEditorDict();
  const { data: settings } = useGetSiteSettingsQuery();
  const { data: faqs } = useGetFaqsQuery();

  const phone = settings?.phone || "+998 (90) 189-94-26";
  const email = settings?.email || "info@gmail.com";
  const hours = t(settings?.workingHours, locale) || "09:00 - 18:00";
  const firstOffice = settings?.offices?.[0];
  const addr = firstOffice ? t(firstOffice.label, locale) : "Tashkent";
  const mapUrl =
    firstOffice?.mapUrl ||
    "https://yandex.com/map-widget/v1/?ll=69.2787%2C41.3111&z=14";

  const activeFaqs = (faqs ?? []).filter((f) => f.isActive);

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Contact channels */}
        <Editable
          id="contacts"
          label={ed.contactsLabel}
          block={{
            title: ed.contactsLabel,
            description: ed.contactsDesc,
            wide: true,
            render: (close) => (
              <SiteSettingsBlockEditor close={close} initialTab="contacts" />
            ),
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title text-xl sm:text-2xl lg:text-[24px] text-slate-900"
          >
            {c.contactTitle}
          </motion.h2>

          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
            <ChannelCard
              icon={<Phone className="h-4 w-4 text-[var(--color-brand)]" />}
              label={c.phoneLabel}
              value={phone}
            />
            <ChannelCard
              icon={<Mail className="h-4 w-4 text-[var(--color-brand)]" />}
              label={c.emailLabel}
              value={email}
            />
            <ChannelCard
              icon={<Clock className="h-4 w-4 text-[var(--color-brand)]" />}
              label={c.hoursLabel}
              value={hours}
            />
            <ChannelCard
              icon={<MapPin className="h-4 w-4 text-[var(--color-brand)]" />}
              label={c.addrLabel}
              value={addr}
            />
          </div>
        </Editable>

        {/* Map + form */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-2xl overflow-hidden border border-[var(--color-border)] aspect-[4/3] lg:aspect-auto lg:min-h-[380px] bg-slate-100">
            <iframe
              src={mapUrl}
              className="w-full h-full"
              loading="lazy"
              title="Map"
            />
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-[13.5px] text-slate-600 leading-relaxed">
              {c.formCopy}
            </p>

            <textarea
              placeholder={c.fieldText}
              rows={4}
              className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-[13.5px] focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] resize-none"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[12px] text-slate-500">
                  {c.fieldName}
                </label>
                <input
                  type="text"
                  placeholder={c.namePh}
                  className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-[13.5px] focus:outline-none focus:border-[var(--color-brand)]"
                />
              </div>
              <div>
                <label className="text-[12px] text-slate-500">
                  {c.fieldPhone}
                </label>
                <input
                  type="tel"
                  placeholder={c.phonePh}
                  className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-[13.5px] focus:outline-none focus:border-[var(--color-brand)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 items-end">
              <div>
                <label className="text-[12px] text-slate-500">
                  {c.fieldEmail}
                </label>
                <input
                  type="email"
                  placeholder={c.emailPh}
                  className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-[13.5px] focus:outline-none focus:border-[var(--color-brand)]"
                />
              </div>
              <button
                type="button"
                className="rounded-xl bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white py-2.5 text-[13.5px] font-semibold transition-colors"
              >
                {c.submit}
              </button>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <Editable
          id="faq"
          label={ed.faqLabel}
          className="mt-12 lg:mt-16 max-w-3xl"
          block={{
            title: ed.faqTitle,
            description: ed.faqDesc,
            render: (close) => <FaqBlockEditor close={close} />,
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title text-xl sm:text-2xl lg:text-[24px] text-slate-900 mb-6"
          >
            {c.faqTitle}
          </motion.h2>

          {activeFaqs.length === 0 ? (
            <p className="text-sm text-slate-400 italic py-6">
              {ed.noFaqsYet}
            </p>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {activeFaqs.map((f) => (
                <FAQItem
                  key={f.id}
                  q={t(f.question, locale)}
                  a={t(f.answer, locale)}
                />
              ))}
            </div>
          )}
        </Editable>
      </div>
    </section>
  );
}

function ChannelCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 hover:border-[var(--color-brand)]/40 transition-colors">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-brand-soft)] flex-shrink-0">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] uppercase text-slate-400 tracking-wide">
          {label}
        </p>
        <p className="text-[13px] font-semibold text-slate-800 truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="text-[14px] font-semibold text-slate-800">{q}</span>
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full border border-[var(--color-border)] text-slate-500 transition-transform ${
            open
              ? "rotate-45 border-[var(--color-brand)] text-[var(--color-brand)]"
              : ""
          }`}
        >
          <Plus className="h-3.5 w-3.5" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <p className="pt-3 text-[13px] text-slate-600 leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
