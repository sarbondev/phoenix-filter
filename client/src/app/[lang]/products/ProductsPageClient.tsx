'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { Locale, Category } from '@/shared/types';
import type { Dictionary } from '@/shared/i18n/dictionaries/en';
import { useGetProductsQuery } from '@/store/api/productApi';
import { useGetCategoriesQuery } from '@/store/api/categoryApi';
import { ProductCard } from '@/entities/product/ProductCard';
import { ProductCardSkeleton, Input } from '@/shared/ui';
import { t } from '@/shared/lib/utils';
import { useQueryParams, useDebounce } from '@/shared/hooks';
import { ProductRequestForm } from '@/features/product-request/ProductRequestForm';

interface Props { locale: Locale; dict: Dictionary }

export function ProductsPageClient({ locale, dict }: Props) {
  const { params, setParams } = useQueryParams();
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const page = Number(params.page) || 1;
  const urlSearch = params.search ?? '';
  // Local input mirror so typing stays snappy; debounce → URL → query.
  const [searchInput, setSearchInput] = useState(urlSearch);
  const debouncedSearch = useDebounce(searchInput, 300);
  useEffect(() => {
    if (debouncedSearch === urlSearch) return;
    setParams({ search: debouncedSearch || undefined, page: undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);
  // Keep input in sync if URL changes externally (e.g. clear-all).
  useEffect(() => {
    if (urlSearch !== searchInput) setSearchInput(urlSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSearch]);
  const search = debouncedSearch;
  const categoryParam = params.category ?? '';
  const categorySlug = params.categorySlug ?? '';
  const manufacturer = params.manufacturer ?? '';
  const sortBy = params.sortBy ?? 'createdAt';
  const sortOrder = params.sortOrder ?? 'desc';

  const { data: categories } = useGetCategoriesQuery();
  // Allow URL to pass either ?category=<id> or ?categorySlug=<slug>; resolve slug → id.
  const category = categoryParam || (categorySlug
    ? categories?.find((c) => c.slug === categorySlug)?.id ?? ''
    : '');

  const { data, isLoading } = useGetProductsQuery({
    page, limit: 12,
    search: search || undefined,
    category: category || undefined,
    manufacturer: manufacturer || undefined,
    sortBy, sortOrder,
  });

  const products = data?.data ?? [];
  const meta = data?.meta;

  const sortOptions = [
    { value: 'createdAt-desc', label: dict.products.newest },
    { value: 'views-desc', label: dict.products.popular },
    { value: 'price-asc', label: dict.products.priceLowHigh },
    { value: 'price-desc', label: dict.products.priceHighLow },
  ];

  const handleSort = (value: string) => {
    const [by, order] = value.split('-');
    setParams({ sortBy: by, sortOrder: order, page: undefined });
  };

  const selectCategory = (id: string) => {
    setParams({ category: id || undefined, page: undefined });
    setMobileSidebar(false);
  };

  const selectedCat = categories?.find((c) => c.id === category);

  const activeFilterCount =
    (search ? 1 : 0) + (category ? 1 : 0) + (manufacturer ? 1 : 0);

  const clearAll = () => {
    setSearchInput('');
    setParams({
      search: undefined,
      category: undefined,
      categorySlug: undefined,
      manufacturer: undefined,
      page: undefined,
    });
  };

  // Build a compact numbered pagination: first, last, current ± 1, ellipsis fillers.
  const buildPageList = (current: number, total: number): (number | '…')[] => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = new Set<number>([1, total, current, current - 1, current + 1]);
    const sorted = Array.from(pages).filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
    const out: (number | '…')[] = [];
    for (let i = 0; i < sorted.length; i++) {
      out.push(sorted[i]);
      if (i < sorted.length - 1 && sorted[i + 1] - sorted[i] > 1) out.push('…');
    }
    return out;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="section-title text-2xl sm:text-3xl text-slate-900">{dict.products.title}</h1>
      </motion.div>

      <div className="flex gap-8">
        {/* ── Left Sidebar (desktop) ── */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6">
          <CategorySidebar
            categories={categories ?? []}
            selected={category}
            locale={locale}
            dict={dict}
            onSelect={selectCategory}
          />
          <ManufacturerFilter
            selected={manufacturer}
            dict={dict}
            onSelect={(m) => setParams({ manufacturer: m || undefined, page: undefined })}
          />
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">
          {/* Search & Sort bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1">
              <Input
                icon={<Search className="h-4 w-4" />}
                placeholder={dict.nav.search}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => handleSort(e.target.value)}
                className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-slate-900 focus:border-[var(--color-brand)] focus:outline-none"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {/* Mobile filter toggle */}
              <button
                className="lg:hidden flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={() => setMobileSidebar(true)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                {dict.products.filters}
                {activeFilterCount > 0 && (
                  <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--color-brand)] px-1.5 text-[10.5px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active filter chips + clear-all */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {selectedCat && (
                <FilterChip
                  label={t(selectedCat.name, locale)}
                  onRemove={() => selectCategory('')}
                />
              )}
              {manufacturer && (
                <FilterChip
                  label={manufacturer}
                  onRemove={() => setParams({ manufacturer: undefined, page: undefined })}
                />
              )}
              {search && (
                <FilterChip
                  label={`"${search}"`}
                  onRemove={() => setSearchInput('')}
                />
              )}
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[var(--color-brand)] transition-colors ml-1"
              >
                {dict.products.clearFilters}
              </button>
            </div>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {isLoading
              ? Array.from({ length: 9 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : products.length === 0
              ? (
                <div className="col-span-full">
                  <div className="py-12 text-center">
                    <p className="text-lg text-slate-500">{dict.products.noProducts}</p>
                    {search && (
                      <p className="mt-1 text-sm text-slate-400">&ldquo;{search}&rdquo;</p>
                    )}
                  </div>
                  <div id="request" className="max-w-2xl mx-auto">
                    <ProductRequestForm
                      locale={locale}
                      dict={dict}
                      searchQuery={search}
                    />
                  </div>
                </div>
              )
              : products.map((product, i) => (
                <ProductCard key={product.id} product={product} locale={locale} dict={dict} index={i} />
              ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setParams({ page: page - 1 > 1 ? String(page - 1) : undefined })}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {buildPageList(page, meta.totalPages).map((p, idx) =>
                p === '…' ? (
                  <span key={`e${idx}`} className="px-2 text-sm text-slate-400">…</span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setParams({ page: p > 1 ? String(p) : undefined })}
                    aria-current={p === page ? 'page' : undefined}
                    className={`min-w-9 h-9 px-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      p === page
                        ? 'bg-[var(--color-brand)] text-white'
                        : 'border border-slate-200 bg-white text-slate-600 hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]'
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
              <button
                type="button"
                disabled={page >= meta.totalPages}
                onClick={() => setParams({ page: String(page + 1) })}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile sidebar overlay ── */}
      <AnimatePresence>
        {mobileSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setMobileSidebar(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">{dict.products.filters}</h2>
                <button onClick={() => setMobileSidebar(false)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>
              <div className="p-4 space-y-6">
                <CategorySidebar
                  categories={categories ?? []}
                  selected={category}
                  locale={locale}
                  dict={dict}
                  onSelect={selectCategory}
                />
                <ManufacturerFilter
                  selected={manufacturer}
                  dict={dict}
                  onSelect={(m) => {
                    setParams({ manufacturer: m || undefined, page: undefined });
                    setMobileSidebar(false);
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-brand-soft)] text-[var(--color-brand)] px-3 py-1 text-sm font-medium">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove filter"
        className="hover:bg-[var(--color-brand)]/20 rounded-full p-0.5 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Category Sidebar                                                  */
/* ═══════════════════════════════════════════════════════════════════ */

// Most-frequent cross-reference manufacturers in the Phoenix catalogue
// (top 12 by occurrence — these cover the vast majority of customer searches).
const TOP_MANUFACTURERS = [
  'MANN', 'MAHLE', 'HENGST', 'FRAM', 'WIX', 'BALDWIN',
  'PUROLATOR', 'KNECHT', 'DONALDSON', 'FLEETGUARD', 'LUBER-FINER', 'SAKURA',
];

function ManufacturerFilter({
  selected,
  dict,
  onSelect,
}: {
  selected: string;
  dict: Dictionary;
  onSelect: (m: string) => void;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
        {dict.products.manufacturerFilter}
      </h3>
      <button
        onClick={() => onSelect('')}
        className={`w-full text-left rounded-lg px-3 py-2 text-sm font-medium transition-colors mb-1 ${
          !selected ? 'bg-[var(--color-brand-soft)] text-[var(--color-brand)]' : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        {dict.products.allManufacturers}
      </button>
      <div className="grid grid-cols-2 gap-1">
        {TOP_MANUFACTURERS.map((m) => {
          const active = selected.toUpperCase() === m;
          return (
            <button
              key={m}
              onClick={() => onSelect(active ? '' : m)}
              className={`text-left rounded-lg px-3 py-1.5 text-[12.5px] font-mono transition-colors ${
                active
                  ? 'bg-[var(--color-brand-soft)] text-[var(--color-brand)] font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {m}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CategorySidebar({
  categories,
  selected,
  locale,
  dict,
  onSelect,
}: {
  categories: Category[];
  selected: string;
  locale: Locale;
  dict: Dictionary;
  onSelect: (id: string) => void;
}) {
  // Build parent → children map
  const roots = categories.filter((c) => !c.parent && c.isActive);
  const childrenMap = new Map<string, Category[]>();
  for (const cat of categories) {
    if (cat.parent && cat.isActive) {
      const list = childrenMap.get(cat.parent) ?? [];
      list.push(cat);
      childrenMap.set(cat.parent, list);
    }
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
        {dict.categories.title}
      </h3>

      {/* All */}
      <button
        onClick={() => onSelect('')}
        className={`w-full text-left rounded-lg px-3 py-2 text-sm font-medium transition-colors mb-1 ${
          !selected ? 'bg-[var(--color-brand-soft)] text-[var(--color-brand)]' : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        {dict.categories.all}
      </button>

      {/* Category tree */}
      {roots.map((cat) => (
        <CategoryItem
          key={cat.id}
          category={cat}
          subItems={childrenMap.get(cat.id)}
          selected={selected}
          locale={locale}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function CategoryItem({
  category,
  subItems,
  selected,
  locale,
  onSelect,
}: {
  category: Category;
  subItems?: Category[];
  selected: string;
  locale: Locale;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(selected === category.id || !!subItems?.some((c) => c.id === selected));
  const hasChildren = subItems && subItems.length > 0;
  const isActive = selected === category.id;

  return (
    <div>
      <div className="flex items-center">
        <button
          onClick={() => onSelect(category.id)}
          className={`flex-1 text-left rounded-lg px-3 py-2 text-sm transition-colors ${
            isActive ? 'bg-[var(--color-brand-soft)] text-[var(--color-brand)] font-medium' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          {t(category.name, locale)}
        </button>
        {hasChildren && (
          <button
            onClick={() => setOpen(!open)}
            className="p-1.5 rounded-md hover:bg-slate-100 transition-colors"
          >
            <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {hasChildren && open && (
        <div className="ml-3 pl-3 border-l border-slate-100">
          {subItems!.map((child) => (
            <button
              key={child.id}
              onClick={() => onSelect(child.id)}
              className={`w-full text-left rounded-lg px-3 py-1.5 text-[13px] transition-colors ${
                selected === child.id ? 'bg-[var(--color-brand-soft)] text-[var(--color-brand)] font-medium' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              {t(child.name, locale)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
