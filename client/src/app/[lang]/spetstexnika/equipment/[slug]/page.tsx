import { Suspense } from "react";
import type { Locale } from "@/shared/types";
import { EquipmentClient } from "./EquipmentClient";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  return (
    <Suspense fallback={null}>
      <EquipmentClient locale={lang as Locale} slug={slug} />
    </Suspense>
  );
}
