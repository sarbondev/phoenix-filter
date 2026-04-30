"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  MapPin,
  Mail,
  User,
  ChevronDown,
  Package,
  Settings,
  LogOut,
  Globe,
} from "lucide-react";
import type { Locale } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";
import { useAppSelector, useAppDispatch } from "@/shared/hooks";
import { clearAuth } from "@/store/authSlice";

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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.auth);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      )
        setUserMenuOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node))
        setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    dispatch(clearAuth());
    setUserMenuOpen(false);
  };

  const switchLang = (code: Locale) => {
    const segments = pathname.split("/");
    segments[1] = code;
    router.push(segments.join("/"));
    setLangOpen(false);
  };

  const currentLang = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  return (
    <div className="hidden lg:block bg-slate-900 text-slate-300 text-[12.5px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-9 items-center justify-between">
          {/* Left — contacts */}
          <div className="flex items-center gap-5">
            <a
              href={`tel:${dict.footer.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              <span>{dict.footer.phone}</span>
            </a>
            <span className="hidden xl:flex items-center gap-1.5 text-slate-400">
              <MapPin className="h-3.5 w-3.5" />
              <span>{dict.footer.address}</span>
            </span>
            <a
              href={`mailto:${dict.footer.email}`}
              className="hidden xl:flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              <span>{dict.footer.email}</span>
            </a>
          </div>

          {/* Right — lang + auth */}
          <div className="flex items-center gap-1">
            {/* Compact language */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:text-white hover:bg-white/5 transition-colors"
              >
                <Globe className="h-3.5 w-3.5 text-slate-400" />
                <span className="uppercase text-[12px] font-medium tracking-wide">
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
                    className="absolute right-0 top-full mt-1.5 w-40 rounded-xl bg-white border border-slate-200/80 overflow-hidden z-50 text-slate-700"
                    style={{
                      boxShadow:
                        "0 8px 24px -4px rgba(0,0,0,0.12), 0 2px 8px -2px rgba(0,0,0,0.06)",
                    }}
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => switchLang(lang.code)}
                        className={`flex w-full items-center gap-2.5 px-3 py-2 text-[13px] transition-colors ${
                          locale === lang.code
                            ? "bg-indigo-50 text-indigo-700 font-medium"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-base leading-none">
                          {lang.flag}
                        </span>
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <span className="w-px h-4 bg-slate-700 mx-1" />

            {auth.user ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:text-white hover:bg-white/5 transition-colors"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-indigo-600 text-[10px] font-semibold text-white">
                    {auth.user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate text-[12.5px]">
                    {auth.user.name}
                  </span>
                  <ChevronDown
                    className={`h-3 w-3 text-slate-400 transition-transform ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.97 }}
                      transition={{ duration: 0.13 }}
                      className="absolute right-0 top-full mt-1.5 w-56 rounded-xl bg-white border border-slate-200/80 overflow-hidden z-50 text-slate-700"
                      style={{
                        boxShadow:
                          "0 8px 24px -4px rgba(0,0,0,0.12), 0 2px 8px -2px rgba(0,0,0,0.06)",
                      }}
                    >
                      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white">
                          {auth.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {auth.user.name}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 truncate">
                            {auth.user.phoneNumber}
                          </p>
                        </div>
                      </div>
                      <div className="py-1.5">
                        <Link
                          href={`/${locale}/profile`}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-[13px] hover:bg-slate-50"
                        >
                          <User className="h-[15px] w-[15px] text-slate-400" />
                          {dict.settings.profile}
                        </Link>
                        <Link
                          href={`/${locale}/orders`}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-[13px] hover:bg-slate-50"
                        >
                          <Package className="h-[15px] w-[15px] text-slate-400" />
                          {dict.checkout.myOrders}
                        </Link>
                        <Link
                          href={`/${locale}/settings`}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-[13px] hover:bg-slate-50"
                        >
                          <Settings className="h-[15px] w-[15px] text-slate-400" />
                          {dict.settings.title}
                        </Link>
                        <div className="h-px bg-slate-100 mx-2 my-1" />
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-4 py-2 text-[13px] text-red-500 hover:bg-red-50"
                        >
                          <LogOut className="h-[15px] w-[15px]" />
                          {dict.auth.logout}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href={`/${locale}/auth`}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:text-white hover:bg-white/5 transition-colors"
              >
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span>{dict.auth.login}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
