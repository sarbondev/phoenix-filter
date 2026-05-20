import type { Locale } from "@/shared/types";
import { EngineeringClient } from "./EngineeringClient";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <EngineeringClient locale={lang as Locale} />;
}
