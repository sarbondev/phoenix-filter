import type { Locale } from "@/shared/types";
import { ContactClient } from "./ContactClient";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <ContactClient locale={lang as Locale} />;
}
