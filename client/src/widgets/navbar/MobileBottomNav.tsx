"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Boxes, Phone, MessageCircle, Mail } from "lucide-react";
import type { Locale } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";
import { useGetSiteSettingsQuery } from "@/store/api/siteSettingsApi";

interface Props {
  locale: Locale;
  // kept for layout compatibility; labels come from the local dictionary below
  dict: Dictionary;
}

type LS = Record<Locale, string>;
const tr = (s: LS, l: Locale) => s[l] ?? s.en;
const ls = (uz: string, ru: string, en: string, kz: string): LS => ({ uz, ru, en, kz });

const L = {
  home: ls("Bosh", "Главная", "Home", "Басты"),
  products: ls("Mahsulot", "Продукция", "Products", "Өнім"),
  call: ls("Qo'ng'iroq", "Позвонить", "Call", "Қоңырау"),
  whatsapp: ls("WhatsApp", "WhatsApp", "WhatsApp", "WhatsApp"),
  contacts: ls("Kontakt", "Контакты", "Contacts", "Байланыс"),
};

export function MobileBottomNav({ locale }: Props) {
  const pathname = usePathname();
  const { data: settings } = useGetSiteSettingsQuery();
  const phone = settings?.phone || "+998 71 200 00 00";
  const phoneClean = phone.replace(/[^\d+]/g, "");
  const waNumber = phoneClean.replace(/^\+/, "");

  const links = [
    { href: `/${locale}`, icon: Home, label: tr(L.home, locale), match: (p: string) => p === `/${locale}` || p === `/${locale}/` },
    { href: `/${locale}/products`, icon: Boxes, label: tr(L.products, locale), match: (p: string) => p.startsWith(`/${locale}/products`) || p.startsWith(`/${locale}/industrial`) || p.startsWith(`/${locale}/spetstexnika`) },
  ];

  const rightLinks = [
    { href: `https://wa.me/${waNumber}`, icon: MessageCircle, label: tr(L.whatsapp, locale), external: true },
    { href: `/${locale}/contact`, icon: Mail, label: tr(L.contacts, locale), match: (p: string) => p.startsWith(`/${locale}/contact`) },
  ];

  return (
    <nav
      aria-label="Bottom navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[var(--color-border)] pb-[env(safe-area-inset-bottom)]"
      style={{ boxShadow: "0 -4px 20px -4px rgba(15, 23, 41, 0.08)" }}
    >
      <ul className="flex items-stretch justify-around relative">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = item.match(pathname);
          return (
            <li key={item.href} className="flex-1">
              <Link href={item.href} aria-label={item.label} className="relative flex flex-col items-center justify-center gap-0.5 h-16 active:bg-slate-50 transition-colors">
                <Icon className={`h-[22px] w-[22px] transition-colors ${isActive ? "text-[var(--color-brand)]" : "text-slate-500"}`} strokeWidth={isActive ? 2.4 : 2} />
                <span className={`text-[10.5px] font-semibold transition-colors ${isActive ? "text-[var(--color-brand)]" : "text-slate-500"}`}>{item.label}</span>
                {isActive && (
                  <motion.span layoutId="bottom-nav-indicator" transition={{ type: "spring", stiffness: 380, damping: 30 }} className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-8 rounded-b-full bg-[var(--color-brand)]" />
                )}
              </Link>
            </li>
          );
        })}

        {/* Elevated center — call */}
        <li className="flex-1 relative">
          <a href={`tel:${phoneClean}`} className="flex flex-col items-center justify-end pt-1 pb-1.5 h-16 group" aria-label={tr(L.call, locale)}>
            <span
              className="absolute -top-5 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-brand)] group-active:scale-95 transition-all"
              style={{ boxShadow: "0 6px 16px -4px rgba(29, 78, 216, 0.45), 0 0 0 4px white" }}
            >
              <Phone className="h-5 w-5 text-white" strokeWidth={2.4} />
            </span>
            <span className="mt-9 text-[10.5px] font-semibold text-slate-500">{tr(L.call, locale)}</span>
          </a>
        </li>

        {rightLinks.map((item) => {
          const Icon = item.icon;
          const isActive = "match" in item && item.match ? item.match(pathname) : false;
          const cls = "relative flex flex-col items-center justify-center gap-0.5 h-16 active:bg-slate-50 transition-colors";
          const inner = (
            <>
              <Icon className={`h-[22px] w-[22px] transition-colors ${isActive ? "text-[var(--color-brand)]" : "text-slate-500"}`} strokeWidth={isActive ? 2.4 : 2} />
              <span className={`text-[10.5px] font-semibold transition-colors ${isActive ? "text-[var(--color-brand)]" : "text-slate-500"}`}>{item.label}</span>
            </>
          );
          return (
            <li key={item.href} className="flex-1">
              {item.external ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label} className={cls}>{inner}</a>
              ) : (
                <Link href={item.href} aria-label={item.label} className={cls}>{inner}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
