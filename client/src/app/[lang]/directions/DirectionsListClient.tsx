'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Compass } from 'lucide-react';
import type { Locale } from '@/shared/types';
import type { Dictionary } from '@/shared/i18n/dictionaries/en';
import { useGetDirectionsQuery } from '@/store/api/directionApi';
import { t, getImageUrl } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui';

interface Props { locale: Locale; dict: Dictionary }

export function DirectionsListClient({ locale, dict }: Props) {
  const { data: directions, isLoading } = useGetDirectionsQuery();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">{dict.directions.title}</h1>
        <p className="mt-2 text-slate-500">{dict.directions.subtitle}</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {isLoading
          ? Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-60 rounded-2xl" />)
          : (directions ?? []).map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={`/${locale}/directions/${d.slug}`}
                  className="group relative block overflow-hidden rounded-2xl h-60 bg-slate-100"
                >
                  {d.image ? (
                    <>
                      <Image
                        src={getImageUrl(d.image)}
                        alt={t(d.name, locale)}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/80" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                      <Compass className="h-14 w-14 text-slate-300" />
                    </div>
                  )}

                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <h3 className="text-base font-bold text-white leading-snug line-clamp-2 drop-shadow-lg">
                      {t(d.name, locale)}
                    </h3>
                    {d.description && (
                      <p className="mt-1 text-xs text-white/60 line-clamp-1">
                        {t(d.description, locale)}
                      </p>
                    )}
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-white/70 group-hover:text-white transition-colors">
                      {dict.common.viewDetails}
                      <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
      </div>

      {!isLoading && (!directions || directions.length === 0) && (
        <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-400">
          {dict.directions.empty}
        </div>
      )}
    </div>
  );
}
