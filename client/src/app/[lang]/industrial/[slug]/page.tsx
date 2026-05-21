import { Suspense } from "react";
import type { Locale } from "@/shared/types";
import { CategoryClient } from "./CategoryClient";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  return (
    <Suspense fallback={null}>
      <CategoryClient locale={lang as Locale} slug={slug} />
    </Suspense>
  );
}
