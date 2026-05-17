import { getDictionary } from '@/shared/i18n';
import type { Locale } from '@/shared/types';
import type { Metadata } from 'next';
import { DirectionPageClient } from './DirectionPageClient';
import { fetchDirectionBySlug } from '@/shared/lib/api-server';
import { t } from '@/shared/lib/utils';

export async function generateMetadata({ params }: { params: Promise<{ lang: string; directionSlug: string }> }): Promise<Metadata> {
  const { lang, directionSlug } = await params;
  const locale = lang as Locale;
  const direction = await fetchDirectionBySlug(directionSlug, locale);
  const dict = await getDictionary(locale);

  if (!direction) return { title: dict.directions.title };

  const name = t(direction.name, locale);
  const description = t(direction.description, locale) || `${name} — ${dict.directions.title}`;
  const title = `${name} | ${dict.directions.title}`;

  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
    alternates: { canonical: `/${locale}/directions/${directionSlug}` },
  };
}

export default async function DirectionPage({ params }: { params: Promise<{ lang: string; directionSlug: string }> }) {
  const { lang, directionSlug } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  return <DirectionPageClient locale={locale} dict={dict} slug={directionSlug} />;
}
