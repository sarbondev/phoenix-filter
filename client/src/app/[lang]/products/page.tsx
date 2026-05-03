import { getDictionary } from '@/shared/i18n';
import type { Locale } from '@/shared/types';
import type { Metadata } from 'next';
import { ProductsPageClient } from './ProductsPageClient';

const LOCALES: Locale[] = ['uz', 'ru', 'en', 'kz'];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const title = `${dict.products.title} | FilterSystem`;
  const description =
    locale === 'ru'
      ? 'Каталог автомобильных фильтров — воздушные, масляные, топливные, салонные. Поиск по OEM-номеру и кросс-номерам MANN, FRAM, WIX, MAHLE.'
      : locale === 'en'
        ? 'Automotive filter catalogue — air, oil, fuel, cabin. Search by OEM number or cross-references from MANN, FRAM, WIX, MAHLE.'
        : locale === 'kz'
          ? 'Автокөлік сүзгілерінің каталогы — ауа, май, отын, салон. OEM нөмірі немесе MANN, FRAM, WIX, MAHLE кросс-нөмірлері бойынша іздеу.'
          : 'Avtomobil filtrlari katalogi — havo, moy, yoqilg\'i, salon. OEM raqami yoki MANN, FRAM, WIX, MAHLE kross-raqamlari bo\'yicha qidirish.';

  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
    alternates: {
      canonical: `/${locale}/products`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/products`])),
    },
  };
}

export default async function ProductsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  return <ProductsPageClient locale={locale} dict={dict} />;
}
