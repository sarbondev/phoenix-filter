import { getDictionary } from '@/shared/i18n';
import type { Locale } from '@/shared/types';
import type { Metadata } from 'next';
import { CategoryProductsClient } from './CategoryProductsClient';
import { fetchCategoryBySlug } from '@/shared/lib/api-server';
import { t } from '@/shared/lib/utils';

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const category = await fetchCategoryBySlug(slug, locale);
  const dict = await getDictionary(locale);

  if (!category) {
    return { title: dict.categories.title };
  }

  const name = t(category.name, locale);
  const description = t(category.description, locale) || `${name} — ${dict.categories.title}`;
  const title = `${name} | ${dict.categories.title}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    alternates: {
      canonical: `/${locale}/categories/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  return <CategoryProductsClient locale={locale} dict={dict} slug={slug} />;
}
