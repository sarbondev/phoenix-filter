"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, CheckCircle2, Loader2 } from "lucide-react";
import type { Locale } from "@/shared/types";
import { useSubmitProductRequestMutation } from "@/store/api/productRequestApi";

const BLUE = "#1d4ed8";

type LS = Record<Locale, string>;
const tr = (s: LS, l: Locale) => s[l] ?? s.en;

const T = {
  title: { uz: "Texnik topshiriq yuborish", ru: "Отправить техническое задание", en: "Send a project brief", kz: "Техникалық тапсырма жіберу" },
  subtitle: {
    uz: "Loyihangiz haqida gapirib bering — muhandislarimiz optimal yechim tayyorlaydi.",
    ru: "Расскажите о вашем проекте — наши инженеры подготовят оптимальное решение.",
    en: "Tell us about your project — our engineers will prepare the optimal solution.",
    kz: "Жобаңыз туралы айтыңыз — инженерлеріміз шешім дайындайды.",
  },
  company: { uz: "Kompaniya", ru: "Компания", en: "Company", kz: "Компания" },
  name: { uz: "Ismingiz", ru: "Ваше имя", en: "Your name", kz: "Атыңыз" },
  phone: { uz: "Telefon", ru: "Телефон", en: "Phone", kz: "Телефон" },
  email: { uz: "Email", ru: "Email", en: "Email", kz: "Email" },
  projectType: { uz: "Yo'nalish", ru: "Направление", en: "Direction", kz: "Бағыт" },
  industrial: { uz: "Sanoat filtratsiyasi", ru: "Промышленная фильтрация", en: "Industrial filtration", kz: "Өнеркәсіптік сүзу" },
  spetstexnika: { uz: "Spetstexnika filtrlari", ru: "Фильтры для спецтехники", en: "Special equipment filters", kz: "Арнайы техника сүзгілері" },
  engineering: { uz: "Injiniring xizmatlari", ru: "Инжиниринговые услуги", en: "Engineering services", kz: "Инжиниринг қызметтері" },
  other: { uz: "Boshqa", ru: "Другое", en: "Other", kz: "Басқа" },
  message: { uz: "Vazifa tavsifi", ru: "Описание задачи", en: "Task description", kz: "Тапсырма сипаттамасы" },
  submit: { uz: "Yuborish", ru: "Отправить", en: "Send", kz: "Жіберу" },
  successTitle: { uz: "So'rovingiz qabul qilindi!", ru: "Заявка отправлена!", en: "Request sent!", kz: "Сұрау жіберілді!" },
  successBody: {
    uz: "Menejerimiz tez orada siz bilan bog'lanadi.",
    ru: "Наш менеджер свяжется с вами в ближайшее время.",
    en: "Our manager will contact you shortly.",
    kz: "Менеджеріміз жақын арада хабарласады.",
  },
  close: { uz: "Yopish", ru: "Закрыть", en: "Close", kz: "Жабу" },
} satisfies Record<string, LS>;

export function SendBriefModal({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [submit, { isLoading }] = useSubmitProductRequestMutation();

  const [form, setForm] = useState({
    company: "",
    name: "",
    phone: "",
    email: "",
    projectType: tr(T.industrial, locale),
    message: "",
  });

  useEffect(() => {
    const handler = () => {
      setDone(false);
      setOpen(true);
    };
    window.addEventListener("phoenix:open-tz", handler);
    return () => window.removeEventListener("phoenix:open-tz", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phone.trim()) return;
    const noteParts = [
      form.company && `${tr(T.company, locale)}: ${form.company}`,
      form.email && `Email: ${form.email}`,
      form.message,
    ].filter(Boolean);
    try {
      await submit({
        productName: `ТЗ: ${form.projectType}`,
        name: form.name || undefined,
        phoneNumber: form.phone,
        note: noteParts.join("\n") || undefined,
        locale,
      }).unwrap();
      setDone(true);
      setForm({ company: "", name: "", phone: "", email: "", projectType: tr(T.industrial, locale), message: "" });
    } catch {
      /* keep form open */
    }
  };

  const projectTypes = [T.industrial, T.spetstexnika, T.engineering, T.other];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-black/55 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-0 z-[81] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
            >
              {/* header */}
              <div className="relative bg-[var(--color-ink)] px-6 py-5">
                <button
                  onClick={() => setOpen(false)}
                  aria-label={tr(T.close, locale)}
                  className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <h2 className="text-[18px] font-extrabold text-white pr-8">
                  {tr(T.title, locale)}
                </h2>
                {!done && (
                  <p className="mt-1 text-[12.5px] text-white/70 leading-relaxed">
                    {tr(T.subtitle, locale)}
                  </p>
                )}
              </div>

              {done ? (
                <div className="px-6 py-12 text-center">
                  <CheckCircle2 className="h-14 w-14 mx-auto text-[var(--color-success)]" />
                  <p className="mt-4 text-[17px] font-bold text-slate-900">
                    {tr(T.successTitle, locale)}
                  </p>
                  <p className="mt-1.5 text-[14px] text-slate-500">
                    {tr(T.successBody, locale)}
                  </p>
                  <button
                    onClick={() => setOpen(false)}
                    className="mt-6 rounded-lg px-6 py-2.5 text-[13.5px] font-semibold text-white"
                    style={{ backgroundColor: BLUE }}
                  >
                    {tr(T.close, locale)}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-3.5 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label={tr(T.company, locale)} value={form.company} onChange={(v) => set("company", v)} />
                    <Field label={tr(T.name, locale)} value={form.name} onChange={(v) => set("name", v)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label={tr(T.phone, locale)} value={form.phone} onChange={(v) => set("phone", v)} required type="tel" />
                    <Field label={tr(T.email, locale)} value={form.email} onChange={(v) => set("email", v)} type="email" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-600 mb-1">
                      {tr(T.projectType, locale)}
                    </label>
                    <select
                      value={form.projectType}
                      onChange={(e) => set("projectType", e.target.value)}
                      className="w-full h-11 rounded-lg border border-slate-300 px-3 text-[13.5px] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                    >
                      {projectTypes.map((pt) => (
                        <option key={pt.en} value={tr(pt, locale)}>
                          {tr(pt, locale)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-600 mb-1">
                      {tr(T.message, locale)}
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-slate-300 p-3 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || !form.phone.trim()}
                    className="w-full flex items-center justify-center gap-2 rounded-lg py-3 text-[14px] font-semibold text-white transition-colors disabled:opacity-50"
                    style={{ backgroundColor: BLUE }}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {tr(T.submit, locale)}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[12px] font-semibold text-slate-600 mb-1">
        {label}
        {required && <span className="text-[var(--color-accent)]"> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full h-11 rounded-lg border border-slate-300 px-3 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
      />
    </div>
  );
}
