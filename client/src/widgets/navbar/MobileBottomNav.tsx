"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, LayoutGrid, Bookmark, ShoppingCart, User } from "lucide-react";
import type { Locale } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";
import { useAppSelector } from "@/shared/hooks";

interface Props {
  locale: Locale;
  dict: Dictionary;
}

export function MobileBottomNav({ locale, dict }: Props) {
  const pathname = usePathname();
  const wishlistCount = useAppSelector((s) => s.wishlist.ids.length);
  const cartItems = useAppSelector((s) => s.cart.items);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const auth = useAppSelector((s) => s.auth);

  const items = [
    {
      href: `/${locale}`,
      icon: Home,
      label: dict.nav.home,
      match: (p: string) => p === `/${locale}` || p === `/${locale}/`,
    },
    {
      href: `/${locale}/yonalish`,
      icon: LayoutGrid,
      label: dict.nav.catalog,
      match: (p: string) =>
        p.startsWith(`/${locale}/yonalish`) ||
        p.startsWith(`/${locale}/products`),
    },
    {
      href: `/${locale}/cart`,
      icon: ShoppingCart,
      label: dict.cart.title,
      badge: cartCount,
      badgeColor: "brand" as "brand" | "accent",
      match: (p: string) => p.startsWith(`/${locale}/cart`),
      elevated: true,
    },
    {
      href: `/${locale}/wishlist`,
      icon: Bookmark,
      label: dict.wishlist.title,
      badge: wishlistCount,
      badgeColor: "accent" as "brand" | "accent",
      match: (p: string) => p.startsWith(`/${locale}/wishlist`),
    },
    {
      href: auth.user ? `/${locale}/profile` : `/${locale}/auth`,
      icon: User,
      label: auth.user ? dict.settings.profile : dict.auth.login,
      match: (p: string) =>
        p.startsWith(`/${locale}/profile`) ||
        p.startsWith(`/${locale}/auth`) ||
        p.startsWith(`/${locale}/settings`),
    },
  ];

  return (
    <nav
      aria-label="Bottom navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[var(--color-border)] pb-[env(safe-area-inset-bottom)]"
      style={{
        boxShadow: "0 -4px 20px -4px rgba(15, 23, 41, 0.08)",
      }}
    >
      <ul className="flex items-stretch justify-around relative">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.match(pathname);
          const showBadge = "badge" in item && (item.badge ?? 0) > 0;

          if (item.elevated) {
            return (
              <li key={item.href} className="flex-1 relative">
                <Link
                  href={item.href}
                  className="flex flex-col items-center justify-end pt-1 pb-1.5 h-16 group"
                  aria-label={item.label}
                >
                  <span
                    className={`absolute -top-5 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200 ${
                      isActive
                        ? "bg-[var(--color-brand-strong)] scale-105"
                        : "bg-[var(--color-brand)] group-active:scale-95"
                    }`}
                    style={{
                      boxShadow:
                        "0 6px 16px -4px rgba(31, 77, 255, 0.45), 0 0 0 4px white",
                    }}
                  >
                    <Icon className="h-5 w-5 text-white" strokeWidth={2.4} />
                    {showBadge && (
                      <span
                        className={`absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold text-white border-2 border-white ${
                          item.badgeColor === "accent"
                            ? "bg-[var(--color-accent)]"
                            : "bg-[var(--color-ink)]"
                        }`}
                      >
                        {(item.badge ?? 0) > 9 ? "9+" : item.badge}
                      </span>
                    )}
                  </span>
                  <span
                    className={`mt-9 text-[10.5px] font-semibold transition-colors ${
                      isActive
                        ? "text-[var(--color-brand)]"
                        : "text-slate-500"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          }

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-label={item.label}
                className="relative flex flex-col items-center justify-center gap-0.5 h-16 active:bg-slate-50 transition-colors"
              >
                <span className="relative">
                  <Icon
                    className={`h-[22px] w-[22px] transition-colors ${
                      isActive
                        ? "text-[var(--color-brand)]"
                        : "text-slate-500"
                    }`}
                    strokeWidth={isActive ? 2.4 : 2}
                  />
                  {showBadge && (
                    <span
                      className={`absolute -top-1.5 -right-2 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[9.5px] font-bold text-white ${
                        item.badgeColor === "accent"
                          ? "bg-[var(--color-accent)]"
                          : "bg-[var(--color-brand)]"
                      }`}
                    >
                      {(item.badge ?? 0) > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </span>
                <span
                  className={`text-[10.5px] font-semibold transition-colors ${
                    isActive
                      ? "text-[var(--color-brand)]"
                      : "text-slate-500"
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="bottom-nav-indicator"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-8 rounded-b-full bg-[var(--color-brand)]"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
