"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingCart,
  Bookmark,
  Menu,
  X,
  User,
  LogOut,
  Package,
  Settings,
  LayoutGrid,
} from "lucide-react";
import type { Locale } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";
import { useAppSelector, useAppDispatch } from "@/shared/hooks";
import { clearAuth } from "@/store/authSlice";
import { CatalogMenu } from "./CatalogMenu";
import { SmartSearch } from "@/features/smart-search/SmartSearch";

interface NavbarProps {
  locale: Locale;
  dict: Dictionary;
}

export function Navbar({ locale, dict }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((s) => s.cart.items);
  const wishlistCount = useAppSelector((s) => s.wishlist.ids.length);
  const auth = useAppSelector((s) => s.auth);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/products`, label: dict.nav.products },
    { href: `/${locale}/categories`, label: dict.nav.categories },
    { href: `/${locale}/blog`, label: dict.blog.title },
  ];

  const handleLogout = () => {
    dispatch(clearAuth());
  };

  return (
    <>
      <div className="bg-white border-b border-slate-200/70 shadow-sm shadow-slate-100/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-3 lg:gap-5">
            {/* Logo */}
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

            {/* Catalog (desktop only) */}
            <div className="hidden lg:block">
              <CatalogMenu locale={locale} dict={dict} />
            </div>

            {/* Search */}
            <SmartSearch
              locale={locale}
              dict={dict}
              className="flex-1 max-w-2xl hidden md:block"
            />

            {/* Spacer pushes right cluster on mobile */}
            <div className="flex-1 md:hidden" />

            {/* Right cluster */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Wishlist */}
              <Link
                href={`/${locale}/wishlist`}
                className="relative flex items-center justify-center rounded-[9px] p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                aria-label={dict.wishlist.title}
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
                className="relative flex items-center justify-center rounded-[9px] p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                aria-label={dict.cart.title}
              >
                <ShoppingCart className="h-[18px] w-[18px]" />
                {cartCount > 0 && (
                  <span className="absolute -top-px -right-px flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-indigo-600 text-[10px] font-semibold text-white border-2 border-white px-[3px]">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden rounded-[9px] p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? (
                  <X className="h-[18px] w-[18px]" />
                ) : (
                  <Menu className="h-[18px] w-[18px]" />
                )}
              </button>
            </div>
          </div>

          {/* Secondary nav row (desktop) */}
          <div className="hidden lg:flex items-center gap-1 h-10 -mt-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== `/${locale}` && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 text-[13px] rounded-lg transition-colors ${
                    isActive
                      ? "text-indigo-600 bg-indigo-50 font-semibold"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile search row */}
        <div className="md:hidden px-4 pb-3 pt-1">
          <SmartSearch locale={locale} dict={dict} />
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="bg-white/95 backdrop-blur-xl border-b border-slate-200/70 lg:hidden overflow-hidden"
            style={{
              boxShadow: "0 8px 24px -4px rgba(0,0,0,0.06)",
            }}
          >
            <nav className="flex flex-col p-3 gap-0.5 max-w-7xl mx-auto">
              <Link
                href={`/${locale}/categories`}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-[13.5px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <LayoutGrid className="h-4 w-4" />
                {dict.nav.catalog}
              </Link>

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
