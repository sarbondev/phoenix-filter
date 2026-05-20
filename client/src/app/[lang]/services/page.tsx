import type { Locale } from "@/shared/types";
import { ServicesClient } from "./ServicesClient";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <ServicesClient locale={lang as Locale} />;
}
