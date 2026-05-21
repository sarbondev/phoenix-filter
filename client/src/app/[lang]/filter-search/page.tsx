import { Suspense } from "react";
import type { Locale } from "@/shared/types";
import { FilterSearchClient } from "./FilterSearchClient";

export default async function FilterSearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { lang } = await params;
  const { q } = await searchParams;
  return (
    <Suspense fallback={null}>
      <FilterSearchClient locale={lang as Locale} initialQuery={q ?? ""} />
    </Suspense>
  );
}
