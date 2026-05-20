import type { Locale } from "@/shared/types";
import type { Metadata } from "next";
import { IndustriesClient } from "./IndustriesClient";

const titles: Record<string, string> = {
  en: "Industry solutions",
  ru: "Отраслевые решения",
  uz: "Tarmoq yechimlari",
  kz: "Салалық шешімдер",
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: titles[lang] || titles.en };
}

export default async function IndustriesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <IndustriesClient locale={lang as Locale} />;
}
