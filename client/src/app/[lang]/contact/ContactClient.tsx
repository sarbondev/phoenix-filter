"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Phone, Mail, MapPin, Clock, Send, CheckCircle2, Loader2 } from "lucide-react";
import type { Locale } from "@/shared/types";
import { useGetSiteSettingsQuery } from "@/store/api/siteSettingsApi";
import { useSubmitProductRequestMutation } from "@/store/api/productRequestApi";
import { t } from "@/shared/lib/utils";

const BLUE = "#1d4ed8";
type LS = Record<Locale, string>;
const tr = (s: LS, l: Locale) => s[l] ?? s.en;
const ls = (uz: string, ru: string, en: string, kz: string): LS => ({ uz, ru, en, kz });

const T = {
  breadHome: ls("Bosh", "Главная", "Home", "Басты"),
  title: ls("Kontaktlar", "Контакты", "Contacts", "Байланыс"),
  subtitle: ls(
    "Savollaringiz bormi? Biz bilan qulay usulda bog'laning — muhandislarimiz yordam berishadi.",
    "Остались вопросы? Свяжитесь с нами удобным способом — наши инженеры помогут.",
    "Have questions? Reach out and our engineers will help.",
    "Сұрақтарыңыз бар ма? Бізбен байланысыңыз.",
  ),
  phone: ls("Telefon", "Телефон", "Phone", "Телефон"),
  email: ls("Email", "Email", "Email", "Email"),
  hours: ls("Ish vaqti", "Часы работы", "Working hours", "Жұмыс уақыты"),
  hoursVal: ls("Du–Ju 9:00–18:00", "Пн–Пт 9:00–18:00", "Mon–Fri 9:00–18:00", "Дс–Жм 9:00–18:00"),
  offices: ls("OFISLAR", "ОФИСЫ", "OFFICES", "ОФИСТЕР"),
  formTitle: ls("XABAR YUBORISH", "НАПИСАТЬ НАМ", "WRITE TO US", "БІЗГЕ ЖАЗЫҢЫЗ"),
  name: ls("Ismingiz", "Ваше имя", "Your name", "Атыңыз"),
  phoneField: ls("Telefon", "Телефон", "Phone", "Телефон"),
  message: ls("Xabar", "Сообщение", "Message", "Хабарлама"),
  submit: ls("Yuborish", "Отправить", "Send", "Жіберу"),
  successTitle: ls("Xabar yuborildi!", "Сообщение отправлено!", "Message sent!", "Хабарлама жіберілді!"),
  successBody: ls("Tez orada siz bilan bog'lanamiz.", "Мы скоро свяжемся с вами.", "We'll contact you shortly.", "Жақын арада хабарласамыз."),
};

export function ContactClient({ locale }: { locale: Locale }) {
  const { data: settings } = useGetSiteSettingsQuery();
  const [submit, { isLoading }] = useSubmitProductRequestMutation();
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const phone = settings?.phone || "+998 71 200 00 00";
  const email = settings?.email || "info@phoenix-prime.uz";
  const offices = settings?.offices ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phone.trim()) return;
    try {
      await submit({
        productName: "Контакт-форма",
        name: form.name || undefined,
        phoneNumber: form.phone,
        note: form.message || undefined,
        locale,
      }).unwrap();
      setDone(true);
      setForm({ name: "", phone: "", message: "" });
    } catch {
      /* keep form */
    }
  };

  const contactCards = [
    { icon: Phone, label: tr(T.phone, locale), value: phone, href: `tel:${phone.replace(/\s/g, "")}` },
    { icon: Mail, label: tr(T.email, locale), value: email, href: `mailto:${email}` },
    { icon: Clock, label: tr(T.hours, locale), value: tr(T.hoursVal, locale) },
  ];

  return (
    <main className="bg-[var(--color-surface)] min-h-screen">
      <div className="bg-white border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-1.5 text-[12px] text-slate-500">
            <Link href={`/${locale}`} className="hover:text-slate-800">{tr(T.breadHome, locale)}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-slate-900 font-semibold">{tr(T.title, locale)}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 py-10 lg:py-12 space-y-6">
        <section className="rounded-xl bg-white border border-[var(--color-border)] p-6 lg:p-8">
          <h1 className="text-2xl lg:text-[34px] font-extrabold tracking-tight text-[var(--color-brand-strong)] uppercase">{tr(T.title, locale)}</h1>
          <p className="mt-3 text-[14px] text-slate-600 max-w-2xl">{tr(T.subtitle, locale)}</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {contactCards.map((c, i) => {
              const inner = (
                <>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand)] flex-shrink-0">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[11px] text-slate-400">{c.label}</p>
                    <p className="text-[14px] font-semibold text-slate-900">{c.value}</p>
                  </div>
                </>
              );
              return c.href ? (
                <a key={i} href={c.href} className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] p-4 hover:border-[var(--color-brand)]/40 transition-colors">{inner}</a>
              ) : (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] p-4">{inner}</div>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
          {/* Offices + map */}
          <section className="rounded-xl bg-white border border-[var(--color-border)] p-6 lg:p-8">
            <h2 className="text-[13px] font-bold tracking-[0.06em] text-[var(--color-brand-strong)]">{tr(T.offices, locale)}</h2>
            <div className="mt-4 space-y-3">
              {(offices.length > 0
                ? offices
                : [
                    { label: ls("Toshkent", "Ташкент", "Tashkent", "Ташкент"), address: ls("Toshkent sh.", "г. Ташкент", "Tashkent", "Ташкент қ.") },
                  ]
              ).map((o, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg bg-[var(--color-surface)] p-4">
                  <MapPin className="h-5 w-5 text-[var(--color-brand)] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13.5px] font-bold text-slate-900">
                      {typeof o.label === "object" ? t(o.label, locale) : tr(o.label as LS, locale)}
                    </p>
                    <p className="text-[12.5px] text-slate-500">
                      {typeof o.address === "object" ? t(o.address, locale) : tr(o.address as LS, locale)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 h-56 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-slate-300" />
            </div>
          </section>

          {/* Form */}
          <section className="rounded-xl bg-white border border-[var(--color-border)] p-6 lg:p-8">
            <h2 className="text-[13px] font-bold tracking-[0.06em] text-[var(--color-brand-strong)]">{tr(T.formTitle, locale)}</h2>
            {done ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="h-12 w-12 mx-auto text-[var(--color-success)]" />
                <p className="mt-4 text-[16px] font-bold text-slate-900">{tr(T.successTitle, locale)}</p>
                <p className="mt-1 text-[13.5px] text-slate-500">{tr(T.successBody, locale)}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1">{tr(T.name, locale)}</label>
                  <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full h-11 rounded-lg border border-slate-300 px-3 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1">{tr(T.phoneField, locale)} <span className="text-[var(--color-accent)]">*</span></label>
                  <input type="tel" required value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full h-11 rounded-lg border border-slate-300 px-3 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1">{tr(T.message, locale)}</label>
                  <textarea rows={4} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="w-full rounded-lg border border-slate-300 p-3 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]" />
                </div>
                <button type="submit" disabled={isLoading || !form.phone.trim()} className="w-full flex items-center justify-center gap-2 rounded-lg py-3 text-[14px] font-semibold text-white transition-colors disabled:opacity-50" style={{ backgroundColor: BLUE }}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {tr(T.submit, locale)}
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
