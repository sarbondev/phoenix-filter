"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, ChevronDown, Menu, X, ChevronRight } from "lucide-react";
import type { Locale } from "@/shared/types";
import { useGetSiteSettingsQuery } from "@/store/api/siteSettingsApi";
import { PhoenixLogo } from "./PhoenixLogo";

const BLUE = "#1d4ed8";
const BLUE_HOVER = "#1a44bd";

const LANGUAGES: { code: Locale; label: string }[] = [
  { code: "uz", label: "O'zbekcha" },
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
  { code: "kz", label: "Қазақша" },
];

type LS = Record<Locale, string>;

const NAV: { key: string; label: LS; href: (l: Locale) => string }[] = [
  { key: "home", label: { uz: "Bosh", ru: "Главная", en: "Home", kz: "Басты" }, href: (l) => `/${l}` },
  { key: "about", label: { uz: "Kompaniya", ru: "О компании", en: "About", kz: "Компания" }, href: (l) => `/${l}/about` },
  { key: "products", label: { uz: "Mahsulotlar", ru: "Продукция", en: "Products", kz: "Өнім" }, href: (l) => `/${l}/products` },
  { key: "engineering", label: { uz: "Injiniring", ru: "Инжиниринг", en: "Engineering", kz: "Инжиниринг" }, href: (l) => `/${l}/engineering` },
  { key: "projects", label: { uz: "Loyihalar", ru: "Проекты", en: "Projects", kz: "Жобалар" }, href: (l) => `/${l}/projects` },
  { key: "services", label: { uz: "Servis", ru: "Сервис", en: "Service", kz: "Сервис" }, href: (l) => `/${l}/services` },
  { key: "blog", label: { uz: "Blog", ru: "Блог", en: "Blog", kz: "Блог" }, href: (l) => `/${l}/blog` },
  { key: "contact", label: { uz: "Kontaktlar", ru: "Контакты", en: "Contacts", kz: "Байланыс" }, href: (l) => `/${l}/contact` },
];

const SEND_TZ: LS = { uz: "TZ yuborish", ru: "Отправить ТЗ", en: "Send brief", kz: "ТЗ жіберу" };

export function SiteHeader({ locale }: { locale: Locale }) {
  const [langOpen, setLangOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { data: settings } = useGetSiteSettingsQuery();
  const phone = settings?.phone || "+998 71 200 00 00";

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const switchLang = (code: Locale) => {
    const segments = pathname.split("/");
    segments[1] = code;
    router.push(segments.join("/"));
    setLangOpen(false);
  };

  const openTz = () => {
    window.dispatchEvent(new CustomEvent("phoenix:open-tz"));
  };

  const isActive = (href: string) =>
    href === `/${locale}` ? pathname === href : pathname.startsWith(href);

  const currentLang = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[1];

  return (
    <>
      {/* ── Desktop ──────────────────────────────────────────── */}
      <div className="hidden lg:block bg-white/85 backdrop-blur-md border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-5">
            <Link href={`/${locale}`} className="flex-shrink-0">
              <PhoenixLogo className="scale-95 origin-left" />
            </Link>

            <nav className="flex items-center gap-0.5 mx-auto">
              {NAV.map((item) => {
                const href = item.href(locale);
                const active = isActive(href);
                return (
                  <Link
                    key={item.key}
                    href={href}
                    className={`rounded-lg px-3 py-1.5 text-[13.5px] font-semibold whitespace-nowrap transition-colors ${
                      active
                        ? "text-[var(--color-brand)] bg-[var(--color-brand-soft)]"
                        : "text-slate-600 hover:text-[var(--color-brand)] hover:bg-[var(--color-surface)]"
                    }`}
                  >
                    {item.label[locale]}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2.5 flex-shrink-0">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="hidden xl:flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-brand-strong)] hover:text-[var(--color-brand)] transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                {phone}
              </a>

              <div ref={langRef} className="relative">
                <button
                  onClick={() => setLangOpen((v) => !v)}
                  className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-2 py-1.5 text-[12px] font-semibold text-slate-700 hover:border-[var(--color-brand)]/40 hover:text-[var(--color-brand)] transition-colors"
                >
                  {currentLang.code.toUpperCase()}
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-400 transition-transform ${langOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.13 }}
                      className="absolute right-0 top-full mt-1.5 w-40 rounded-xl bg-white border border-slate-200 shadow-lg overflow-hidden z-50"
                    >
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => switchLang(lang.code)}
                          className={`flex w-full items-center px-3 py-2 text-[13px] transition-colors ${
                            locale === lang.code
                              ? "bg-[var(--color-brand-soft)] text-[var(--color-brand)] font-semibold"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="button"
                onClick={openTz}
                className="rounded-lg px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-all hover:shadow"
                style={{ backgroundColor: BLUE }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BLUE_HOVER)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BLUE)}
              >
                {SEND_TZ[locale]}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile bar ───────────────────────────────────────── */}
      <div className="lg:hidden bg-white/85 backdrop-blur-md border-b border-[var(--color-border)]">
        <div className="flex h-14 items-center px-4 gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href={`/${locale}`} className="flex-1">
            <PhoenixLogo className="scale-[0.92] origin-left" />
          </Link>
          <button
            type="button"
            onClick={openTz}
            className="rounded-lg px-3.5 py-2 text-[12.5px] font-semibold text-white"
            style={{ backgroundColor: BLUE }}
          >
            {SEND_TZ[locale]}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-sm lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 left-0 z-[61] w-[86%] max-w-sm bg-white shadow-2xl flex flex-col lg:hidden"
            >
              <div className="relative flex-shrink-0 bg-[var(--color-ink)] px-5 pt-5 pb-6">
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close"
                  className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <PhoenixLogo light />
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="mt-5 flex items-center gap-2 text-[14px] font-semibold text-white"
                >
                  <Phone className="h-4 w-4" />
                  {phone}
                </a>
              </div>

              <nav className="flex-1 overflow-y-auto px-2 py-2">
                {NAV.map((item) => {
                  const href = item.href(locale);
                  const active = isActive(href);
                  return (
                    <Link
                      key={item.key}
                      href={href}
                      onClick={() => setDrawerOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-3 py-3 text-[14.5px] transition-colors ${
                        active
                          ? "bg-[var(--color-brand-soft)] text-[var(--color-brand)] font-semibold"
                          : "text-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      {item.label[locale]}
                      <ChevronRight className="h-4 w-4 text-slate-300" />
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-[var(--color-border)] p-4">
                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    openTz();
                  }}
                  className="w-full rounded-lg py-3 text-[14px] font-semibold text-white"
                  style={{ backgroundColor: BLUE }}
                >
                  {SEND_TZ[locale]}
                </button>
                <div className="mt-4 flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => switchLang(lang.code)}
                      className={`rounded-md border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                        locale === lang.code
                          ? "border-[var(--color-brand)] text-[var(--color-brand)] bg-[var(--color-brand-soft)]"
                          : "border-[var(--color-border)] text-slate-600"
                      }`}
                    >
                      {lang.code.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
