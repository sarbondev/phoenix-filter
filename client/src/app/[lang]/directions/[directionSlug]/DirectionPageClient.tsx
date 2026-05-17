'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, FolderTree } from 'lucide-react';
import Link from 'next/link';
import type { Locale } from '@/shared/types';
import type { Dictionary } from '@/shared/i18n/dictionaries/en';
import { useGetDirectionBySlugQuery } from '@/store/api/directionApi';
import { useGetCategoriesQuery } from '@/store/api/categoryApi';
import { Skeleton, Breadcrumbs } from '@/shared/ui';
import type { BreadcrumbItem } from '@/shared/ui';
import { t, getImageUrl } from '@/shared/lib/utils';

interface Props { locale: Locale; dict: Dictionary; slug: string }

export function DirectionPageClient({ locale, dict, slug }: Props) {
  const { data: direction, isLoading: dirLoading } = useGetDirectionBySlugQuery(slug);
  const { data: categories, isLoading: catLoading } = useGetCategoriesQuery(
    direction ? { direction: direction.id } : undefined,
    { skip: !direction },
  );

  const crumbs: BreadcrumbItem[] = [
    { label: dict.directions.title, href: `/${locale}/directions` },
  ];
  if (direction) crumbs.push({ label: t(direction.name, locale) });

  const list = categories ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={crumbs} homeHref={`/${locale}`} className="mb-6" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        {direction ? (
          <>
            <h1 className="text-3xl font-bold text-slate-900">{t(direction.name, locale)}</h1>
            <p className="mt-2 text-slate-500">{t(direction.description, locale)}</p>
          </>
        ) : (
          <>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </>
        )}
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {dirLoading || catLoading
          ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)
          : list.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  href={`/${locale}/directions/${slug}/${cat.slug}`}
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

      {!dirLoading && !catLoading && list.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-400">
          {dict.categories.noCategories}
        </div>
      )}
    </div>
  );
}
