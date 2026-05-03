'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, FolderTree } from 'lucide-react';
import Link from 'next/link';
import type { Category, Locale } from '@/shared/types';
import type { Dictionary } from '@/shared/i18n/dictionaries/en';
import { useGetCategoriesQuery, useGetCategoryBySlugQuery } from '@/store/api/categoryApi';
import { useGetProductsQuery } from '@/store/api/productApi';
import { ProductCard } from '@/entities/product/ProductCard';
import { ProductCardSkeleton, Skeleton, Button, Breadcrumbs } from '@/shared/ui';
import type { BreadcrumbItem } from '@/shared/ui';
import { t, getImageUrl } from '@/shared/lib/utils';
import { useQueryParams } from '@/shared/hooks';

interface Props { locale: Locale; dict: Dictionary; slug: string }

export function CategoryProductsClient({ locale, dict, slug }: Props) {
  const { data: category } = useGetCategoryBySlugQuery(slug);
  const { data: allCategories } = useGetCategoriesQuery();
  const { params, setParams } = useQueryParams();

  const children = (allCategories ?? []).filter((c) => c.parent === category?.id);
  const isParent = children.length > 0;

  const crumbs: BreadcrumbItem[] = [
    { label: dict.categories.title, href: `/${locale}/categories` },
  ];
  if (category?.parent) {
    const parent = (allCategories ?? []).find((c) => c.id === category.parent);
    if (parent) crumbs.push({ label: t(parent.name, locale), href: `/${locale}/categories/${parent.slug}` });
  }
  if (category) crumbs.push({ label: t(category.name, locale) });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={crumbs} homeHref={`/${locale}`} className="mb-6" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        {category ? (
          <>
            <h1 className="text-3xl font-bold text-slate-900">{t(category.name, locale)}</h1>
            <p className="mt-2 text-slate-500">{t(category.description, locale)}</p>
          </>
        ) : (
          <>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </>
        )}
      </motion.div>

      {isParent ? (
        <SubcategoryGrid children_={children} locale={locale} dict={dict} />
      ) : !category?.parent && category?.slug === 'maishiy' ? (
        <ComingSoonState locale={locale} dict={dict} />
      ) : (
        <ProductsGrid
          categoryId={category?.id}
          locale={locale}
          dict={dict}
          params={params}
          setParams={setParams}
        />
      )}
    </div>
  );
}

function ComingSoonState({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-gradient-to-br from-[var(--color-brand-soft)] to-white border border-[var(--color-brand)]/15 p-10 sm:p-16 text-center"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-brand)]/10 text-[var(--color-brand)] mb-6">
        <FolderTree className="h-8 w-8" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
        {dict.categories.comingSoonTitle}
      </h2>
      <p className="mx-auto max-w-lg text-[14px] text-slate-600 leading-relaxed mb-6">
        {dict.categories.comingSoonText}
      </p>
      <Link
        href={`/${locale}/categories/avto`}
        className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] px-5 py-3 text-[14px] font-semibold text-white transition-colors"
      >
        {dict.categories.browseAvto}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.div>
  );
}

function SubcategoryGrid({
  children_,
  locale,
  dict,
}: {
  children_: Category[];
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {children_.map((cat, i) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
        >
          <Link
            href={`/${locale}/categories/${cat.slug}`}
            className="group relative block overflow-hidden rounded-2xl h-48 bg-slate-100"
          >
            {cat.image ? (
              <>
                <Image
                  src={getImageUrl(cat.image)}
                  alt={t(cat.name, locale)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-opacity" />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                <FolderTree className="h-12 w-12 text-slate-300" />
              </div>
            )}
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <h3 className="text-base font-bold text-white leading-snug line-clamp-2 drop-shadow-lg">
                {t(cat.name, locale)}
              </h3>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-white/70 group-hover:text-white transition-colors">
                {dict.common.viewDetails}
                <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

function ProductsGrid({
  categoryId,
  locale,
  dict,
  params,
  setParams,
}: {
  categoryId?: string;
  locale: Locale;
  dict: Dictionary;
  params: Record<string, string | undefined>;
  setParams: (next: Record<string, string | undefined>) => void;
}) {
  const page = Number(params.page) || 1;
  const sortBy = params.sortBy || 'createdAt';
  const sortOrder = params.sortOrder || 'desc';

  const { data, isLoading } = useGetProductsQuery(
    { page, limit: 12, category: categoryId, sortBy, sortOrder },
    { skip: !categoryId },
  );

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
    setParams({ sortBy: by, sortOrder: order, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    setParams({ page: String(newPage) });
  };

  return (
    <>
      <div className="flex justify-end mb-6">
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => handleSort(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.length === 0
          ? <p className="col-span-full text-center py-20 text-slate-500">{dict.products.noProducts}</p>
          : products.map((product, i) => (
            <ProductCard key={product.id} product={product} locale={locale} dict={dict} index={i} />
          ))}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-3">
          <Button variant="outline" disabled={page <= 1} onClick={() => handlePageChange(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-sm text-slate-500">{page} / {meta.totalPages}</span>
          <Button variant="outline" disabled={page >= meta.totalPages} onClick={() => handlePageChange(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      )}
    </>
  );
}
