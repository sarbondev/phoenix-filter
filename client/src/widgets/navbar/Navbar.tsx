"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Bookmark,
  Menu,
  X,
  User,
  LogOut,
  Package,
  ChevronDown,
  Settings,
} from "lucide-react";
import type { Locale } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";
import { LanguageSwitcher } from "@/features/language-switcher/LanguageSwitcher";
import { useAppSelector, useAppDispatch } from "@/shared/hooks";
import { clearAuth } from "@/store/authSlice";

interface NavbarProps {
  locale: Locale;
  dict: Dictionary;
}

export function Navbar({ locale, dict }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((s) => s.cart.items);
  const wishlistCount = useAppSelector((s) => s.wishlist.ids.length);
  const auth = useAppSelector((s) => s.auth);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      )
        setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/products`, label: dict.nav.products },
    { href: `/${locale}/categories`, label: dict.nav.categories },
    { href: `/${locale}/blog`, label: dict.blog.title },
  ];

  const handleLogout = () => {
    dispatch(clearAuth());
    setUserMenuOpen(false);
  };

  /* ── Style helpers ── */
  const headerBg = transparent
    ? "bg-transparent"
    : "bg-white/85 backdrop-blur-2xl border-b border-slate-200/70 shadow-sm shadow-slate-100/50";

  const linkBase = transparent
    ? "text-white/60 hover:text-white hover:bg-white/10"
    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50";

  const linkActive = transparent
    ? "text-white bg-white/15 font-medium"
    : "text-indigo-600 bg-indigo-50 font-medium";

  const iconBtn = transparent
    ? "text-white/70 hover:text-white hover:bg-white/10"
    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100";

  const authBtn = transparent
    ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300";

  const userBtnBg = transparent
    ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300";

  const dividerColor = transparent ? "bg-white/15" : "bg-slate-200";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-[68px]">
            {/* Logo + Nav */}
            <div className="flex items-center gap-8">
              <Link
                href={`/${locale}`}
                className="flex items-center gap-2.5 flex-shrink-0"
              >
                <img
                  src="/logo.png"
                  alt="FilterSystem Logo"
                  className="h-8 w-auto"
                />
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-0.5">
                {navLinks.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== `/${locale}` &&
                      pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3.5 py-2 text-sm rounded-lg transition-colors duration-150 ${
                        isActive ? linkActive : linkBase
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              <LanguageSwitcher
                currentLang={locale}
                transparent={transparent}
              />

              {/* Divider */}
              <div
                className={`hidden sm:block w-px h-5 mx-1 ${dividerColor}`}
              />

              {/* User / Auth */}
              {auth.user ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`hidden sm:flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-sm transition-all duration-150 ${userBtnBg}`}
                  >
                    {/* Avatar */}
                    <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px] bg-indigo-600 text-[11px] font-semibold text-white flex-shrink-0">
                      {auth.user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[80px] truncate text-[13px] font-medium">
                      {auth.user.name}
                    </span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-150 ${
                        userMenuOpen ? "rotate-180" : ""
                      } ${transparent ? "text-white/50" : "text-slate-400"}`}
                    />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.13, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white border border-slate-200/80 overflow-hidden z-50"
                        style={{
                          boxShadow:
                            "0 8px 24px -4px rgba(0,0,0,0.08), 0 2px 8px -2px rgba(0,0,0,0.04)",
                        }}
                      >
                        {/* Header */}
                        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
                          <div className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-indigo-600 text-sm font-semibold text-white flex-shrink-0">
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

                        {/* Items */}
                        <div className="py-1.5">
                          <Link
                            href={`/${locale}/profile`}
                            className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                          >
                            <User className="h-[15px] w-[15px] text-slate-400 flex-shrink-0" />
                            {dict.settings.profile}
                          </Link>
                          <Link
                            href={`/${locale}/orders`}
                            className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                          >
                            <Package className="h-[15px] w-[15px] text-slate-400 flex-shrink-0" />
                            {dict.checkout.myOrders}
                          </Link>
                          <Link
                            href={`/${locale}/settings`}
                            className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                          >
                            <Settings className="h-[15px] w-[15px] text-slate-400 flex-shrink-0" />
                            {dict.settings.title}
                          </Link>

                          <div className="h-px bg-slate-100 mx-2 my-1" />

                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <LogOut className="h-[15px] w-[15px] flex-shrink-0" />
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
                  className={`hidden sm:flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium transition-all duration-150 ${authBtn}`}
                >
                  <User
                    className={`h-4 w-4 ${transparent ? "text-white/60" : "text-slate-400"}`}
                  />
                  {dict.auth.login}
                </Link>
              )}

              {/* Wishlist */}
              <Link
                href={`/${locale}/wishlist`}
                className={`relative flex items-center justify-center rounded-[9px] p-2 transition-colors duration-150 ${iconBtn}`}
              >
                <Bookmark className="h-[18px] w-[18px]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-px -right-px flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white border-2 border-white px-[3px]">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href={`/${locale}/cart`}
                className={`relative flex items-center justify-center rounded-[9px] p-2 transition-colors duration-150 ${iconBtn}`}
              >
                <ShoppingCart className="h-[18px] w-[18px]" />
                {cartCount > 0 && (
                  <span className="absolute -top-px -right-px flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-indigo-600 text-[10px] font-semibold text-white border-2 border-white px-[3px]">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                className={`lg:hidden rounded-[9px] p-2 transition-colors duration-150 ${iconBtn}`}
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? (
                  <X className="h-[18px] w-[18px]" />
                ) : (
                  <Menu className="h-[18px] w-[18px]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed inset-x-0 top-16 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/70 lg:hidden overflow-hidden"
            style={{ boxShadow: "0 8px 24px -4px rgba(0,0,0,0.06)" }}
          >
            <nav className="flex flex-col p-3 gap-0.5 max-w-7xl mx-auto">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== `/${locale}` &&
                    pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-xl px-4 py-2.5 text-[13.5px] transition-colors ${
                      isActive
                        ? "text-indigo-600 bg-indigo-50 font-medium"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="h-px bg-slate-100 my-1 mx-1" />

              <Link
                href={`/${locale}/wishlist`}
                className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-[13.5px] text-slate-700 hover:bg-slate-50"
              >
                <Bookmark className="h-4 w-4 text-slate-400" />
                {dict.wishlist.title}
                {wishlistCount > 0 && (
                  <span className="ml-auto text-xs text-red-500 font-semibold bg-red-50 px-2 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {auth.user ? (
                <>
                  {/* Mobile user header */}
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 mx-0.5 mb-1">
                    <div className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-indigo-600 text-sm font-semibold text-white flex-shrink-0">
                      {auth.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[13.5px] font-semibold text-slate-900">
                        {auth.user.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {auth.user.phoneNumber}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/${locale}/profile`}
                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-[13.5px] text-slate-700 hover:bg-slate-50"
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    {dict.settings.profile}
                  </Link>
                  <Link
                    href={`/${locale}/orders`}
                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-[13.5px] text-slate-700 hover:bg-slate-50"
                  >
                    <Package className="h-4 w-4 text-slate-400" />
                    {dict.checkout.myOrders}
                  </Link>
                  <Link
                    href={`/${locale}/settings`}
                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-[13.5px] text-slate-700 hover:bg-slate-50"
                  >
                    <Settings className="h-4 w-4 text-slate-400" />
                    {dict.settings.title}
                  </Link>

                  <div className="h-px bg-slate-100 my-1 mx-1" />

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-[13.5px] text-red-500 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    {dict.auth.logout}
                  </button>
                </>
              ) : (
                <Link
                  href={`/${locale}/auth`}
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-[13.5px] font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  <User className="h-4 w-4" />
                  {dict.auth.login}
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
