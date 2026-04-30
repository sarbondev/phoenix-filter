'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { Locale, Category } from '@/shared/types';
import type { Dictionary } from '@/shared/i18n/dictionaries/en';
import { useGetProductsQuery } from '@/store/api/productApi';
import { useGetCategoriesQuery } from '@/store/api/categoryApi';
import { ProductCard } from '@/entities/product/ProductCard';
import { ProductCardSkeleton, Input, Button } from '@/shared/ui';
import { t } from '@/shared/lib/utils';
import { useQueryParams } from '@/shared/hooks';
import { ProductRequestForm } from '@/features/product-request/ProductRequestForm';

interface Props { locale: Locale; dict: Dictionary }

export function ProductsPageClient({ locale, dict }: Props) {
  const { params, setParams } = useQueryParams();
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const page = Number(params.page) || 1;
  const search = params.search ?? '';
  const category = params.category ?? '';
  const sortBy = params.sortBy ?? 'createdAt';
  const sortOrder = params.sortOrder ?? 'desc';

  const { data, isLoading } = useGetProductsQuery({
    page, limit: 12,
    search: search || undefined,
    category: category || undefined,
    sortBy, sortOrder,
  });
  const { data: categories } = useGetCategoriesQuery();

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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">{dict.products.title}</h1>
      </motion.div>

      <div className="flex gap-8">
        {/* ── Left Sidebar (desktop) ── */}
        <aside className="hidden lg:block w-64 shrink-0">
          <CategorySidebar
            categories={categories ?? []}
            selected={category}
            locale={locale}
            dict={dict}
            onSelect={selectCategory}
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
                value={search}
                onChange={(e) => { setParams({ search: e.target.value || undefined, page: undefined }); }}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => handleSort(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {/* Mobile filter toggle */}
              <button
                className="lg:hidden flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={() => setMobileSidebar(true)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                {dict.products.filters}
              </button>
            </div>
          </div>

          {/* Active category chip */}
          {selectedCat && (
            <div className="flex items-center gap-2 mb-5">
              <span className="text-sm text-slate-500">{dict.categories.title}:</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium">
                {t(selectedCat.name, locale)}
                <button onClick={() => selectCategory('')} className="hover:bg-primary/20 rounded-full p-0.5 transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </span>
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
            <div className="mt-12 flex items-center justify-center gap-3">
              <Button variant="outline" disabled={page <= 1} onClick={() => setParams({ page: String(page - 1) })}><ChevronLeft className="h-4 w-4" /></Button>
              <span className="text-sm text-slate-500">{page} / {meta.totalPages}</span>
              <Button variant="outline" disabled={page >= meta.totalPages} onClick={() => setParams({ page: String(page + 1) })}><ChevronRight className="h-4 w-4" /></Button>
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
              <div className="p-4">
                <CategorySidebar
                  categories={categories ?? []}
                  selected={category}
                  locale={locale}
                  dict={dict}
                  onSelect={selectCategory}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Category Sidebar                                                  */
/* ═══════════════════════════════════════════════════════════════════ */

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
          !selected ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        {dict.categories.all}
      </button>

      {/* Category tree */}
      {roots.map((cat) => (
        <CategoryItem
          key={cat.id}
          category={cat}
          children={childrenMap.get(cat.id)}
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
  children,
  selected,
  locale,
  onSelect,
}: {
  category: Category;
  children?: Category[];
  selected: string;
  locale: Locale;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(selected === category.id || !!children?.some((c) => c.id === selected));
  const hasChildren = children && children.length > 0;
  const isActive = selected === category.id;

  return (
    <div>
      <div className="flex items-center">
        <button
          onClick={() => onSelect(category.id)}
          className={`flex-1 text-left rounded-lg px-3 py-2 text-sm transition-colors ${
            isActive ? 'bg-primary/10 text-primary font-medium' : 'text-slate-600 hover:bg-slate-50'
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
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => onSelect(child.id)}
              className={`w-full text-left rounded-lg px-3 py-1.5 text-[13px] transition-colors ${
                selected === child.id ? 'bg-primary/10 text-primary font-medium' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
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
