import { getDictionary } from '@/shared/i18n';
import type { Locale } from '@/shared/types';
import { OrderDetailPageClient } from './OrderDetailPageClient';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ lang: string; orderNumber: string }>;
}) {
  const { lang, orderNumber } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  return <OrderDetailPageClient locale={locale} dict={dict} orderNumber={orderNumber} />;
}
