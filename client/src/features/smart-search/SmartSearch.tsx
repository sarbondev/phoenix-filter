"use client";

import {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  ArrowRight,
  Loader2,
  PackageX,
  PackageSearch,
} from "lucide-react";
import type { Locale, Product } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";
import { useGetProductsQuery } from "@/store/api/productApi";
import { useDebounce } from "@/shared/hooks";
import {
  t,
  formatPrice,
  getImageUrl,
  getDiscountPercent,
} from "@/shared/lib/utils";

interface SmartSearchProps {
  locale: Locale;
  dict: Dictionary;
  className?: string;
  autoFocus?: boolean;
}

const RESULT_LIMIT = 7;

export function SmartSearch({
  locale,
  dict,
  className = "",
  autoFocus = false,
}: SmartSearchProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounced = useDebounce(value.trim(), 250);

  const shouldQuery = debounced.length >= 2;
  const { data, isFetching } = useGetProductsQuery(
    shouldQuery
      ? { search: debounced, limit: RESULT_LIMIT, page: 1 }
      : (undefined as unknown as void),
    { skip: !shouldQuery },
  );
  const results: Product[] = shouldQuery ? (data?.data ?? []) : [];

  const totalCount = data?.meta?.total ?? 0;
  const showDropdown = open && shouldQuery;

  /* close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      )
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* reset highlight when query/results change */
  useEffect(() => {
    setActiveIndex(-1);
  }, [debounced, results.length]);

  /* keep active item visible */
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const node = listRef.current.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`,
    );
    node?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const goToResults = (q: string) => {
    if (!q) return;
    router.push(`/${locale}/products?search=${encodeURIComponent(q)}`);
    setOpen(false);
    inputRef.current?.blur();
  };

  const goToProduct = (p: Product) => {
    router.push(`/${locale}/products/${p.slug}`);
    setOpen(false);
    setValue("");
    inputRef.current?.blur();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && activeIndex < results.length) {
      goToProduct(results[activeIndex]);
    } else {
      goToResults(value.trim());
    }
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;
    /* total navigable items: results + 1 view-all */
    const total = results.length + (results.length > 0 ? 1 : 0);
    if (total === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % total);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? total - 1 : i - 1));
    } else if (e.key === "Enter") {
      if (activeIndex === results.length) {
        e.preventDefault();
        goToResults(value.trim());
      }
      /* product enter handled by handleSubmit */
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[var(--color-brand-soft)]0 transition-colors" />
          <input
            ref={inputRef}
            type="text"
            value={value}
            autoFocus={autoFocus}
            onChange={(e) => {
              setValue(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKey}
            placeholder={dict.nav.search}
            className="w-full h-10 pl-10 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-[13.5px] text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/10 transition-all"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showDropdown}
            aria-controls="smart-search-list"
          />
          {value && (
            <button
              type="button"
              onClick={() => {
                setValue("");
                setOpen(false);
                inputRef.current?.focus();
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Clear"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          {isFetching && (
            <Loader2 className="absolute right-9 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 animate-spin" />
          )}
        </div>
      </form>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.13 }}
            id="smart-search-list"
            role="listbox"
            ref={listRef}
            className="absolute left-0 right-0 top-full mt-2 max-h-[460px] overflow-y-auto rounded-2xl bg-white border border-slate-200/80 z-50"
            style={{
              boxShadow:
                "0 16px 40px -8px rgba(0,0,0,0.12), 0 4px 12px -4px rgba(0,0,0,0.06)",
            }}
          >
            {results.length === 0 && !isFetching && (
              <div className="py-6 px-5 text-center">
                <div className="flex justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <PackageX className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-700">
                  {dict.nav.noResults}
                </p>
                <p className="mt-0.5 text-[12.5px] text-slate-400">
                  &ldquo;{debounced}&rdquo;
                </p>
                <Link
                  href={`/${locale}?request=${encodeURIComponent(debounced)}#product-request`}
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brand-soft)] px-3 py-2 text-[12.5px] font-semibold text-[var(--color-brand)] hover:bg-[var(--color-brand)]/10 transition-colors"
                >
                  <PackageSearch className="h-3.5 w-3.5" />
                  {dict.productRequest.bannerCta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}

            {results.length > 0 && (
              <>
                <div className="py-1.5">
                  {results.map((product, i) => {
                    const isActive = i === activeIndex;
                    const discount = getDiscountPercent(
                      product.price,
                      product.discountPrice,
                    );
                    const price = product.discountPrice ?? product.price;
                    return (
                      <button
                        key={product.id}
                        data-index={i}
                        role="option"
                        aria-selected={isActive}
                        onMouseEnter={() => setActiveIndex(i)}
                        onClick={() => goToProduct(product)}
                        className={`group flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                          isActive ? "bg-[var(--color-brand-soft)]" : "hover:bg-slate-50"
                        }`}
                      >
                        {/* Image */}
                        <div className="relative h-11 w-11 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                          {product.images[0] ? (
                            <Image
                              src={getImageUrl(product.images[0])}
                              alt={t(product.name, locale)}
                              fill
                              className="object-cover"
                              sizes="44px"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-300">
                              <Search className="h-4 w-4" />
                            </div>
                          )}
                        </div>

                        {/* Name + category */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-[13.5px] font-medium truncate ${
                              isActive ? "text-[var(--color-brand-strong)]" : "text-slate-800"
                            }`}
                          >
                            {t(product.name, locale)}
                          </p>
                          <p className="text-[11.5px] text-slate-400 truncate mt-0.5">
                            {typeof product.category === "object" &&
                            product.category?.name
                              ? t(product.category.name, locale)
                              : product.sku}
                          </p>
                        </div>

                        {/* Price */}
                        <div className="text-right flex-shrink-0">
                          <p className="text-[13px] font-semibold text-slate-900 whitespace-nowrap">
                            {formatPrice(price)}{" "}
                            <span className="text-[10.5px] font-normal text-slate-400">
                              {dict.common.currency}
                            </span>
                          </p>
                          {discount > 0 && (
                            <p className="text-[11px] text-slate-400 line-through">
                              {formatPrice(product.price)}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* View all */}
                <button
                  data-index={results.length}
                  onMouseEnter={() => setActiveIndex(results.length)}
                  onClick={() => goToResults(debounced)}
                  className={`group flex w-full items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 transition-colors ${
                    activeIndex === results.length
                      ? "bg-[var(--color-brand)] text-white"
                      : "text-[var(--color-brand)] hover:bg-[var(--color-brand-soft)]"
                  }`}
                >
                  <span className="text-[13px] font-semibold">
                    {dict.nav.viewAllResults}
                    {totalCount > 0 && (
                      <span
                        className={`ml-2 text-[12px] font-normal ${
                          activeIndex === results.length
                            ? "text-white/80"
                            : "text-slate-400"
                        }`}
                      >
                        ({totalCount})
                      </span>
                    )}
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
