import type { Locale } from "@/shared/types";
import { CategoryClient } from "./CategoryClient";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  return <CategoryClient locale={lang as Locale} slug={slug} />;
}
