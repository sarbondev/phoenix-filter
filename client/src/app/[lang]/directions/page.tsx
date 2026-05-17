import { getDictionary } from '@/shared/i18n';
import type { Locale } from '@/shared/types';
import type { Metadata } from 'next';
import { DirectionsListClient } from './DirectionsListClient';

const LOCALES: Locale[] = ['uz', 'ru', 'en', 'kz'];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const title = `${dict.directions.title} | FilterSystem`;
  const description = dict.directions.subtitle;

  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
    alternates: {
      canonical: `/${locale}/directions`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/directions`])),
    },
  };
}

export default async function YonalishPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  return <DirectionsListClient locale={locale} dict={dict} />;
}
