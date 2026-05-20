import type { Locale } from "@/shared/types";
import type { Metadata } from "next";
import { ProductsOverviewClient } from "./ProductsOverviewClient";

const titles: Record<string, string> = {
  en: "Products",
  ru: "Продукция",
  uz: "Mahsulotlar",
  kz: "Өнім",
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: titles[lang] || titles.en };
}

export default async function ProductsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <ProductsOverviewClient locale={lang as Locale} />;
}
