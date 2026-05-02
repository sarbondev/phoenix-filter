"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ChevronDown } from "lucide-react";
import type { Locale } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";
import { useGetSiteSettingsQuery } from "@/store/api/siteSettingsApi";

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
}

const LANGUAGES: { code: Locale; label: string; flag: string }[] = [
  { code: "uz", label: "O'zbekcha", flag: "🇺🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "kz", label: "Қазақша", flag: "🇰🇿" },
];

export function Header({ locale, dict }: HeaderProps) {
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { data: settings } = useGetSiteSettingsQuery();
  const phone = settings?.phone || dict.footer.phone;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const switchLang = (code: Locale) => {
    const segments = pathname.split("/");
    segments[1] = code;
    router.push(segments.join("/"));
    setLangOpen(false);
  };

  const currentLang = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  return (
    <div className="hidden lg:block bg-white border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-9 items-center justify-between text-[12.5px] text-slate-600">
          {/* Left — phone */}
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="flex items-center gap-1.5 hover:text-[var(--color-brand)] transition-colors"
          >
            <Phone className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-medium">{phone}</span>
          </a>

          {/* Right — language */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-slate-50 transition-colors"
            >
              <span className="text-base leading-none">{currentLang.flag}</span>
              <span className="uppercase text-[11px] font-semibold tracking-wide">
                {currentLang.code}
              </span>
              <ChevronDown
                className={`h-3 w-3 text-slate-400 transition-transform ${
                  langOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  transition={{ duration: 0.13 }}
                  className="absolute right-0 top-full mt-1.5 w-44 rounded-xl bg-white border border-slate-200 overflow-hidden z-50 text-slate-700 shadow-lg"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => switchLang(lang.code)}
                      className={`flex w-full items-center gap-2.5 px-3 py-2 text-[13px] transition-colors ${
                        locale === lang.code
                          ? "bg-[var(--color-brand-soft)] text-[var(--color-brand)] font-semibold"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-base leading-none">{lang.flag}</span>
                      {lang.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
