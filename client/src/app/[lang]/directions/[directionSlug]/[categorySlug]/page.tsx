import { Suspense } from 'react';
import { getDictionary } from '@/shared/i18n';
import type { Locale } from '@/shared/types';
import type { Metadata } from 'next';
import { CategoryProductsClient } from './CategoryProductsClient';
import { fetchCategoryBySlug, fetchDirectionBySlug } from '@/shared/lib/api-server';
import { t } from '@/shared/lib/utils';

export async function generateMetadata({ params }: { params: Promise<{ lang: string; directionSlug: string; categorySlug: string }> }): Promise<Metadata> {
  const { lang, directionSlug, categorySlug } = await params;
  const locale = lang as Locale;
  const category = await fetchCategoryBySlug(categorySlug, locale);
  const dict = await getDictionary(locale);

  if (!category) return { title: dict.categories.title };

  const name = t(category.name, locale);
  const description = t(category.description, locale) || `${name} — ${dict.categories.title}`;
  const title = `${name} | ${dict.categories.title}`;

  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
    alternates: {
      canonical: `/${locale}/directions/${directionSlug}/${categorySlug}`,
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ lang: string; directionSlug: string; categorySlug: string }> }) {
  const { lang, directionSlug, categorySlug } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  // Pre-fetch on server for breadcrumbs/SEO accuracy
  const [direction] = await Promise.all([
    fetchDirectionBySlug(directionSlug, locale),
  ]);

  return (
    <Suspense fallback={null}>
      <CategoryProductsClient
        locale={locale}
        dict={dict}
        directionSlug={directionSlug}
        categorySlug={categorySlug}
        directionName={direction ? t(direction.name, locale) : ''}
      />
    </Suspense>
  );
}
