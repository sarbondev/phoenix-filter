import { getDictionary } from "@/shared/i18n";
import type { Locale } from "@/shared/types";
import { HomeSections } from "@/widgets/hero/HomeSections";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  return <HomeSections locale={locale} dict={dict} />;
}
