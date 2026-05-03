import { getDictionary } from '@/shared/i18n';
import type { Locale } from '@/shared/types';
import type { Metadata } from 'next';
import { CategoriesPageClient } from './CategoriesPageClient';

const LOCALES: Locale[] = ['uz', 'ru', 'en', 'kz'];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const title = `${dict.categories.title} | FilterSystem`;
  const description =
    locale === 'ru'
      ? 'Все категории фильтров — авто и бытовые. Воздушные, масляные, топливные, салонные, спецтехника.'
      : locale === 'en'
        ? 'All filter categories — automotive and household. Air, oil, fuel, cabin, heavy-duty.'
        : locale === 'kz'
          ? 'Барлық сүзгі санаттары — авто және тұрмыстық. Ауа, май, отын, салон, ауыр техника.'
          : 'Barcha filter kategoriyalari — avto va maishiy. Havo, moy, yoqilg\'i, salon, og\'ir texnika.';

  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
    alternates: {
      canonical: `/${locale}/categories`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/categories`])),
    },
  };
}

export default async function CategoriesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  return <CategoriesPageClient locale={locale} dict={dict} />;
}
