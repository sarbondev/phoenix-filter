"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  Menu,
  X,
  User,
  LogOut,
  Package,
  Settings,
  LayoutGrid,
  Phone,
  ShoppingCart,
  Search,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { FacebookIcon, InstagramIcon, TelegramIcon } from "@/shared/ui";
import type { Locale } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";
import { useAppSelector, useAppDispatch } from "@/shared/hooks";
import { clearAuth } from "@/store/authSlice";
import { CatalogMenu } from "./CatalogMenu";
import { SmartSearch } from "@/features/smart-search/SmartSearch";
import { useGetSiteSettingsQuery } from "@/store/api/siteSettingsApi";
import { t } from "@/shared/lib/utils";

interface NavbarProps {
  locale: Locale;
  dict: Dictionary;
}

const LANGUAGES: { code: Locale; label: string; flag: string }[] = [
  { code: "uz", label: "O'zbekcha", flag: "🇺🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "kz", label: "Қазақша", flag: "🇰🇿" },
];

export function Navbar({ locale, dict }: NavbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [langExpanded, setLangExpanded] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const wishlistCount = useAppSelector((s) => s.wishlist.ids.length);
  const cartItems = useAppSelector((s) => s.cart.items);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const auth = useAppSelector((s) => s.auth);
  const { data: settings } = useGetSiteSettingsQuery();

  const phone = settings?.phone || dict.footer.phone;
  const consultationCta = t(settings?.consultationCta, locale);
  const consultationSub = t(settings?.consultationSubtitle, locale);
  const socials = settings?.socials ?? {};
  const brandName = settings?.brandName || "PRESTIGE";
  const brandAccent = settings?.brandAccent || "FILTER";

  useEffect(() => {
    setDrawerOpen(false);
    setMobileSearchOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [userMenuOpen]);

  // Lock body scroll while drawer open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const navLinks = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/directions`, label: dict.nav.categories },
    { href: `/${locale}/products`, label: dict.nav.products },
    { href: `/${locale}/blog`, label: dict.blog.title },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  const handleLogout = () => {
    dispatch(clearAuth());
    setDrawerOpen(false);
  };

  const switchLang = (code: Locale) => {
    const segments = pathname.split("/");
    segments[1] = code;
    router.push(segments.join("/"));
    setLangExpanded(false);
  };

  const currentLang = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  return (
    <>
      {/* ═══════════════════════════════════════════════ */}
      {/*  Desktop navbar                                 */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="hidden lg:block bg-white border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Main row */}
          <div className="flex h-[68px] items-center gap-4 lg:gap-8">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-0 flex-shrink-0 select-none"
            >
              <span className="text-[22px] font-extrabold tracking-tight text-[var(--color-brand-strong)]">
                {brandName}
              </span>
              <span className="ml-1.5 inline-flex items-center px-2 py-0.5 rounded-[3px] bg-[var(--color-accent)] text-white text-[14px] font-extrabold tracking-wider">
                {brandAccent}
              </span>
            </Link>

            <nav className="flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== `/${locale}` &&
                    pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative text-[14px] font-semibold transition-colors py-2 ${
                      isActive
                        ? "text-[var(--color-brand-strong)]"
                        : "text-slate-700 hover:text-[var(--color-brand)]"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-[var(--color-brand)]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="flex-1" />

            <div className="flex items-center gap-4">
              <div className="text-right leading-tight text-[12.5px] text-slate-700">
                <div className="font-semibold">
                  {consultationCta || "Получите консультацию"}
                </div>
                <div className="text-slate-500">
                  {consultationSub || "по телефону или в мессенджерах"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {socials.facebook && (
                  <a
                    href={socials.facebook}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-90 transition-opacity"
                  >
                    <FacebookIcon className="h-4 w-4" />
                  </a>
                )}
                {socials.instagram && (
                  <a
                    href={socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FEDA75] via-[#D62976] to-[#4F5BD5] text-white hover:opacity-90 transition-opacity"
                  >
                    <InstagramIcon className="h-4 w-4" />
                  </a>
                )}
                {socials.telegram && (
                  <a
                    href={socials.telegram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Telegram"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#229ED9] text-white hover:opacity-90 transition-opacity"
                  >
                    <TelegramIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Search row (desktop) */}
          <div className="flex items-center gap-3 pb-3">
            <CatalogMenu locale={locale} dict={dict} />
            <SmartSearch locale={locale} dict={dict} className="flex-1" />
            <Link
              href={`/${locale}/wishlist`}
              className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white text-slate-500 hover:text-[var(--color-brand)] hover:border-[var(--color-brand)]/40 transition-colors"
              aria-label={dict.wishlist.title}
            >
              <Bookmark className="h-[18px] w-[18px]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-semibold text-white border-2 border-white px-[3px]">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href={`/${locale}/cart`}
              className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white text-slate-500 hover:text-[var(--color-brand)] hover:border-[var(--color-brand)]/40 transition-colors"
              aria-label={dict.cart.title}
            >
              <ShoppingCart className="h-[18px] w-[18px]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--color-brand)] text-[10px] font-semibold text-white border-2 border-white px-[3px]">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
            {auth.user ? (
              <div ref={userMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex h-11 items-center gap-2 rounded-xl bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] px-4 text-[13px] font-semibold text-white transition-colors"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-[12px] font-bold">
                    {auth.user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-[110px] truncate">{auth.user.name}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-white border border-[var(--color-border)] shadow-xl overflow-hidden z-50"
                    >
                      <Link
                        href={`/${locale}/profile`}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)] hover:bg-slate-50 transition-colors"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-brand)] text-[14px] font-bold text-white flex-shrink-0">
                          {auth.user.name.charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13.5px] font-semibold text-slate-900 truncate">
                            {auth.user.name}
                          </p>
                          <p className="text-[11.5px] text-slate-500 truncate">
                            {auth.user.phoneNumber}
                          </p>
                        </div>
                      </Link>
                      <div className="py-1.5">
                        <UserMenuLink
                          href={`/${locale}/orders`}
                          icon={<Package className="h-4 w-4" />}
                          label={dict.checkout.myOrders}
                          onClick={() => setUserMenuOpen(false)}
                        />
                        <UserMenuLink
                          href={`/${locale}/wishlist`}
                          icon={<Bookmark className="h-4 w-4" />}
                          label={dict.wishlist.title}
                          onClick={() => setUserMenuOpen(false)}
                        />
                        <UserMenuLink
                          href={`/${locale}/settings`}
                          icon={<Settings className="h-4 w-4" />}
                          label={dict.settings.title}
                          onClick={() => setUserMenuOpen(false)}
                        />
                      </div>
                      <div className="border-t border-[var(--color-border)] py-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            handleLogout();
                            setUserMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-[13.5px] text-[var(--color-accent)] hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
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
                className="flex h-11 items-center gap-2 rounded-xl bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] px-4 text-[13px] font-semibold text-white transition-colors"
              >
                <User className="h-4 w-4" />
                {dict.auth.login}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/*  Mobile navbar — compact, sticky                */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="lg:hidden bg-white border-b border-[var(--color-border)]">
        <div className="flex h-14 items-center px-3 gap-2">
          {/* Hamburger */}
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo (center) */}
          <Link
            href={`/${locale}`}
            className="flex-1 flex items-center justify-center select-none"
          >
            <span className="text-[18px] font-extrabold tracking-tight text-[var(--color-brand-strong)]">
              {brandName}
            </span>
            <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-[3px] bg-[var(--color-accent)] text-white text-[11px] font-extrabold tracking-wider">
              {brandAccent}
            </span>
          </Link>

          {/* Search toggle */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            aria-label="Search"
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
              mobileSearchOpen
                ? "bg-[var(--color-brand-soft)] text-[var(--color-brand)]"
                : "text-slate-700 hover:bg-slate-100 active:bg-slate-200"
            }`}
          >
            {mobileSearchOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Collapsible mobile search */}
        <AnimatePresence initial={false}>
          {mobileSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="overflow-hidden border-t border-[var(--color-border)]"
            >
              <div className="px-3 py-3">
                <SmartSearch locale={locale} dict={dict} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/*  Mobile drawer (slide from left)                */}
      {/* ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-sm lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 left-0 z-[61] w-[86%] max-w-sm bg-white shadow-2xl flex flex-col lg:hidden"
            >
              {/* Drawer header */}
              <div className="relative flex-shrink-0 bg-[var(--color-ink)] text-white px-5 pt-5 pb-6">
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close"
                  className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                <Link
                  href={`/${locale}`}
                  onClick={() => setDrawerOpen(false)}
                  className="inline-flex items-center select-none"
                >
                  <span className="text-[18px] font-extrabold tracking-tight text-white">
                    {brandName}
                  </span>
                  <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-[3px] bg-[var(--color-accent)] text-white text-[11px] font-extrabold tracking-wider">
                    {brandAccent}
                  </span>
                </Link>

                {auth.user ? (
                  <Link
                    href={`/${locale}/profile`}
                    onClick={() => setDrawerOpen(false)}
                    className="mt-5 flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-sm p-3 hover:bg-white/15 transition-colors"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-brand)] text-base font-bold text-white">
                      {auth.user.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold text-white truncate">
                        {auth.user.name}
                      </p>
                      <p className="text-[11.5px] text-white/70 truncate">
                        {auth.user.phoneNumber}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/60" />
                  </Link>
                ) : (
                  <Link
                    href={`/${locale}/auth`}
                    onClick={() => setDrawerOpen(false)}
                    className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] py-3 text-[14px] font-semibold text-white transition-colors"
                  >
                    <User className="h-4 w-4" />
                    {dict.auth.login}
                  </Link>
                )}
              </div>

              {/* Drawer body — scrollable */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                {/* Catalog primary CTA */}
                <div className="p-4 border-b border-[var(--color-border)]">
                  <Link
                    href={`/${locale}/directions`}
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-3 rounded-xl bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] px-4 py-3.5 text-[14px] font-semibold text-white transition-colors"
                  >
                    <LayoutGrid className="h-4 w-4" />
                    {dict.nav.catalog}
                    <ChevronRight className="h-4 w-4 ml-auto opacity-80" />
                  </Link>
                </div>

                {/* Nav links */}
                <nav className="px-2 py-2 border-b border-[var(--color-border)]">
                  {navLinks.map((link) => {
                    const isActive =
                      pathname === link.href ||
                      (link.href !== `/${locale}` &&
                        pathname.startsWith(link.href));
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setDrawerOpen(false)}
                        className={`flex items-center justify-between rounded-xl px-3 py-3 text-[14.5px] transition-colors ${
                          isActive
                            ? "text-[var(--color-brand)] bg-[var(--color-brand-soft)] font-semibold"
                            : "text-slate-800 hover:bg-slate-50"
                        }`}
                      >
                        {link.label}
                        <ChevronRight className="h-4 w-4 text-slate-300" />
                      </Link>
                    );
                  })}
                </nav>

                {/* Quick actions */}
                <div className="px-2 py-2 border-b border-[var(--color-border)]">
                  <DrawerLink
                    href={`/${locale}/wishlist`}
                    icon={<Bookmark className="h-4 w-4" />}
                    label={dict.wishlist.title}
                    badge={wishlistCount}
                    badgeColor="accent"
                    onClick={() => setDrawerOpen(false)}
                  />
                  <DrawerLink
                    href={`/${locale}/cart`}
                    icon={<ShoppingCart className="h-4 w-4" />}
                    label={dict.cart.title}
                    badge={cartCount}
                    badgeColor="brand"
                    onClick={() => setDrawerOpen(false)}
                  />
                  {auth.user && (
                    <>
                      <DrawerLink
                        href={`/${locale}/orders`}
                        icon={<Package className="h-4 w-4" />}
                        label={dict.checkout.myOrders}
                        onClick={() => setDrawerOpen(false)}
                      />
                      <DrawerLink
                        href={`/${locale}/settings`}
                        icon={<Settings className="h-4 w-4" />}
                        label={dict.settings.title}
                        onClick={() => setDrawerOpen(false)}
                      />
                    </>
                  )}
                </div>

                {/* Language */}
                <div className="px-2 py-2 border-b border-[var(--color-border)]">
                  <button
                    onClick={() => setLangExpanded(!langExpanded)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[14.5px] text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-base leading-none">
                      {currentLang.flag}
                    </span>
                    <span className="font-medium">{currentLang.label}</span>
                    <ChevronDown
                      className={`h-4 w-4 ml-auto text-slate-400 transition-transform ${
                        langExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {langExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-3 py-1">
                          {LANGUAGES.filter((l) => l.code !== locale).map(
                            (lang) => (
                              <button
                                key={lang.code}
                                onClick={() => switchLang(lang.code)}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] text-slate-600 hover:bg-slate-50 transition-colors"
                              >
                                <span className="text-base leading-none">
                                  {lang.flag}
                                </span>
                                {lang.label}
                              </button>
                            ),
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Contact */}
                <div className="px-5 py-4 border-b border-[var(--color-border)]">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-3">
                    {dict.nav.contact}
                  </p>
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 mb-3"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-[var(--color-brand)] flex-shrink-0">
                      <Phone className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[11px] text-slate-400">
                        {locale === "en" ? "Call us" : "Позвонить"}
                      </p>
                      <p className="text-[14px] font-semibold text-slate-900">
                        {phone}
                      </p>
                    </div>
                  </a>
                  <div className="flex items-center gap-2.5">
                    {socials.facebook && (
                    <a
                      href={socials.facebook}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Facebook"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-white"
                    >
                      <FacebookIcon className="h-4 w-4" />
                    </a>
                    )}
                    {socials.instagram && (
                    <a
                      href={socials.instagram}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#FEDA75] via-[#D62976] to-[#4F5BD5] text-white"
                    >
                      <InstagramIcon className="h-4 w-4" />
                    </a>
                    )}
                    {socials.telegram && (
                    <a
                      href={socials.telegram}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Telegram"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#229ED9] text-white"
                    >
                      <TelegramIcon className="h-4 w-4" />
                    </a>
                    )}
                  </div>
                </div>

                {/* Logout */}
                {auth.user && (
                  <div className="p-4">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[14px] text-[var(--color-accent)] hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      {dict.auth.logout}
                    </button>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function UserMenuLink({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-[13.5px] text-slate-700 hover:bg-slate-50 hover:text-[var(--color-brand)] transition-colors"
    >
      <span className="text-slate-400">{icon}</span>
      {label}
    </Link>
  );
}

function DrawerLink({
  href,
  icon,
  label,
  badge,
  badgeColor,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  badgeColor?: "brand" | "accent";
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-3 text-[14.5px] text-slate-800 hover:bg-slate-50 transition-colors"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600 flex-shrink-0">
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      {badge && badge > 0 ? (
        <span
          className={`inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full text-[10.5px] font-bold text-white ${
            badgeColor === "accent"
              ? "bg-[var(--color-accent)]"
              : "bg-[var(--color-brand)]"
          }`}
        >
          {badge > 9 ? "9+" : badge}
        </span>
      ) : (
        <ChevronRight className="h-4 w-4 text-slate-300" />
      )}
    </Link>
  );
}
