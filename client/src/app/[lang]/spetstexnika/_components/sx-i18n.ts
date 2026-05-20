import type { Locale } from "@/shared/types";

/**
 * Shared micro-dictionary for spetstexnika sub-pages. Hosts the breadcrumb
 * labels, common empty-states and stock pills that were previously inlined as
 * locale ternaries (and were missing the kz translation).
 */
export const SX_T = {
  breadHome: {
    uz: "Bosh sahifa",
    ru: "Главная",
    en: "Home",
    kz: "Басты бет",
  },
  breadSpetstexnika: {
    uz: "Spetstexnika",
    ru: "Спецтехника",
    en: "Special equipment",
    kz: "Арнайы техника",
  },
  underOrder: {
    uz: "Buyurtma asosida",
    ru: "Под заказ",
    en: "Under order",
    kz: "Тапсырыс бойынша",
  },
  priceOnRequest: {
    uz: "So'rov bo'yicha",
    ru: "По запросу",
    en: "On request",
    kz: "Сұраныс бойынша",
  },
  inStock: {
    uz: "Mavjud",
    ru: "В наличии",
    en: "In stock",
    kz: "Бар",
  },
  pickFilterCta: {
    uz: "Filtr tanlash",
    ru: "Подобрать фильтр",
    en: "Find a filter",
    kz: "Сүзгіні таңдау",
  },
  categoryEmpty: {
    uz: "Bu toifada hali mahsulot yo'q",
    ru: "В этой категории пока нет товаров",
    en: "No products in this category yet",
    kz: "Бұл санатта әзірше өнімдер жоқ",
  },
  equipmentEmpty: {
    uz: "Tanlangan brend bo'yicha hali mahsulot yo'q",
    ru: "По выбранному бренду пока нет товаров",
    en: "No products for this brand yet",
    kz: "Таңдалған бренд бойынша әзірше өнімдер жоқ",
  },
  equipmentSubtitle: {
    uz: "Quyidagi texnika brendlari uchun filtrlar.",
    ru: "Фильтры для перечисленных ниже брендов техники.",
    en: "Filters for the equipment brands below.",
    kz: "Төмендегі техника брендтеріне арналған сүзгілер.",
  },
} as const;

type LS = { uz: string; ru: string; en: string; kz: string };
export const sx = (s: LS, locale: Locale): string => s[locale] ?? s.en;
