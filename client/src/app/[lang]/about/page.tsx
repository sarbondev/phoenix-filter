import type { Locale } from "@/shared/types";
import { AboutClient } from "./AboutClient";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <AboutClient locale={lang as Locale} />;
}
